const express = require("express");
const cookieParser = require("cookie-parser");
const { format } = require('date-fns-tz');
const router = express.Router();
const bcrypt = require("bcryptjs");
const Influencer = require("../models/Influencer");
const CreatorInstagramDetails = require("../models/CreatorInstagramDetails");
const InstaPageMetrics = require("../models/InstaPageMetrics");
const PostMetrics = require("../models/PostMetrics");
const PublishedPostMetrics = require("../models/PublishedPostMetrics");
const Brand = require("../models/Brand");
const TempBrand = require("../models/BrandTemp");
const Campaign = require('../models/Campaign');
const CampaignRequests = require('../models/CampaignRequests');
const CampaignApprovedRequests = require('../models/CampaignApprovedRequests');
const CampaignDeclinedRequests = require('../models/CampaignDeclinedRequests');
const PlanDetails = require('../models/PlanDetails');
const ScheduledPosts = require("../models/ScheduledPosts");

const multer = require('multer');
const { body, validationResult } = require("express-validator");
// const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");

const { createToken, isBrandAuthenticated } = require("../middleware/jwtToken");
const agenda = require('../middleware/agendaManager');
const PublishedPosts = require("../models/PublishedPosts");
const axios = require("axios");

const fs = require("fs");
const app = express();
app.use(cookieParser());

const logger = require('../logger');


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // credentials: {
  //   accessKeyId: 'AKIAY3TLOSKVZM4UHBMX',
  //   secretAccessKey: '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',
  // },
  region: 'ap-south-1',
});

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 1024 * 1024 * 10 }, // Limit individual file size to 10MB (adjust as needed)
// });

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


router.post("/signup-brand", async (req, res, next) => {
  try {
    const { email, password, brand, category, igHandle } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();


    const options = {
      to: email,
      subject: "Verify Account - BroadReach",
      text: `Your 6-digit PIN: ${pin}`,
  }


    const existingUser = await Brand.findOne({ email: lowerCaseEmail });
    const existingUserInTemp = await TempBrand.findOne({ email : lowerCaseEmail});

   
    if (!lowerCaseEmail || !password || !brand || !category) {
      return res.status(400).send({
         error: "All fields are mandatory",
         data: null,
         message: "Please provide all fields",
       });
     }

    else if (existingUser) {
      return res.status(400).send({
        error: "User already exists",
        data: null,
        message: "User already exists with the same email address. Please login to continue.",
      });
    }

    else if(existingUserInTemp){

      existingUserInTemp.password = hashedPassword;
      existingUserInTemp.brand_name = brand;
      existingUserInTemp.category = category;
      existingUserInTemp.reset_pin = pin;
      existingUserInTemp.instagram_handle = igHandle;
      existingUserInTemp.save();
      await sendMail(options);

     return res.status(200).send({ success: true });

    }

    else{

    await TempBrand.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      brand_name: brand,
      category: category,
      instagram_handle : igHandle,
      reset_pin : pin
    });
    await sendMail(options);

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});



