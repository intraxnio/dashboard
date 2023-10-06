const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Influencer = require("../models/Influencer");
const CreatorInstagramDetails = require("../models/CreatorInstagramDetails");
const InstaPageMetrics = require("../models/InstaPageMetrics");
const PostMetrics = require("../models/PostMetrics");
const Brand = require("../models/Brand");
const Campaign = require('../models/Campaign');
const CampaignRequests = require('../models/CampaignRequests');
const CampaignApprovedRequests = require('../models/CampaignApprovedRequests');
const CampaignDeclinedRequests = require('../models/CampaignDeclinedRequests');
const PlanDetails = require('../models/PlanDetails');
const multer = require('multer');
const { body, validationResult } = require("express-validator");
// const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const { createToken, isBrandAuthenticated } = require("../middleware/jwtToken");
const PublishedPosts = require("../models/PublishedPosts");
const fs = require("fs");
const app = express();
app.use(cookieParser());

const logger = require('../logger');


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
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




// router.post("/signup-brand", async (req, res, next) => {


//   try {
//     const { email, password, brand, category  } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const userEmail = await Brand.findOne({ email: email });
//     if (userEmail) {

//       res.status(400).send({
//         error: "User already exists",
//         data: null,
//         message: "Oops! User already exists with same email Id: Please login",
//       });
//       res.end();
//     }

//       Brand.create({
//       email: email,
//       password: hashedPassword,
//       brand_name: brand,
//       category: category,
//       balance: 0,
//       purchased_plan: '',
//       brand_logo: ''

//     });

//     res.status(200).send({success: 'success'});
//     res.end();

//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });



// router.post("/activation", async (req, res, next) => {
//   try {
//     const { activation_token } = req.body;
//     const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

//     if (!newUser) {
//       return next(new ErrorHandler("Invalid Token", 400));
//     }

//     const { email, password } = newUser;
//     Brand.create({
//       email,
//       password,
//     });
//     createToken(newUser);
//   } catch (error) {}
// });


router.post("/signup-brand", async (req, res, next) => {
  try {
    const { email, password, brand, category } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await Brand.findOne({ email: lowerCaseEmail });
   
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

    else{

    await Brand.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      brand_name: brand,
      category: category,
      balance: 0,
      purchased_plan: '',
      brand_logo: '',
    });

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});



