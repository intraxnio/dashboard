const express = require("express");
// const app = express();
const cookieParser = require("cookie-parser");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserOnPlatform = require("../models/User");
const TempUserOnPlatform = require("../models/TempUser");
const URL = require("../models/Url");
const USER = require("../models/User");
const TrackingCodes = require("../models/TrackingCodes");

var jwt = require("jsonwebtoken");
var jwtSecret = "P@sswordIsDangerous#";
const { body, validationResult } = require("express-validator");
router.use(cookieParser());
const axios = require("axios");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { createToken } = require("../middleware/jwtToken");
const shortid = require("shortid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const { Upload } = require('@aws-sdk/lib-storage');


const s3 = new S3Client({
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // },
  credentials: {
    accessKeyId: 'AKIA4IATHDGVSTWZ5REO',
    secretAccessKey: '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',
  },
  region: 'us-east-1',
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});




const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



router.post("/signup-user", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();


    const options = {
      to: email,
      subject: "Verify Account - BroadReach",
      text: `Your 6-digit PIN: ${pin}`,
  }


    const existingUser = await UserOnPlatform.findOne({ email: lowerCaseEmail });
    const existingUserInTemp = await TempUserOnPlatform.findOne({ email : lowerCaseEmail});

   
    if (!lowerCaseEmail || !password ) {
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
      existingUserInTemp.reset_pin = pin;
      existingUserInTemp.save();
      await sendMail(options);

     return res.status(200).send({ success: true });

    }

    else{

    await TempUserOnPlatform.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      reset_pin : pin
    });
    await sendMail(options);

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/signup-user-gmail", async (req, res, next) => {


  try {
    const { email, firstName, lastName, picture } = req.body;
    const name = firstName + " " + lastName;
    const user = await UserOnPlatform.findOne({ email });

    if (!user) {

      await UserOnPlatform.create({
        email: email,
        name: name,
        picture: picture,
        is_google_user : true
      });

    const createdUser = await UserOnPlatform.findOne({ email });

      createToken(createdUser, res);

    }

    else{

      createToken(user, res);

    }

  
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});