router.post("/brand-login", async (req, res, next) => {

  // logger.info('Entered login');

  try {
    const { email, password } = req.body;

    if (!email || !password) {
     return res.status(400).send({
        error: "All fields are mandatory",
        data: null,
        message: "Please provide all fields",
      });
    }

    const user = await Brand.findOne({ email }).select("+hashPassword");

    if (!user) {
      return res.status(400).send({
        error: "User does not exists!",
        data: null,
        message: "User does not exists!",
      });
    }

    bcrypt.compare(password, user.password, function (err1, result) {
      if (result === true) {
      createToken(user, res);
      

      } else {
        logger.customerLogger.log('error', 'Error creating token');
        return res.status(400).send({
          error: "email, password mismatch",
          data: null,
          message: "Wrong Email or Password",
        });
      }

    });
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});

router.post("/check-email-exists-sendMail", async function (req, res) {

  const { email } = req.body;
  const pin = generatePin();

  
  Brand.findOne({ email : email}).then( async (result)=>{

    if(result){

      const options = {
        to: email,
        subject: "Password Reset PIN - BroadReach",
        text: `Your 6-digit PIN: ${pin}`,
    }

    await Brand.findByIdAndUpdate(result._id, { reset_pin: pin });
    await sendMail(options);

    res.status(200).send({ exists : true, emailSent: true});
    res.end();


    }

    else{

      res.status(200).send({ exists: false});
      res.end();


    }

  }).catch((err) =>{

  })


});

router.post("/check-resetPin-withDb-brandTemps", async function (req, res) {

  const { email, pin } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const pinAsInt = parseInt(pin);
  
  TempBrand.findOne({ email : lowerCaseEmail}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

      await Brand.create({
        email: lowerCaseEmail,
        password: result.password,
        brand_name: result.brand_name,
        category: result.category,
        instagram_handle: result.instagram_handle,
        reset_pin : pin,
        balance : 0,
        purchased_plan : '',
        brand_logo : ''
      });

      await TempBrand.deleteOne({ email: lowerCaseEmail  });


  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});


router.post("/check-resetPin-withDb", async function (req, res) {

  const { email, pin } = req.body;
  const pinAsInt = parseInt(pin);
  
  Brand.findOne({ email : email}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});



router.post("/update-password", async function (req, res) {

  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  
  Brand.findOne({ email : email}).then(async (result)=>{

    if(result){

      await Brand.findByIdAndUpdate(result._id, { password: hashedPassword });
 
  res.status(200).send({ success: true});
  res.end();


    }

    else{

      res.status(200).send({ success: false});
      res.end();


    }

  }).catch((err) =>{

  })

});


//below code is for updating password from profile settings page

router.post("/change-password", async function (req, res) {

  const { userId, password, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);


  
  Brand.findById(userId).select("+hashPassword").then((result)=>{

    if(result){

      bcrypt.compare(password, result.password, async function (err1, ress) {
        if (ress === true) {

          console.log('Correct Password');

          await Brand.findByIdAndUpdate(result._id, { password: hashedPassword });
          res.status(200).send({ success: true});
          res.end();
        
  
        } else {
          console.log('Wrong Password');
          return res.status(400).send({
            error: "Wrong current password",
            data: null,
            message: "Wrong current password",
          });
        }
  
      });

    }

    else{

      res.status(200).send({ success: false});
      res.end();


    }

  }).catch((err) =>{

  })

});







router.get("/getUser", isBrandAuthenticated, (req, res, next) => {

if(req.statusCode == 400){

  // res.status(200).send({ data: null });
  res.status(200).send({data: null});
          res.end();
}

else {
  const userId = req.userId;
  res.status(200).send({data: userId});
}

});


router.post("/create-campaign", upload.array('images', 5), async (req, res, next) => {
  const {
    userId,
    campaignName,
    caption,
    publishDate,
    fileType,
    duration
  } = req.body;

  Brand.findById(userId)
    .then(async (brandDetails) => {
      const uploadedImages = []; // Initialize an array to store uploaded image URLs
      const totalFiles = req.files.length;

      const uploadFileToS3 = async (file, index) => {
        const params = {
          Bucket: 'broadreachbucket',
          Key: `images/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ServerSideEncryption: 'AES256',
        };

        try {
          const result = await s3.send(new PutObjectCommand(params));
          const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
          uploadedImages[index] = s3Url;
        } catch (error) {
          console.error(`Error uploading image ${index + 1} to S3:`, error);
          // Handle the error, e.g., log it or store it in an error array
        }
      };

      // Iterate through the files and upload each one to S3
      await Promise.all(req.files.map(uploadFileToS3));

      // If all images are uploaded, proceed to create the campaign
      if (uploadedImages.length === totalFiles && uploadedImages.every(Boolean)) {
        // Create the campaign with the array of uploaded image URLs
        const createCampaign = new Campaign({
          campaign_name: campaignName,
          caption: caption,
          publishDate: publishDate,
          fileType: fileType,
          mediaFiles: uploadedImages,
          brandUser_id: userId,
          brand_name: brandDetails.brand_name,
          brand_category: brandDetails.category,
          videoDuration: duration
        });

        try {
          const item = await createCampaign.save();
          res.status(200).send({ data: item });
        } catch (err) {
          res.status(500).send({
            error: 'Creating campaign failed',
            data: null,
            message: 'Oops! Please try again',
          });
        }
      } else {
        // Handle the case where not all images are uploaded
        res.status(500).send({
          error: 'Uploading images failed',
          data: null,
          message: 'Oops! Please try again',
        });
      }
    })
    .catch((e) => {
      console.error('Error:', e);
      res.status(500).send({
        error: 'Error while processing the request',
        data: null,
        message: 'Oops! Please try again',
      });
    });
});




router.post('/update-campaign', (req, res, next) => {
      const { campaignName, caption, campaignId } = req.body;
    
      Campaign.findByIdAndUpdate(campaignId, { campaign_name: campaignName, caption: caption })
        .then((updatedCampaign) => {
          if (!updatedCampaign) {
            return res.status(404).send({ error: 'Campaign not found' });
          }
          res.status(200).send({ data: updatedCampaign });
        })
        .catch((err) => {
          console.error('Error:', err);
          res.status(500).send({
            error: 'Updating campaign failed',
            data: null,
            message: 'Oops! Please try again',
          });
        });
    });


    router.post('/campaign-mark-completed', (req, res, next) => {
      const { campaignId } = req.body;
  
    
      Campaign.findByIdAndUpdate(campaignId, { is_completed: true })
        .then((updatedCampaign) => {
          if (!updatedCampaign) {
            return res.status(404).send({ error: 'Campaign not found' });
          }
          res.status(200).send({ success: true });
        })
        .catch((err) => {
          console.error('Error:', err);
          res.status(500).send({
            error: 'Updating campaign failed',
            data: null,
            message: 'Oops! Please try again',
          });
        });
    });

    router.post('/campaign-delete', (req, res, next) => {
      const { campaignId } = req.body;
  
    
      Campaign.findByIdAndUpdate(campaignId, { is_del: true })
      .then((deletedCampaign) => {
        if (deletedCampaign) {
          // Campaign was found and deleted
          res.status(200).send({ deleted: true });
        } else {
          // Campaign not found
          res.status(200).send({ deleted: false });
          
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).send({
          error: 'Deleting campaign failed',
          data: null,
          message: 'Oops! Please try again',
        });
      });

    });
    

router.post('/check-campaign-deletable', (req, res, next) => {
      const { campaignId } = req.body;
    
      CampaignRequests.exists({ campaign_id: campaignId })
       .then((exists) => {
          if (exists) {
            return res.status(200).send({ isDeletable: false });
          }
          res.status(200).send({ isDeletable: true });
        })
        .catch((err) => {
          console.error('Error:', err);
          res.status(500).send({
            error: 'Updating campaign failed',
            data: null,
            message: 'Oops! Please try again',
          });
        });
    });


router.post('/all-campaigns', async (req, res, next) => {
  const user_id = req.body.userId;

  const result = await Campaign.find({ 'brandUser_id': user_id, 'is_del': false });

  result.sort((a, b) => {
    if (a.is_completed === b.is_completed) {
      return a._id - b._id; // Sort by _id
    }
    if (a.is_completed === false) {
      return -1; // On-Going campaigns come first
    }
    return 1; // Completed campaigns come next
  });


  const tableData = await Promise.all(result.map(async (data, index) => {
  
  
    return {
      id: index + 1,
      campaignId: data._id,
      name: data.campaign_name,
      createdDate: data.created_at,
      description: data.description,
      publishDate: data.publishDate,
      status: data.is_completed,
      avatar: data.mediaFiles[0],
      fileType: data.fileType,
    };
  }));
  

  res.status(200).send({ data: tableData });
});



router.post('/get-campaign-details', async function (req, res){

  const user_id = req.body.userId;
  const campaignId = req.body.campaignId;



  Campaign.findById(campaignId).then((result)=>{

    res.status(200).send({ data: result});
    res.end();


  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/get-total-campaigns', async function (req, res){

  const user_id = req.body.userId;

  Campaign.find({'brandUser_id': user_id}).then((result)=>{

    if(result){
    res.status(200).send({ data: result.length});
    res.end();

    }

    else{
    res.status(200).send({ data: 0});
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});


router.post('/get-total-ongoing-campaigns', async function (req, res){

  const user_id = req.body.userId;
  let onGoingCampaigns = 0;

  Campaign.find({'brandUser_id': user_id}).then((result)=>{

  result.forEach(campaignData => {
    onGoingCampaigns += campaignData.is_completed ? 0 : 1;
  });

  // const sendData = {
  //   'total_campaigns': result.length,
  //   'onGoing_campaigns': onGoingCampaigns,
  //   'completed_campaigns' : completedCampaigns
  // }
  
    res.status(200).send({ data: onGoingCampaigns});
    res.end();


  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/get-total-completed-campaigns', async function (req, res){

  const user_id = req.body.userId;
  let completedCampaigns = 0;

  Campaign.find({'brandUser_id': user_id}).then((result)=>{

  result.forEach(campaignData => {
    completedCampaigns += campaignData.is_completed ? 1 : 0;
  });

  // const sendData = {
  //   'total_campaigns': result.length,
  //   'onGoing_campaigns': onGoingCampaigns,
  //   'completed_campaigns' : completedCampaigns
  // }
  
    res.status(200).send({ data: completedCampaigns});
    res.end();


  }).catch(e2=>{

    console.log('Error2', e2);

  })
});


router.post('/campaign/check-shown-interest', async function (req, res){

  const user_id = req.body.userId;
  const campaignId = req.body.campaignId;
  let interestedCreatorsIds = [];


  Campaign.findById(campaignId).then((result)=>{

  interestedCreatorsIds = result.received_interests.map(id => id.toString());


res.status(200).send({ data: interestedCreatorsIds});
res.end();
   

  }).catch((e)=>{

    console.log('Error:',e );


  });

});

router.post('/campaign/get-interested-creators-data', async function (req, res) {
  const campaignId = req.body.campaignId;

  try {
    const result = await Campaign.findById(campaignId);

    if (result) {
      const allInterestArrays = [
        { array: result.received_interests, status: 'Requested' },
        { array: result.accepted_interests, status: 'Accepted' },
        { array: result.declined_interests, status: 'Declined' },
        { array: result.onGoing_camp_influencers, status: 'OnGoing' },
        { array: result.completed_influencers, status: 'Completed' },
      ];

      const interestedCreatorsData = allInterestArrays.flatMap(({ array }) => array);

      const dataArray = await Promise.all(
        interestedCreatorsData.map(async (id) => {
          const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id });
          return document;
        })
      );

      const pricePromises = dataArray.map(async (data) => {
        const res_price = await Influencer.findById(data.influencer_id);
        return res_price.costPerPost;
      });

      const prices = await Promise.all(pricePromises);

      const creatorsData = dataArray.map((data, index) => {
        const interestArray = allInterestArrays.find(({ array }) => array.includes(data.influencer_id));
        const status = interestArray ? interestArray.status : 'Unknown';

        return {
          'id': index + 1,
          'influencer_id': data.influencer_id,
          'creatorName': data.iG_name,
          'avatar': data.iG_profile_pic_url,
          'followers': data.followers_count,
          'category': data.category,
          'profile': 'https://www.instagram.com/' + data.iG_username,
          'insights': data.influencer_id.toString(),
          'status': status,
          'pricePerPost': prices[index]
        };
      });

      res.status(200).send({ data: creatorsData });
      res.end();
    } else {
      console.log('Campaign not found');
      res.status(404).send({ error: 'Campaign not found' });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ error: 'An error occurred' });
  }
});

router.post('/completed-campaign-metrics', async (req, res, next)=>{


  const campaign_id = req.body.campaignId;
  let reach = 0;
  let impressions = 0;
  let verifiedPosts = 0;
  let budget = 0;

try{

  const result = await PublishedPosts.find({ campaign_id: campaign_id });
  for (const dataReach of result) {
   
    const result2 = await PostMetrics.findOne({ 'media_id': dataReach.media_id });
    reach += result2.reach;
    impressions += result2.impressions;
    budget += dataReach.costPerPost;

    if(dataReach.verified_on_instagramPage){

      verifiedPosts = verifiedPosts + 1;

    }
  }

  res.status(200).send({ data: { 'verifiedPosts': verifiedPosts, 'reach': reach, 'impressions':impressions, 'budget': budget } });
  res.end();

}

catch(error){
  res.status(500).send({data: 'error'});
  res.end();

}



});

router.post('/completed-campaign-metrics-from-Api', async (req, res, next)=>{


  const campaign_id = req.body.campaignId;
  let totalReach = 0;
  let totalPlays = 0;
  let totalImpressions = 0;
  let totalBudgetSpent = 0;
  let totalInfluencers = 0;

try{

  const result = await PublishedPosts.find({ campaign_id: campaign_id });



      await Promise.all( result.map(async (dataReach, index) => {

      const creator_details = await Influencer.findById(dataReach.influencer_id);

      const result2 = await CreatorInstagramDetails.findOne({
        influencer_id: dataReach.influencer_id
      });

      const apiUrl = "https://graph.facebook.com/v17.0/" + dataReach.media_id + 
      "?fields=permalink,media_product_type,media_type&access_token=" 
      + creator_details.access_token;
      const media_details = await axios.get(apiUrl);


      if(media_details.data.media_product_type === 'REELS' && media_details.data.media_type === 'VIDEO'){

        const url = "https://graph.facebook.com/v18.0/" + dataReach.media_id + 
        "/insights?metric=reach,plays,total_interactions&access_token=" 
        + creator_details.access_token;
        const publishedData = await axios.get(url);

        totalReach = totalReach + publishedData.data.data[0].values[0].value;
        totalPlays = totalPlays + publishedData.data.data[1].values[0].value;
        totalBudgetSpent = totalBudgetSpent + dataReach.costPerPost;
        totalInfluencers = totalInfluencers + 1;

        const publishedPostMetricsAvailable = await PublishedPostMetrics.findOne({ post_id : dataReach.media_id});

        if(publishedPostMetricsAvailable){

          publishedPostMetricsAvailable.reach = publishedData.data.data[0].values[0].value;
          publishedPostMetricsAvailable.plays = publishedData.data.data[1].values[0].value;
          publishedPostMetricsAvailable.engagement = publishedData.data.data[2].values[0].value;
          publishedPostMetricsAvailable.save();
        }

        else{


        await PublishedPostMetrics.create({
          post_id : dataReach.media_id,
          reach : publishedData.data.data[0].values[0].value,
          engagement : publishedData.data.data[2].values[0].value,
          plays : publishedData.data.data[1].values[0].value,
          permaLink : media_details.data.permalink,
          campaign_id : campaign_id,
          media_type : media_details.data.media_type,
          media_product_type : media_details.data.media_product_type,
          brandUser_id : dataReach.brandUser_id,
          creatorName: result2.iG_name,
          avatar: result2.iG_profile_pic_url,
          profile: 'https://www.instagram.com/' + result2.iG_username,
          pricePerPost: dataReach.costPerPost,

        })

      }

      }

      else{

        const url = "https://graph.facebook.com/v18.0/" + dataReach.media_id + 
        "/insights?metric=reach,impressions,total_interactions&access_token=" 
        + creator_details.access_token;
        const publishedData = await axios.get(url);

        totalReach = totalReach + publishedData.data.data[0].values[0].value;
        totalImpressions = totalImpressions + publishedData.data.data[1].values[0].value;
        totalBudgetSpent = totalBudgetSpent + dataReach.costPerPost;
        totalInfluencers = totalInfluencers + 1;


      
        const publishedPostMetricsAvailable = await PublishedPostMetrics.findOne({ post_id : dataReach.media_id});

        if(publishedPostMetricsAvailable){

          publishedPostMetricsAvailable.reach = publishedData.data.data[0].values[0].value;
          publishedPostMetricsAvailable.impressions = publishedData.data.data[1].values[0].value;
          publishedPostMetricsAvailable.engagement = publishedData.data.data[2].values[0].value;
          publishedPostMetricsAvailable.save();
        }

        else{

        

        await PublishedPostMetrics.create({
          post_id : dataReach.media_id,
          reach : publishedData.data.data[0].values[0].value,
          engagement : publishedData.data.data[2].values[0].value,
          impressions : publishedData.data.data[1].values[0].value,
          permaLink : media_details.data.permalink,
          campaign_id : campaign_id,
          media_type : media_details.data.media_type,
          media_product_type : media_details.data.media_product_type,
          brandUser_id : dataReach.brandUser_id,
          creatorName: result2.iG_name,
          avatar: result2.iG_profile_pic_url,
          profile: 'https://www.instagram.com/' + result2.iG_username,
          pricePerPost: dataReach.costPerPost,

        })

      }

      }


    })
  );


  res.status(200).send({ status: true });
  res.end();

}

catch(error){
  res.status(500).send({data: 'error'});
  res.end();

}



});

router.post('/completed-campaign-metrics-table-from-Db', async (req, res, next)=>{



  const campaign_id = req.body.campaignId;
  let totalReach = 0;
  let totalPlays = 0;
  let totalImpressions = 0;
  let totalBudgetSpent = 0;
  let totalInfluencers = 0;

try{

  const result = await PublishedPostMetrics.find({ campaign_id: campaign_id });

  const tableData = await Promise.all(
    result.map(async (postData, index) => {
    
      if(postData.media_product_type === 'REELS' && postData.media_type === 'VIDEO'){

        totalReach = totalReach + postData.reach;
        totalPlays = totalPlays + postData.plays;
        totalBudgetSpent = totalBudgetSpent + postData.pricePerPost;
        totalInfluencers = totalInfluencers + 1;

         return {
          id: index + 1,
          creatorName: postData.creatorName,
          avatar: postData.avatar,
          profile: postData.profile,
          postDetails: postData.permaLink,
          pricePerPost: postData.pricePerPost,
          reach: postData.reach,
          plays: postData.plays,
          engagement: postData.engagement,
          pricePerReach: (postData.pricePerPost/postData.reach).toFixed(2),
          media_type : postData.media_type
          
        };

      }

     else {

        totalReach = totalReach + postData.reach;
        totalImpressions = totalImpressions + postData.impressions;
        totalBudgetSpent = totalBudgetSpent + postData.pricePerPost;
        totalInfluencers = totalInfluencers + 1;

         return {
          id: index + 1,
          creatorName: postData.creatorName,
          avatar: postData.avatar,
          profile: postData.profile,
          postDetails: postData.permaLink,
          pricePerPost: postData.pricePerPost,
          reach: postData.reach,
          impressions: postData.impressions,
          engagement: postData.engagement,
          pricePerReach: (postData.pricePerPost/postData.reach).toFixed(2),
          media_type : postData.media_type

        
          
        };

      }
    })
  );



  // console.log('Table Data::::', tableData);

  

  res.status(200).send({ data: tableData,  totalReach:totalReach, totalImpressions:totalImpressions, totalBudgetSpent:totalBudgetSpent,
    totalInfluencers:totalInfluencers, totalPlays:totalPlays });
  res.end();




}

catch(error){
  res.status(500).send({data: 'error'});
  res.end();

}



});

router.post('/campaign-new-requests-total-number', async function (req, res){

  const campaignId = req.body.campaignId;

try{

  const result = await CampaignRequests.find({campaign_id : campaignId});


  res.status(200).send({requestsNumber: result.length});
  res.end();




}
catch(e){


}




});

router.post('/campaign-new-requests', async function (req, res){

  const campaignId = req.body.campaignId;
  let estAvgReachImage = 0;
  let totalImages = 0;
  let estAvgReachVideo = 0;
  let totalVideos = 0;



try{

  const result = await CampaignRequests.find({campaign_id : campaignId});

  
  const campaignData = await Promise.all(
    result.map(async (id, index) => {
      const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id.creator_id });
      const campaignDetails = await Campaign.findById(id.campaign_id);

      if(campaignDetails.fileType === 'image'){

        const getAverageReachImages = await PostMetrics.find({influencer_id : id.creator_id, media_type: { $in: ['IMAGE', 'CAROUSEL_ALBUM'] }});
        await Promise.all( getAverageReachImages.map(async (dat) =>{

        // console.log('Reach::::', dat.reach);

  
          estAvgReachImage = estAvgReachImage + dat.reach;
          totalImages = totalImages + 1;
  
        }));

      }

      else if(campaignDetails.fileType === 'video'){

        const getAverageReachVideos = await PostMetrics.find({influencer_id : id.creator_id, media_type : 'VIDEO'});
        await Promise.all( getAverageReachVideos.map(async (dat) =>{

        console.log('Reach::::', dat.reach);
  
          estAvgReachVideo = estAvgReachVideo + dat.reach;
          totalVideos = totalVideos + 1;
  
        }));

      }



     

      return {
        'id': index + 1,
        'influencer_id': document.influencer_id,
        'creatorName': document.iG_name,
        'avatar': document.iG_profile_pic_url,
        'followers': document.followers_count,
        'category': document.category,
        'profile': 'https://www.instagram.com/' + document.iG_username,
        'insights': document.influencer_id.toString(),
        'status': 'Requested',
        'pricePerPost': id.quoted_price,
        'publishDate' : campaignDetails.publishDate,
        'caption' : campaignDetails.caption,
        'campaign_id': campaignDetails._id,
        'estAvgReach' : campaignDetails.fileType ==='image' ? (estAvgReachImage/totalImages) : (estAvgReachVideo/totalVideos)
      };
    })
  );


  console.log('Total Reach::::', estAvgReachVideo);
  console.log('Total Videos::::', totalVideos);
  res.status(200).send({campaignData: campaignData});
  res.end();




}
catch(e){


}




});


router.post('/campaign-new-requests-accept', async function (req, res) {
  const campaignId = req.body.campaignId;
  const creatorId = req.body.creatorId;
  const caption = req.body.caption;
  const costPerPost = req.body.costPerPost;
  const brandId = req.body.brandId;
  const publishDate = req.body.publishDate;
  try {

    const brandBalance = await Brand.findById(brandId);


    if(brandBalance.balance >= costPerPost){

      const updatedBalance = brandBalance.balance-costPerPost;
    CampaignRequests.findOne({$and: [{ campaign_id: campaignId }, { creator_id: creatorId }]}).then(async(result)=> {

      if(result){
        await CampaignApprovedRequests.create({
          campaign_id: campaignId,
          creator_id: creatorId,
          caption: caption,
          accepted_price: costPerPost,
          publishDate: publishDate,
          brand_id: brandId,
          is_scheduled: true,
        });

        brandBalance.balance = updatedBalance;
        brandBalance.save();

        await CampaignRequests.deleteOne({ $and: [{ campaign_id: campaignId }, { creator_id: creatorId }] });

        res.status(200).send({success: true, balance: updatedBalance });
        res.end();

      }

      
    }).catch((error) =>{
    
                    });
                  }

                  else{
                              res.status(200).send({ success: false });
                    
                            
                    
                            }


                  
                  } 

catch (e) {
    res.status(500).send({ message: 'Internal server error' });
  }
});


router.post('/campaign-new-requests-decline', async function (req, res) {
  const campaignId = req.body.campaignId;
  const creatorId = req.body.creatorId;
  const costPerPost = req.body.costPerPost;
  try {

    CampaignRequests.findOne({$and: [{ campaign_id: campaignId }, { creator_id: creatorId }]}).then(async(result)=> {

      if(result){
        await CampaignDeclinedRequests.create({
          campaign_id: campaignId,
          creator_id: creatorId,
          quoted_price: costPerPost,
        });

        await CampaignRequests.deleteOne({ $and: [{ campaign_id: campaignId }, { creator_id: creatorId }] });

        res.status(200).send({success: true});
        res.end();

      }
    }).catch((error) =>{
})} 

catch (e) {
    res.status(500).send({ message: 'Internal server error' });
  }
});


router.post('/campaign-approved-requests', async function (req, res){

  const campaignId = req.body.campaignId;

  try{

    const result = await CampaignApprovedRequests.find({campaign_id : campaignId});
  
    
    const campaignData = await Promise.all(
      result.map(async (id, index) => {
        const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id.creator_id });
        const publishDate = await Campaign.findById(id.campaign_id);
  
       
  
        return {
          'id': index + 1,
          'influencer_id': document.influencer_id,
          'creatorName': document.iG_name,
          'avatar': document.iG_profile_pic_url,
          'followers': document.followers_count,
          'category': document.category,
          'profile': 'https://www.instagram.com/' + document.iG_username,
          'insights': document.influencer_id.toString(),
          'status': 'Approved',
          'pricePerPost': id.accepted_price,
          'publishDate' : publishDate.publishDate
        };
      })
    );
  
  
    res.status(200).send({campaignData: campaignData});
    res.end();
  
  
  
  
  }
  catch(e){
  
  
  }




});

router.post('/campaign-declined-requests', async function (req, res){

  const campaignId = req.body.campaignId;

try{

  const result = await Campaign.findById(campaignId);

  const campaignData = await Promise.all(
    result.declined_interests.map(async (id, index) => {
      const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id });
      const pricePerPost = await Influencer.findById(id);

      return {
        'id': index + 1,
        'influencer_id': document.influencer_id,
        'creatorName': document.iG_name,
        'avatar': document.iG_profile_pic_url,
        'followers': document.followers_count,
        'category': document.category,
        'profile': 'https://www.instagram.com/' + document.iG_username,
        'insights': document.influencer_id.toString(),
        'status': 'Declined',
        'pricePerPost': pricePerPost.costPerPost
      };
    })
  );


  res.status(200).send({campaignData: campaignData});
  res.end();




}
catch(e){


}




});

router.post('/get-account-balance', async function (req, res){

  const brand_id = req.body.brand_id;

  await Brand.findById(brand_id).then((result)=>{
  
    res.status(200).send({ balance: result.balance});
    res.end();


  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/check-brand-plan-details', async function (req, res){

  const user_id = req.body.userId;
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
  const isoFirstDayOfMonth = firstDayOfMonth.toISOString();
  const isoLastDayOfMonth = lastDayOfMonth.toISOString();


  Brand.findById(user_id).then((result)=>{

if(result.purchased_plan == null || result.purchased_plan == '' || result.purchased_plan == 'SM01' || result.purchased_plan == 'SY01'){

  Campaign.find({
    brandUser_id: user_id,
    created_at: {
      $gte: new Date(isoFirstDayOfMonth),
      $lte: new Date(isoLastDayOfMonth),
    },
  })
    .countDocuments()
    .then((campaignCount) => {
    

      if (campaignCount > 0) {
       return  res.status(200).send({ onPlan: false, campaignTried: true});
     }
     res.status(200).send({ onPlan: false, campaignTried: false });
   })
   .catch((err) => {
     console.error('Error:', err);
     res.status(500).send({
       error: 'Updating campaign failed',
       data: null,
       message: 'Oops! Please try again',
     });
   });

}

else{

  res.status(200).send({ onPlan: true, purchased_plan: result.purchased_plan});

}
  }).catch((e)=>{

    console.log('Error:',e );


  });

});

router.post('/purchased-plan-details', async function (req, res){

      const plan_id = req.body.planId;

      PlanDetails.findOne({ plan_id : plan_id}).then((result)=>{
    if(result){

      res.status(200).send({ planDetails: result});
      res.end();

    }
    else{
      console.log('error');

    }
      }).catch((e)=>{

        console.log('Error:',e );
      });

});


router.post('/settings-brand-details', async function (req, res){

  const user_id = req.body.userId;
  Brand.findById(user_id).then((result)=>{
    if(result){
      res.status(200).send({ brandDetails: result});
      res.end();
    }
    else{
      console.log('Fetching Brand Details Error');
    }

  }).catch((e)=>{
    console.log('Error:',e );
  });
});


router.post('/update-brand-logo', upload.single('image'), async function (req, res){

  const user_id = req.body.brand_id;

  const uploadFileAndUpdateBrandLogo = (file, index) => {
    const params = {
      Bucket: 'broadreachbucket', 
      Key: `images/${Date.now()}_${file.originalname}`, 
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: 'AES256',
    };
  
    return s3.send(new PutObjectCommand(params))
      .then(() => {
        // Construct and return the S3 URL
        const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

        return Brand.findByIdAndUpdate(user_id, { brand_logo: s3Url })
        .then((updatedBrand) => {
          if (!updatedBrand) {
            return Promise.reject({ error: 'Brand not found' });
          }
          return s3Url;
        });

      })
      .catch((error) => {
        // Handle errors here if needed
        console.error(`Error uploading image ${index + 1} to S3:`, error);
        return Promise.reject(error);
      });
  };

      uploadFileAndUpdateBrandLogo(req.file, user_id)
        .then(() => {
          // File uploaded and brand logo updated successfully
          res.status(200).send({ updated: true });
        })
        .catch((error) => {
          // Handle any errors that occurred during file upload and brand logo update
          console.error('Error uploading file and updating brand logo:', error);
          res.status(500).json({ error: 'Error uploading image and updating brand logo' });
        });

});

router.post('/update-brand-name', async function (req, res){

  const user_id = req.body.brand_id;
  const newBrandName = req.body.newBrandName;


  Brand.findByIdAndUpdate(user_id, { brand_name: newBrandName })
  .then((updatedCampaign) => {
    if (!updatedCampaign) {
      return res.status(404).send({ error: 'Campaign not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating campaign failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });
  
});

router.post('/update-brand-instagramHandle', async function (req, res){

  const user_id = req.body.brand_id;
  const newInstagramHandle = req.body.instagram_handle;


  Brand.findByIdAndUpdate(user_id, { instagram_handle: newInstagramHandle })
  .then((updatedCampaign) => {
    if (!updatedCampaign) {
      return res.status(404).send({ error: 'Brand not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating campaign failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });
  
});

router.post('/update-brand-category', async function (req, res){

  const user_id = req.body.brand_id;
  const newBrandCategory = req.body.newBrandCategory;


  Brand.findByIdAndUpdate(user_id, { category: newBrandCategory })
  .then((updatedCampaign) => {
    if (!updatedCampaign) {
      return res.status(404).send({ error: 'Campaign not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating campaign failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });
  
});


// const addPlans = async () => {
//   try {

//     const createPlan = new PlanDetails({
//      plan_name: 'startup',
//      no_of_campaigns: 10000,
//      price_in_usd: 49,
//     });

//     createPlan.save().then((item) => {
     
//     }).catch((err) => {
      
//     });

//   } catch (error) {
//     console.error("Error retrieving user data:", error);
//   }
// };

// addPlans();


router.post("/creator-followers", async function (req, res) {
  let user_id = req.body.userId;
  let followers_count = 0;

  setTimeout(()=>{
    CreatorInstagramDetails.findOne({ influencer_id: user_id })
    .then((result) => {
      // console.log('Result:::::', result);
      // console.log('Count::::', result.followers_count);
      followers_count = result.followers_count;
      res.status(200).send({ followers: followers_count });
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });


  }, 1000);

  // getUserData(instagram_account_id, user_id, fields, access_token);
});


router.post("/creator-posts", async function (req, res) {
  let user_id = req.body.userId;
  // console.log('user_id:::', user_id);
  let media_count = 0;

  CreatorInstagramDetails.findOne({ influencer_id: user_id })
    .then((result) => {
      media_count = result.media_count;
      res.status(200).send({ media: media_count });
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post("/creator-reach-28days", async function (req, res) {
  let user_id = req.body.userId;

  setTimeout(()=>{
    CreatorInstagramDetails.findOne({ influencer_id: user_id })
    .then((result) => {
      reach_28days = result.reach_last_28days;
      res.status(200).send({ reach: reach_28days });
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });


  }, 1000);

 

  // getUserData(instagram_account_id, user_id, fields, access_token);
});


router.post("/creator-impressions-28days", async function (req, res) {
  let user_id = req.body.userId;

  setTimeout(()=>{
    CreatorInstagramDetails.findOne({ influencer_id: user_id })
    .then((result) => {
      impressions_28days = result.impressions_last_28days;
      reach_28days = result.reach_last_28days;
      res.status(200).send({ impressions: impressions_28days, reach: reach_28days });
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });


  }, 1000);

 

  // getUserData(instagram_account_id, user_id, fields, access_token);
});

router.post("/creator-audience-countries", async function (req, res) {
  let user_id = req.body.userId;
  let country_data = [];

  setTimeout(() => {
    InstaPageMetrics.findOne({ influencer_id: user_id })
      .then((result) => {
        countries = result.audience_country;
        for (i = 0; i < 6; i++) {
          country_data.push({
            country: countries[i].country,
            Followers: countries[i].followers_count,
          });
        }

        res.status(200).send({ countries: country_data });
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
  }, 3000);
});


router.post("/creator-audience-gender", async function (req, res) {
  let user_id = req.body.userId;
  let gender_data = [];

  setTimeout(() => {
    InstaPageMetrics.findOne({ influencer_id: user_id })
      .then((result) => {
        gender_data = [
          {
            type: "Male",
            value: result.male_percentage,
          },

          {
            type: "Female",
            value: result.female_percentage,
          },

          {
            type: "Unspecified",
            value: result.other_percentage,
          },
        ];

        // console.log('Gendersss:::', gender_data);

        res.status(200).send({ gender_percentage: gender_data });
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
  }, 2000);
});

router.post("/creator-audience-cities", async function (req, res) {
  let user_id = req.body.userId;
  let city_data = [];

  setTimeout(() => {
    InstaPageMetrics.findOne({ influencer_id: user_id })
      .then((result) => {
        cities = result.audience_cities;
        for (i = 0; i < 6; i++) {
          city_data.push({
            city: cities[i].city,
            Followers: cities[i].followers_count,
          });
        }

        // console.log('Dataaa:::', city_data);

        res.status(200).send({ cities: city_data });
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
  }, 2000);
});


router.post("/creator-age-wise-followers", async function (req, res) {
  let user_id = req.body.userId;
  let gender_wise = [];

  setTimeout(() => {
    InstaPageMetrics.findOne({ influencer_id: user_id })
      .then((result) => {
        // console.log("Resultss:::", result.age_wise_followers);

        for (i = 0; i < result.age_wise_followers.length; i++) {
          gender_wise.push({
            type: "Age: " + Object.keys(result.age_wise_followers[i])[0],
            value: Object.values(result.age_wise_followers[i])[0],
          });
        }

        // console.log("Gendersss:::", gender_wise);

        res.status(200).send({ genderWise: gender_wise });
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
  }, 2000);
});

router.post("/creator-dashboard-posts", async function (req, res) {
  let user_id = req.body.userId;
  let recent_posts = [];

  // {media-id}?fields=like_count,comments_count => for album,reels,photo,video?


  // setTimeout(() => {

    PostMetrics.find({ influencer_id: user_id })
      .then((result) => {
        // console.log("Resultss:::", result);
        result.map((dataIteration)=>{
          recent_posts.push({

            'media_url': dataIteration.media_url,
            'thumbnail_url': dataIteration.thumbnail_url,
            'caption': dataIteration.caption,
            'date': dataIteration.timeStamp,
            'likes': dataIteration.likes,
            'reach': dataIteration.reach,
            'comments': dataIteration.comments_count,
            'media_type': dataIteration.media_type,
            'permaLink': dataIteration.permaLink,

          })


        })

      // console.log('Posts::::', recent_posts);
      
        res.status(200).send({ postsArray: recent_posts });
        res.end();


        // for (i = 0; i < result.age_wise_followers.length; i++) {
        //   gender_wise.push({
        //     type: "Age: " + Object.keys(result.age_wise_followers[i])[0],
        //     value: Object.values(result.age_wise_followers[i])[0],
        //   });
        // }

        // console.log("Gendersss:::", gender_wise);

        // res.status(200).send({ genderWise: gender_wise });
        // res.end();
      })
      .catch((err) => {
        console.log(err);
      });

  // }, 2000);

});


// router.post('/campaign/publishNow', async function(req, res){

//   const user_id = req.body.influencer_id;
//   const campaignId = req.body.campaign_id;
//   const mediaId = req.body.media_id;
//   const brandUser_id = req.body.brandUser_id;
//   const publishDate = req.body.publishDate;


//   const costPerPost = await Influencer.findById(user_id);
 


//     const jobData = {
//       campaignId: campaignId,
//       user_id: user_id,
//       mediaId: mediaId ,
//       brandUser_id: brandUser_id,
//       costPerPost: costPerPost.costPerPost,
//       publishDate: publishDate
//     };

//     const utcTimestamp = new Date(publishDate);

//     // Convert to IST by adding 5 hours and 30 minutes
//     const istTimestamp = new Date(utcTimestamp.getTime() + (5 * 60 + 30) * 60000);
    
//     // Format the IST timestamp as a string
//     const formattedIstTimestamp = istTimestamp.toISOString().slice(0, 19);
//     const scheduledDate = new Date(formattedIstTimestamp);

//     await agenda.schedule(scheduledDate, 'New Campaign', jobData);

//     res.status(200).send({ status: 'posted' });
//           res.end();
  
// })

router.post('/campaign/publishNow', async function(req, res){

  const user_id = req.body.influencer_id;
  const campaignId = req.body.campaign_id;
  const brandUser_id = req.body.brandUser_id;
  const publishDate = req.body.publishDate;
  const costPerPost = req.body.costPerPost;



  const jobData = {
    campaignId: campaignId,
    user_id: user_id,
    brandUser_id: brandUser_id,
    costPerPost: costPerPost,
    publishDate: publishDate
  };

  const utcTimestamp = new Date(publishDate);
  const istTimestamp = new Date(utcTimestamp.getTime() + (5 * 60 + 30) * 60000);

  // Format the IST timestamp as a string
  const formattedIstTimestamp = istTimestamp.toISOString().slice(0, 19);
  const scheduledDate = new Date(formattedIstTimestamp);

  await agenda.schedule(scheduledDate, 'Create Containers', jobData);
  // await agenda.schedule(publishedDate, 'Publish Post', publishJobData);

  res.status(200).send({ status: 'posted' });

})





module.exports = router;