router.post("/brand-login", async (req, res, next) => {

  logger.info('Entered login');

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
  } = req.body;

  Brand.findById(userId).then((brandDetails) => {
    console.log('Details:::', brandDetails);
    console.log('Details:::', req.files);


    // Loop through the uploaded files and upload them to S3 individually
    // req.files.forEach((file, index) => {
    //   const params = {
    //     Bucket: 'buzzreachbucket',
    //     Key: `images/${Date.now()}_${file.originalname}`, // Unique file key
    //     Body: file.buffer,
    //     ContentType: file.mimetype,
    //     ServerSideEncryption: 'AES256',
    //   };


    //   s3.upload(params, (err, data) => {
    //     if (err) {
    //       console.error(`Error uploading image ${index + 1} to S3:`, err);
    //       return res.status(500).json({ error: 'Error uploading image' });
    //     }

    //     // Image uploaded successfully, push the S3 URL to the uploadedImages array
    //     uploadedImages.push(data.Location);

    //     console.log('IMagesArray:::', uploadedImages);

    //     // If all images are uploaded, proceed to create the campaign
    //     if (uploadedImages.length === req.files.length) {
    //       // Create the campaign with the array of uploaded image URLs
    //       const createCampaign = new Campaign({
    //         campaign_name: campaignName,
    //         caption: caption,
    //         publishDate: publishDate,
    //         fileType: fileType,
    //         mediaFiles: uploadedImages, // Use an array to store multiple image URLs
    //         brandUser_id: userId,
    //         brand_name: brandDetails.brand_name,
    //         brand_category: brandDetails.category,
    //       });

    //       createCampaign.save().then((item) => {
    //         res.status(200).send({ data: item });
    //       }).catch((err) => {
    //         res.status(500).send({
    //           error: 'Creating campaign failed',
    //           data: null,
    //           message: 'Oops! Please try again',
    //         });
    //       });
    //     }
    //   });
    // });

    const uploadedImages = []; // Initialize an array to store uploaded image URLs

    
    const uploadFileToS3 = (file, index) => {
      const params = {
        Bucket: 'buzzreachbucket', // Replace with your S3 bucket name
        Key: `images/${Date.now()}_${file.originalname}`, // Unique file key
        Body: file.buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: 'AES256',
      };
    
      return s3.send(new PutObjectCommand(params))
        .then(() => {
          // Construct and return the S3 URL
          const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
          return s3Url;
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error(`Error uploading image ${index + 1} to S3:`, error);
          return Promise.reject(error);
        });
    };
    
    // Iterate through the files and upload each one to S3
    
    req.files.forEach((file, index) => {
      uploadFileToS3(file, index)
        .then((url) => {
          // Successful S3 upload, add the URL to the array
          uploadedImages.push(url);
          console.log(`Image ${index + 1} uploaded to S3: ${url}`);
    
          // If all images are uploaded, proceed to create the campaign
          if (uploadedImages.length === req.files.length) {
            // Create the campaign with the array of uploaded image URLs
            const createCampaign = new Campaign({
              campaign_name: campaignName,
              caption: caption,
              publishDate: publishDate,
              fileType: fileType,
              mediaFiles: uploadedImages, // Use an array to store multiple image URLs
              brandUser_id: userId,
              brand_name: brandDetails.brand_name,
              brand_category: brandDetails.category,
            });
    
            createCampaign.save()
              .then((item) => {
                res.status(200).send({ data: item });
              })
              .catch((err) => {
                res.status(500).send({
                  error: 'Creating campaign failed',
                  data: null,
                  message: 'Oops! Please try again',
                });
              });
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error(`Error uploading file ${index + 1}:`, error);
          res.status(500).json({ error: 'Error uploading image' });
        });
    });
    

    



  }).catch(e => {
    console.log('Error:', e);
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
    


  
router.post('/all-campaigns', async (req, res, next)=>{


  const user_id = req.body.userId;
  console.log('user_id',user_id);

// Get the user's time zone offset in minutes
const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short',
};

  const result = await Campaign.find({'brandUser_id': user_id});
  
  result.sort((a, b) => {
    if (a.is_completed === b.is_completed) {
      return a._id - b._id; // Sort by _id
    }
    if (a.is_completed === false) {
      return -1; // On-Going campaigns come first
    }
    return 1; // Completed campaigns come next
  });


  const tableData = await Promise.all( result.map(async (data, index) => {


    const created_at = new Date(data.created_at);
    const publish_date = new Date(data.publishDate);
    // Get the user's time zone offset in minutes
    const userTimezoneOffset = new Date().getTimezoneOffset();
    // Calculate the local timestamp by adjusting for the time zone offset
    const createdlocalTimestamp = new Date(created_at.getTime() - userTimezoneOffset * 60000);
    const publishlocalTimestamp = new Date(publish_date.getTime() - userTimezoneOffset * 60000);
    
    // Format the local timestamp as a string in a desired format
    const createdlocalTimeString = createdlocalTimestamp.toLocaleString('en-US', options); // This uses the user's locale
    const publishlocalTimeString = publishlocalTimestamp.toLocaleString('en-US', options); // This uses the user's locale
    

  
      return {
        id: index + 1, // Adding 1 to start the id from 1 instead of 0
        campaignId: data._id,
        name: data.campaign_name,
        createdDate: createdlocalTimeString,
        description: data.description,
        publishDate: publishlocalTimeString,
        status: data.is_completed,
        avatar: data.mediaFiles[0],
        fileType: data.fileType
      
      };
    })

  );

  
  res.status(200).send({data: tableData})
  res.end();


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
    onGoingCampaigns += campaignData.is_onGoing ? 1 : 0;
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

  console.log('Entered Check Shown method');

  const user_id = req.body.userId;
  const campaignId = req.body.campaignId;
  let interestedCreatorsIds = [];


  Campaign.findById(campaignId).then((result)=>{

  interestedCreatorsIds = result.received_interests.map(id => id.toString());

console.log('Array of Idssss:::', interestedCreatorsIds);


res.status(200).send({ data: interestedCreatorsIds});
res.end();
   

  }).catch((e)=>{

    console.log('Error:',e );


  });

});

// router.post('/campaign/get-interested-creators-data', async function (req, res){

//   const campaignId = req.body.campaignId;
//   let interestedCreatorsData = [];
//   let approvedCreatorsData = [];
//   let dataArray = [];
//   let approvedDataArray = [];
//   let demographicsData = [];
//   let creatorsData = [];


//   Campaign.findById(campaignId).then(async (result)=>{

// if(result){

//   if(result.received_interests.length > 0){
    

//     console.log('Entered IFFFFFF');

//     interestedCreatorsData = result.received_interests.map(id => id.toString());

//     dataArray = await Promise.all(interestedCreatorsData.map(async (id) => {
//       const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id });
//       return document;
//     }));
  
//     dataArray.map((data, index)=>{
//       creatorsData.push(
//         { 
//           'id': index + 1,
//           'influencer_id' : data.influencer_id,
//           'creatorName' : data.iG_name,
//           'avatar' : data.iG_profile_pic_url,
//           'followers' : data.followers_count,
//           'category' : data.category,
//           'profile' : 'https://www.instagram.com/'+ data.iG_username,
//           'insights': data.influencer_id.toString(),
//           'status' : 'Requested'
//       }
//       )
//     })

//     res.status(200).send({ data: creatorsData});
//     res.end();

//   }


//     if(result.accepted_interests.length > 0){

//       interestedCreatorsData = result.received_interests.map(id => id.toString());

//       dataArray = await Promise.all(interestedCreatorsData.map(async (id) => {
//         const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id });
//         return document;
//       }));
    
//       dataArray.map((data, index)=>{
//         creatorsData.push(
//           { 
//             'id': index + 1,
//             'influencer_id' : data.influencer_id,
//             'creatorName' : data.iG_name,
//             'avatar' : data.iG_profile_pic_url,
//             'followers' : data.followers_count,
//             'category' : data.category,
//             'profile' : 'https://www.instagram.com/'+ data.iG_username,
//             'insights': data.influencer_id.toString(),
//             'status' : 'Requested'
//         }
//         )
//       })


//   }

  

//   else{
// console.log('ERRRRORRRRRR______ERRRORRRR');

//   }




// }

// // console.log('CAMPAIGNNNNN::::',result)


   

//   }).catch((e)=>{

//     console.log('Error:',e );


//   });




// });

// router.post('/campaign/get-interested-creators-data', async function (req, res) {

//   const campaignId = req.body.campaignId;

//   try {

//     const result = await Campaign.findById(campaignId);

//     if (result) {
//       const interestedCreatorsData = [...result.received_interests, ...result.accepted_interests];

//       const dataArray = await Promise.all(
//         interestedCreatorsData.map(async (id) => {
//           const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id });
//           return document;
//         })
//       );

//       const creatorsData = dataArray.map((data, index) => ({
//         'id': index + 1,
//         'influencer_id': data.influencer_id,
//         'creatorName': data.iG_name,
//         'avatar': data.iG_profile_pic_url,
//         'followers': data.followers_count,
//         'category': data.category,
//         'profile': 'https://www.instagram.com/' + data.iG_username,
//         'insights': data.influencer_id.toString(),
//         'status': result.received_interests.includes(data.influencer_id) ? 'Requested' : 'Accepted',
//       }));

//     console.log('Resulttttttttttttt::::::::', creatorsData);


//       res.status(200).send({ data: creatorsData });
//     } else {
//       console.log('Campaign not found');
//       res.status(404).send({ error: 'Campaign not found' });
//     }
//   } catch (error) {
//     console.log('Error:', error);
//     res.status(500).send({ error: 'An error occurred' });
//   }
// });

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

router.post('/completed-campaign-metrics-table', async (req, res, next)=>{


  const campaign_id = req.body.campaignId;

try{

  const result = await PublishedPosts.find({ campaign_id: campaign_id });

  const tableData = await Promise.all(
    result.map(async (dataReach, index) => {
      const result2 = await CreatorInstagramDetails.findOne({
        influencer_id: dataReach.influencer_id
      });
      const result3 = await PostMetrics.findOne({ media_id: dataReach.media_id });
  
      return {
        id: index + 1, // Adding 1 to start the id from 1 instead of 0
        creatorName: result2.iG_name,
        avatar: result2.iG_profile_pic_url,
        profile: 'https://www.instagram.com/' + result2.iG_username,
        postDetails: result3.permaLink,
        pricePerPost: dataReach.costPerPost,
        reach: result3.reach,
        impressions: result3.impressions,
        pricePerReach: (dataReach.costPerPost/result3.reach).toFixed(3),
      };
    })
  );
  
  

  console.log('Metrics Data::::', tableData);

  res.status(200).send({ data: tableData});
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

try{

  const result = await CampaignRequests.find({campaign_id : campaignId});

  
  const campaignData = await Promise.all(
    result.map(async (id, index) => {
      const document = await CreatorInstagramDetails.findOne({ 'influencer_id': id.creator_id });
      const campaignDetails = await Campaign.findById(id.campaign_id);

     

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
        'campaign_id': campaignDetails._id
      };
    })
  );


  res.status(200).send({campaignData: campaignData});
  res.end();




}
catch(e){


}




});

// router.post('/campaign-new-requests-accept', async function (req, res) {

//   const campaignId = req.body.campaignId;
//   const creatorId = req.body.creatorId;
//   const costPerPost = req.body.costPerPost;



//   try {

//   const brandBalance = await Brand.findById(brandId);


//     Campaign.findById(campaignId).then(async (result) => {

//       if (result) {

//         const campaign = result;

//         if(brandBalance.balance >= costPerPost){

//         if (campaign.received_interests.includes(creatorId) && !campaign.approved_interests.includes(creatorId)) {

//           campaign.approved_interests.push(creatorId);

//           campaign.received_interests = campaign.received_interests.filter(
//             (userId) => userId.toString() !== creatorId
//           );
    
//           await campaign.save();
//           brandBalance.balance = brandBalance.balance-costPerPost;
//           brandBalance.save();



//           res.status(200).send({ success: true });
//         } else {
//           res.status(400).send({ message: 'User interest not found or already approved' });
//         }}
//         else{
//           console.log('Not enough Balance::::');

//           res.status(200).send({ success: false });

        

//         }


//       } else {
//         res.status(404).send({ message: 'Campaign not found' });
//       }
//     }).catch((e2) => {
//       console.log('Error2', e2);
//       res.status(500).send({ message: 'Internal server error' });
//     });
//   } catch (e) {
//     res.status(500).send({ message: 'Internal server error' });
//   }
// });

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

        console.log('Balance::::', updatedBalance);
        res.status(200).send({success: true, balance: updatedBalance });
        res.end();

      }

      
    }).catch((error) =>{
    
                    });
                  }

                  else{
                              console.log('Not enough Balance::::');
                    
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

  console.log('Entered Check Shown method');

  const user_id = req.body.userId;


  Brand.findById(user_id).then((result)=>{


console.log('Brand Details', result);

if(result.purchased_plan == null || result.purchased_plan == ''){

  res.status(200).send({ onPlan: false});
  res.end();

}

else{

  res.status(200).send({ onPlan: true, purchased_plan: result.purchased_plan});
  res.end();

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
      Bucket: 'buzzreachbucket', 
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






module.exports = router;