router.post("/check-resetPin-withDb-brandTemps", async function (req, res) {

  const { email, pin } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const pinAsInt = parseInt(pin);
  
  TempUserOnPlatform.findOne({ email : lowerCaseEmail}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

      await UserOnPlatform.create({
        email: lowerCaseEmail,
        password: result.password,
        reset_pin : pin,
      });

      await TempUserOnPlatform.deleteOne({ email: lowerCaseEmail  });


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

router.post("/user-login", async (req, res, next) => {


  try {
    const { email, password } = req.body;

    if (!email || !password) {
     return res.status(400).send({
        error: "All fields are mandatory",
        data: null,
        message: "Please provide all fields",
      });
    }

    const user = await UserOnPlatform.findOne({ email }).select("+hashPassword");

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

router.post("/user-login-gmail", async (req, res, next) => {


  try {
    const { email, firstName, lastName, picture } = req.body;

    const user = await UserOnPlatform.findOne({ email });

    const name = firstName + " " + lastName;

    if (!user) {

      await UserOnPlatform.create({
        email: email,
        name: name,
        picture: picture,
        is_google_user : true
      });

    const createdUser = await UserOnPlatform.findOne({ email });

      createToken(createdUser, res);

    }

    else{

      createToken(user, res);

    }

  
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});


router.post('/all-links', async (req, res, next) => {
  const user_id = req.body.userId;

  const result = await URL.find({ 'user_id': user_id });

  result.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
  
    // Compare dates in descending order
    return dateB - dateA;
  });

  const tableData = await Promise.all(result.map(async (data, index) => {

    return {
      id: index + 1,
      linkId: data._id,
      linkTitle: data.linkTitle,
      shortUrl: 'linck.one/'+data.shortId,
      createdDate: data.created_at,
      totalClicks: data.uniqueVisitors.length + data.repeatVisitors.length,
    };
  }));

  res.status(200).send({ data: tableData });
});

// router.post('/create-link', async function (req, res) {

//   const body = req.body;

//   if(!body.redirectUrl){
//    return res.status(400).json({
//      error: 'redirect Url is required'

//    })
//  }
//    const shortId = shortid();
//    await URL.create({
//      shortId : shortId,
//      user_id : body.userId,
//      redirectUrl : body.redirectUrl,
//      linkTitle : body.linkTitle,
//      uniqueVisitors : [],
//      repeatedVisitors : [],
//      tracking_code_id : body.selectedTrackingId
//    })

//    return res.json({ id: shortId})
 
//  });



 router.post('/get-total-clicks', async function (req, res){

  const shortId = req.body.shortId;

  URL.findById(shortId).then((result)=>{

    if(result){

      const totalClicks = result.uniqueVisitors.length + result.repeatVisitors.length;

    res.status(200).send({ data: totalClicks});
    res.end();

    }

    else{
    res.status(200).send({ data: 0 });
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/get-total-unique-clicks', async function (req, res){

  const shortId = req.body.shortId;

  URL.findById(shortId).then((result)=>{

    if(result){
    
    res.status(200).send({ data: result.uniqueVisitors});
    res.end();

    }

    else{
    res.status(200).send({ data: null });
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/get-total-clicks-for-chart', async function (req, res){

  const shortId = req.body.shortId;

  URL.findById(shortId).then((result)=>{

    if(result){

    res.status(200).send({ data: result});
    res.end();

    }

    else{
    res.status(200).send({ data: null });
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});


router.post('/get-link-details', async function (req, res){

  const shortId = req.body.shortId;

  const checkTrackingCode = await URL.findById(shortId);

  if(checkTrackingCode && checkTrackingCode.tracking_code_id){

    URL.findById(shortId).populate('tracking_code_id').then((result)=>{

      if(result){
  
      res.status(200).send({ data: result, trackingCode : true});
      res.end();
  
      }
  
      else{
      res.status(200).send({ data: null });
      res.end();
  
      }
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })

  }

  else{

    URL.findById(shortId).then((result)=>{

      console.log('Result:::::', result);

      if(result){
  
      res.status(200).send({ data: result, trackingCode : false});
      res.end();
  
      }
  
      else{
      res.status(200).send({ data: null });
      res.end();
  
      }
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
      
  }


});

router.post('/get-user-tracking-codes', async function (req, res){

  const userId = req.body.userId;

  TrackingCodes.find({'user_id' : userId}).then((result)=>{

    if(result){

    res.status(200).send({ data: result});
    res.end();

    }

    else{
    res.status(200).send({ data: null });
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});



router.post('/update-link-details', async function (req, res){

  const shortId = req.body.shortId;
  const newRedirectUrl = req.body.newRedirectUrl;
  const newLinkTitle = req.body.newLinkTitle;
  const trackingCodeId = req.body.trackingCodeId;

  console.log('Tracking ID::::', trackingCodeId);


  URL.findByIdAndUpdate(shortId, { redirectUrl: newRedirectUrl, linkTitle : newLinkTitle, tracking_code_id : trackingCodeId })
  .then((updatedLink) => {
    if (!updatedLink) {
      return res.status(404).send({ error: 'shortUrl is not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating Link failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });
  
});

router.post('/add-tracking-code', async function (req, res) {

  const user_id = req.body.userId;
  const tracking_code_name = req.body.tracking_code_name;
  const newCodeScript = req.body.newCodeScript;


   await TrackingCodes.create({
     user_id : user_id,
     tracking_code_name : tracking_code_name,
     tracking_script : newCodeScript
    
   })

   return res.json({ added: true})
 
 });

 router.post('/', async (req, res) => {

  const shortId = req.body.shortId;

  try {
    const ipApiResponse = await axios.get('https://ipapi.co/json/');
    const ipAddress = ipApiResponse.data.ip;
  //   const pixelCode = `
  //   <!-- Your meta ad pixel code goes here -->
  //   <img src="https://example.com/pixel.gif?shortId=${shortId}&ipAddress=${ipAddress}" style="display:none;" />
  // `;

    // Check if the IP address already exists in the visit history
    const existingEntry = await URL.findOne({
      shortId,
      'uniqueVisitors.ipAddress': ipAddress,
    });

    if (!existingEntry) {
      // IP address does not exist, update the document
      const entry = await URL.findOneAndUpdate(
        { shortId },
        {
          $push: {
            uniqueVisitors: {
                timestamp: Date.now(),
                country: ipApiResponse.data.country_name,
                region: ipApiResponse.data.region,
                city: ipApiResponse.data.city,
                postal: ipApiResponse.data.postal,
                ipAddress: ipAddress,
              },
            },
          },
          { new: true } // Return the updated document
        );
  
        res.redirect(entry.redirectUrl);
      //   res.send(`
      //   <html>
      //     <head>
      //       <title>Redirecting...</title>
      //     </head>
      //     <body>
            
      //       <script>
      //         window.location.href = '${entry.redirectUrl}';
      //       </script>
      //     </body>
      //   </html>
      // `);

      } else {
        // IP address already exists, redirect happens but visitHistory will not be updated.
    
        const repeatentry = await URL.findOneAndUpdate(
          { shortId },
          {
            $push: {
              repeatVisitors: {
                  timestamp: Date.now(),
                  country: ipApiResponse.data.country_name,
                  region: ipApiResponse.data.region,
                  city: ipApiResponse.data.city,
                  postal: ipApiResponse.data.postal,
                  ipAddress: ipAddress,
                },
              },
            },
            { new: true } // Return the updated document
          );
    
          res.redirect(repeatentry.redirectUrl);

      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  router.post('/tracking-codes', async (req, res, next) => {
    const user_id = req.body.userId;
  
    const result = await TrackingCodes.find({ user_id: user_id, is_del : false });
  
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
    
      // Compare dates in descending order
      return dateB - dateA;
    });
  
    const tableData = await Promise.all(result.map(async (data, index) => {
  
      return {
        id: index + 1,
        tracking_id: data._id,
        tracking_id_delete: data._id,
        tracking_code_name: data.tracking_code_name,
        tracking_script: data.tracking_script,
        createdDate: data.created_at,
      };
    }));
  
    res.status(200).send({ data: tableData });
  });

  router.post('/get-tracking-code-details', async function (req, res){

    const trackingCodeId = req.body.trackingCodeId;
  
    TrackingCodes.findById(trackingCodeId).then((result)=>{
  
      if(result){
  
      res.status(200).send({ data: result});
      res.end();
  
      }
  
      else{
      res.status(200).send({ data: null });
      res.end();
  
      }
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });

  router.post('/update-tracking-code', async function (req, res){

    const trackingId = req.body.trackingCodeId;
    const tracking_code_title = req.body.tracking_code_title;
    const tracking_code_script = req.body.tracking_code_script;
  
  
    TrackingCodes.findByIdAndUpdate(trackingId, { tracking_code_name: tracking_code_title, tracking_script : tracking_code_script })
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'tracking Code is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Code failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });
    
  });


  router.post('/delete-tracking-code', async function (req, res){

    const trackingId = req.body.trackingCodeId;
  
  
    TrackingCodes.findByIdAndUpdate(trackingId, { is_del: true })
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'tracking Code is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Code failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });
    
  });


  router.post('/get-user-details', async function (req, res){

    const userId = req.body.userId;
  
    USER.findById(userId).then((result)=>{
  
      if(result){
  
      res.status(200).send({ data: result});
      res.end();
  
      }
  
      else{
      res.status(200).send({ data: null });
      res.end();
  
      }
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });

  router.post("/change-password", async function (req, res) {

    const { userId, password, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
    USER.findById(userId).select("+hashPassword").then((result)=>{
  
      if(result){
  
        bcrypt.compare(password, result.password, async function (err1, ress) {
          if (ress === true) {
  
            console.log('Correct Password');
  
            await USER.findByIdAndUpdate(result._id, { password: hashedPassword });
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

  router.post("/check-email-exists-sendMail", async function (req, res) {

    const { email } = req.body;
    const pin = generatePin();
  
    
    USER.findOne({ email : email}).then( async (result)=>{
  
      if(result){
  
        const options = {
          to: email,
          subject: "Password Reset PIN - BroadReach",
          text: `Your 6-digit PIN: ${pin}`,
      }
  
      await USER.findByIdAndUpdate(result._id, { reset_pin: pin });
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

  router.post("/check-resetPin-withDb", async function (req, res) {

    const { email, pin } = req.body;
    const pinAsInt = parseInt(pin);
    
    USER.findOne({ email : email}).then(async (result)=>{
  
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
  
    
    USER.findOne({ email : email}).then(async (result)=>{
  
      if(result){
  
        await USER.findByIdAndUpdate(result._id, { password: hashedPassword });
   
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


  router.post('/create-link-pdf', upload.single('pdfFile'), async function (req, res) {
      
      const shortId = shortid();
      const userId = req.body.userId;
      const fileType = req.body.fileType;
      const linkTitle = req.body.linkTitle;
      const isPasswordProtected = req.body.isPasswordProtected;
      const pdfPassword = req.body.pdfPassword;
      const pdfFile = req.file;

  


          const createUrlRecord = async (file, shortId, userId, fileType, linkTitle) => {
            const params = {
                Bucket: 'lynkis',
                Key: `pdfs/${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ServerSideEncryption: 'AES256',
            };
        
            try {
                // Upload the file to S3
                const upload = new Upload({
                  client: s3,
                  params,
              });
  
              await upload.done();
              
                // Construct and return the S3 URL
                const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        
                // Create a record in the URL model
                const createdRecord = await URL.create({
                    shortId,
                    user_id: userId,
                    pdfFile: s3Url,
                    linkType: fileType,
                    passwordProtected : isPasswordProtected === 'true' ? true : false,
                    password : pdfPassword,
                    linkTitle,
                    uniqueVisitors: [],
                    repeatedVisitors: [],
                });
        
                return createdRecord;
            } catch (error) {
                // Handle errors here if needed
                console.error(`Error uploading PDF file to S3 or creating URL record:`, error);
                throw error; // Re-throw the error to propagate it to the catch block in your route handler
            }
        };

        createUrlRecord(pdfFile, shortId, userId, fileType, linkTitle)
        .then(() => {
            // Record created successfully
            res.status(200).send({ created: true });
        })
        .catch((error) => {
            // Handle any errors that occurred during file upload and record creation
            console.error('Error creating URL record with PDF file:', error);
            res.status(500).json({ error: 'Error creating URL record with PDF file' });
        });
        
  });


  router.post('/create-link', upload.single('socialImage'), async function (req, res) {
      
    const shortId = shortid();
    const userId = req.body.userId;
    let finalRedirectUrl = req.body.redirectUrl;
    const linkTitle = req.body.linkTitle;
    const selectedTrackingId = req.body.selectedTrackingId;
    const socialTitle = req.body.socialTitle;
    const socialDescription = req.body.socialDescription;
    const socialImage = req.file;
    const utmSource = req.body.utmSource;
    const utmMedium = req.body.utmMedium;
    const utmCampaign = req.body.utmCampaign;


    if (utmSource) {
      finalRedirectUrl += `?&utm_source=${utmSource}`;
  
      if (utmMedium) {
        finalRedirectUrl += `&utm_medium=${utmMedium}`;
  
        if (utmCampaign) {
          finalRedirectUrl += `&utm_campaign=${utmCampaign}`;
        }
      }
    }


        const createUrlRecord = async (file, shortId, userId, finalRedirectUrl, linkTitle, selectedTrackingId , socialTitle, socialDescription ) => {

          if( (file == undefined || file === 'undefined' || file === '') 
              && ( selectedTrackingId == undefined || selectedTrackingId === 'undefined' || selectedTrackingId === '') 
            ){

              const createdRecord = await URL.create({
                shortId,
                user_id: userId,
                linkType: 'url',
                linkTitle : linkTitle,
                uniqueVisitors: [],
                repeatedVisitors: [],
                redirectUrl : finalRedirectUrl,
                utm_source : utmSource,
                utm_medium : utmMedium,
                utm_campaign : utmCampaign,


            });
    
            return createdRecord;
          }

          else if( (file == undefined || file === 'undefined' || file === '') && selectedTrackingId ){

          const createdRecord = await URL.create({
            shortId,
            user_id: userId,
            linkType: 'url',
            linkTitle : linkTitle,
            uniqueVisitors: [],
            repeatedVisitors: [],
            redirectUrl : finalRedirectUrl,
            tracking_code_id : selectedTrackingId,
            utm_source : utmSource,
            utm_medium : utmMedium,
            utm_campaign : utmCampaign,


        });

        return createdRecord;
      }

      else if( (selectedTrackingId == undefined || selectedTrackingId === 'undefined' || selectedTrackingId === '') && file ){

        
        const params = {
          Bucket: 'lynkis',
          Key: `images/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ServerSideEncryption: 'AES256',
      };
  
      try {
          // Upload the file to S3
          const upload = new Upload({
            client: s3,
            params,
        });

        await upload.done();
        
          // Construct and return the S3 URL
          const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

            const createdRecord = await URL.create({
              shortId,
              user_id: userId,
              socialImage: s3Url,
              socialTitle : socialTitle,
              socialDescription : socialDescription,
              linkType: 'url',
              linkTitle : linkTitle,
              hasSocialSharing : true,
              uniqueVisitors: [],
              repeatedVisitors: [],
              redirectUrl : finalRedirectUrl,
              utm_source : utmSource,
              utm_medium : utmMedium,
              utm_campaign : utmCampaign,


          });
  
          return createdRecord;
            
      } catch (error) {
          // Handle errors here if needed
          console.error(`Error uploading PDF file to S3 or creating URL record:`, error);
          throw error; // Re-throw the error to propagate it to the catch block in your route handler
      }

    }

    else if( selectedTrackingId && file ){

        
      const params = {
        Bucket: 'lynkis',
        Key: `images/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: 'AES256',
    };

    try {
        // Upload the file to S3
        const upload = new Upload({
          client: s3,
          params,
      });

      await upload.done();
      
        // Construct and return the S3 URL
        const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

          const createdRecord = await URL.create({
            shortId,
            user_id: userId,
            socialImage: s3Url,
            socialTitle : socialTitle,
            socialDescription : socialDescription,
            linkType: 'url',
            linkTitle : linkTitle,
            hasSocialSharing : true,
            uniqueVisitors: [],
            repeatedVisitors: [],
            redirectUrl : finalRedirectUrl,
            tracking_code_id : selectedTrackingId,
            utm_source : utmSource,
            utm_medium : utmMedium,
            utm_campaign : utmCampaign,


        });

        return createdRecord;
          
    } catch (error) {
        // Handle errors here if needed
        console.error(`Error uploading PDF file to S3 or creating URL record:`, error);
        throw error; // Re-throw the error to propagate it to the catch block in your route handler
    }

    
  }


      };



      createUrlRecord(socialImage, shortId, userId, finalRedirectUrl, linkTitle, selectedTrackingId , socialTitle, socialDescription)
      .then(() => {
          // Record created successfully
          res.status(200).send({ created: true });
      })
      .catch((error) => {
          // Handle any errors that occurred during file upload and record creation
          console.error('Error creating URL record with PDF file:', error);
          res.status(500).json({ error: 'Error creating URL record with PDF file' });
      });
      
});



router.post('/update-link-details-trackingId-social', upload.single('socialImage'), async function (req, res){

  const shortId = req.body.shortId;
  const newRedirectUrl = req.body.newRedirectUrl;
  const newLinkTitle = req.body.newLinkTitle;
  const trackingCodeId = req.body.trackingCodeId;
  const socialTitle = req.body.socialTitle;
  const socialDescription = req.body.socialDescription;
  const socialImage = req.file;

  if(socialImage){

    const newImageParams = {
      Bucket: 'lynkis',
      Key: `images/${Date.now()}_${socialImage.originalname}`,
      Body: socialImage.buffer,
      ContentType: socialImage.mimetype,
      ServerSideEncryption: 'AES256',
    };

    const newImageUpload = new Upload({
      client: s3,
      params: newImageParams,
    });

    await newImageUpload.done();
    const s3Url = `https://${newImageParams.Bucket}.s3.amazonaws.com/${newImageParams.Key}`;

    URL.findByIdAndUpdate(shortId, { redirectUrl: newRedirectUrl, linkTitle : newLinkTitle, tracking_code_id : trackingCodeId,
      socialTitle : socialTitle, socialDescription : socialDescription, socialImage : s3Url })
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'shortUrl is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Link failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });


  }

  else {

    URL.findByIdAndUpdate(shortId, { redirectUrl: newRedirectUrl, linkTitle : newLinkTitle, tracking_code_id : trackingCodeId,
      socialTitle : socialTitle, socialDescription : socialDescription})
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'shortUrl is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Link failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });


  }


  
});

router.post('/update-link-details-with-social', upload.single('socialImage'), async function (req, res){

  const shortId = req.body.shortId;
  let finalRedirectUrl = req.body.newRedirectUrl.split('?')[0];
  const newLinkTitle = req.body.newLinkTitle;
  const socialTitle = req.body.socialTitle;
  const socialDescription = req.body.socialDescription;
  const socialImage = req.file;
  const utmSource = req.body.utmSource;
  const utmMedium = req.body.utmMedium;
  const utmCampaign = req.body.utmCampaign;


  if (utmSource) {
    finalRedirectUrl += `?&utm_source=${utmSource}`;

    if (utmMedium) {
      finalRedirectUrl += `&utm_medium=${utmMedium}`;

      if (utmCampaign) {
        finalRedirectUrl += `&utm_campaign=${utmCampaign}`;
      }
    }
  }


  if(socialImage){

    const newImageParams = {
      Bucket: 'lynkis',
      Key: `images/${Date.now()}_${socialImage.originalname}`,
      Body: socialImage.buffer,
      ContentType: socialImage.mimetype,
      ServerSideEncryption: 'AES256',
    };

    const newImageUpload = new Upload({
      client: s3,
      params: newImageParams,
    });

    await newImageUpload.done();
    const s3Url = `https://${newImageParams.Bucket}.s3.amazonaws.com/${newImageParams.Key}`;

    URL.findByIdAndUpdate(shortId, { redirectUrl: finalRedirectUrl, linkTitle : newLinkTitle,
      socialTitle : socialTitle, socialDescription : socialDescription, socialImage : s3Url, utm_source : utmSource, utm_medium : utmMedium, utm_campaign : utmCampaign })
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'shortUrl is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Link failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });


  }

  else {

    URL.findByIdAndUpdate(shortId, { redirectUrl: finalRedirectUrl, linkTitle : newLinkTitle,
      socialTitle : socialTitle, socialDescription : socialDescription, utm_source : utmSource, utm_medium : utmMedium, utm_campaign : utmCampaign})
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'shortUrl is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Link failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });


  }


  
});


  router.post("/check-pdf-password", async function (req, res) {

   const shortId = req.body.shortId;
   const password = req.body.password;
    
    URL.findOne({ shortId : shortId}).then(async (result)=>{
  
      if(result.password === password){
  
    res.status(200).send({ matching: true});
    res.end();
  
      }
  
      else{
  
        res.status(200).send({ matching: false});
        res.end();
  
      }
  
    }).catch((err) =>{
  
    })
  
  });

  router.post('/update-pdflink-details', async function (req, res){

    const shortId = req.body.shortId;
    const passwordProtected = req.body.passwordProtected;
    const password = req.body.password;
    const newLinkTitle = req.body.newLinkTitle;
  
  
    URL.findByIdAndUpdate(shortId, { passwordProtected: passwordProtected, linkTitle : newLinkTitle, password : password })
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'shortUrl is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Link failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });
    
  });
  




module.exports = router;
