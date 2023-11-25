const express = require("express");
// const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const cron = require('node-cron');
const moment = require('moment');
const router = express.Router();
const bcrypt = require("bcryptjs");
const Influencer = require("../models/Influencer");
const TempInfluencer = require("../models/InfluencerTemp");
const CreatorInstagram = require("../models/CreatorInstagramDetails");
const InstaPageMetrics = require("../models/InstaPageMetrics");
const PostMetrics = require("../models/PostMetrics");
const PostPricing = require("../models/PostPricing");
const Campaign = require("../models/Campaign");
const CampaignApprovedRequests = require("../models/CampaignApprovedRequests");
const CampaignRequests = require("../models/CampaignRequests");
const Brand = require("../models/Brand");
const PublishedPosts = require("../models/PublishedPosts");
const ScheduledPosts = require("../models/ScheduledPosts");
const CreatorBankDetails = require("../models/BankDetails");
const AllBankNames = require("../models/AllBanks");
var jwt = require("jsonwebtoken");
var jwtSecret = "P@sswordIsDangerous#";
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");

const countryList = require("country-list");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {
  createToken,
  isBrandAuthenticated,
  creatorToken,
  isCreatorAuthenticated,
} = require("../middleware/jwtToken");
const agenda = require('../middleware/agendaManager');
router.use(cookieParser());
const axios = require("axios");

// const username= "intraxnio";
// const password = 'Pa55w0Rd';
// var dbUrl= "mongodb+srv://"+username+":"+password+"@cluster0.1u64z5l.mongodb.net/?retryWrites=true&w=majority"
// var dbUrl= "mongodb+srv://intraxnio:Pa55w0Rd@cluster0.1u64z5l.mongodb.net/?retryWrites=true&w=majority"

var fbAppID = "957873452119557";
// var fb_redirecturl = "https://localhost:4700/insta_redirect_url";
var fb_redirecturl = "https://app.broadreach.in/insta_graph_dialogue";
var fb_secret = "f4c9a7fd08841f50856f684b0448fff8";


const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// router.post("/signup-creator", async (req, res, next) => {
//   try {
//     const { email, password, category } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     const lowerCaseEmail = email.toLowerCase();


//     const userEmail = await Influencer.findOne({ email: lowerCaseEmail });
//     if (userEmail) {
//       // return next(new ErrorHandler("User already exists", 400));

//       console.log("Error is: User already exists, Please login", 400);
//       res.status(400).send({
//         error: "User already exists with same email id: Please login",
//         data: null,
//         message: "Oops! User already exists with same mail Id: Please login",
//       });
//       res.end();
//     }

//     Influencer.create({
//       email: email,
//       password: hashedPassword,
//       access_token: "",
//       instagram_business_account_id: "",
//       costPerPost: null,
//       token_expires_in: null,
//       category: category,
//     });
//   } catch (error) {
//     // return next(new ErrorHandler(error.message, 500));
//     console.log('Signup Error', error);
//   }
// });

router.post("/signup-creator", async (req, res, next) => {
  try {
    const { email, password, category } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();


    const options = {
      to: email,
      subject: "Verify Account - BroadReach",
      text: `Your 6-digit PIN: ${pin}`,
  }


    const existingUser = await Influencer.findOne({ email: lowerCaseEmail });
    const existingUserInTemp = await TempInfluencer.findOne({ email : lowerCaseEmail});

   
    if (!lowerCaseEmail || !password || !category) {
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
      existingUserInTemp.category = category;
      existingUserInTemp.reset_pin = pin;
      existingUserInTemp.save();
      await sendMail(options);

     return res.status(200).send({ success: true });

    }

    else{

    await TempInfluencer.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      category: category,
      reset_pin : pin
    });
    await sendMail(options);

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/creator-login", async (req, res, next) => {

  try {
    const { email, password } = req.body;
    const lowerCaseMail = email.toLowerCase();


    const user = await Influencer.findOne({ email : lowerCaseMail}).select("+hashPassword");

    if (!user) {
      res.status(400).send({
        error: "Invalid email or password",
        data: null,
        message: "Invalid email or password",
      });
      res.end();
    }

    bcrypt.compare(password, user.password, async function (err1, result) {
      if (result === true ) {

        if(user.is_instagram_connected){

          await getUserData(
            user.instagram_business_account_id,
            user._id,
            "biography,followers_count,media_count,name,profile_picture_url,username",
            user.access_token,
            user.category
          );
          await instaAudienceData(user.instagram_business_account_id, user._id,
                                   "audience_country,audience_city,audience_gender_age", user.access_token);
  
  
          // --------------------------------Update Media Data Starts--------------------------------------
  
          await fetchMediaData(user.instagram_business_account_id, user.access_token).then((mediaData) => {
            // console.log('Media Data:', mediaData);
            mediaData.map(async (doIt) => {
    
              if(doIt.media_type === 'CAROUSEL_ALBUM'){
                try{
                  const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=carousel_album_reach,carousel_album_impressions,carousel_album_engagement&access_token=" + user.access_token;
    
                  const response = await axios.get(url);
                  // console.log('Carousel Response:::', response.data);
    
                  PostMetrics.findOneAndUpdate(
                    { media_id: doIt.id },
                    {
                      $set: {
                        media_id: doIt.id,
                        influencer_id: user._id,
                        insta_page_username: user.instagram_business_account_id,
                        media_type: doIt.media_type,
                        media_product_type: doIt.media_product_type,
                        likes: doIt.like_count,
                        caption: doIt.caption,
                        comments_count: doIt.comments_count,
                        media_url: doIt.media_url,
                        thumbnail_url: doIt.thumbnail_url,
                        permaLink: doIt.permalink,
                        timeStamp: doIt.timestamp,
                        reach: response.data.data[0].values[0].value,
                        impressions: response.data.data[1].values[0].value,
                        engagement: response.data.data[2].values[0].value,
                      },
                    },
                    { upsert: true, new: true }
                  )
        
                    .then((document) => {
                      // console.log('Document:', document);
                    })
                    .catch((error) => {
                      console.error("Error updating/creating document:", error);
                    });
    
                }
    
                catch{
                  // console.log('Catch Error');
                  PostMetrics.findOneAndUpdate(
                    { media_id: doIt.id },
                    {
                      $set: {
                        media_id: doIt.id,
                        influencer_id: user._id,
                        insta_page_username: user.instagram_business_account_id,
                        media_type: doIt.media_type,
                        media_product_type: doIt.media_product_type,
                        likes: doIt.like_count,
                        caption: doIt.caption,
                        comments_count: doIt.comments_count,
                        media_url: doIt.media_url,
                        thumbnail_url: doIt.thumbnail_url,
                        permaLink: doIt.permalink,
                        timeStamp: doIt.timestamp,
                        beforeBusinessAccount: true,
                        reach: 0,
                        impressions: 0,
                        engagement: 0,
                      },
                    },
                    { upsert: true, new: true }
                  )
        
                    .then((document) => {
                      // console.log('Document:', document);
                    })
                    .catch((error) => {
                      console.error("Error updating/creating document:", error);
                    });
                }
    
              }
    
              else if(doIt.media_type === 'VIDEO' && doIt.media_product_type === 'REELS') {
  
                try{
    
                  const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=reach&access_token=" + user.access_token;
    
                  const reelsResponse = await axios.get(url);
                  // console.log('Video Response:::', reelsResponse);
  
    
                  PostMetrics.findOneAndUpdate(
                    { media_id: doIt.id },
                    {
                      $set: {
                        media_id: doIt.id,
                        influencer_id: user._id,
                        insta_page_username: user.instagram_business_account_id,
                        media_type: doIt.media_type,
                        media_product_type: doIt.media_product_type,
                        likes: doIt.like_count,
                        caption: doIt.caption,
                        comments_count: doIt.comments_count,
                        media_url: doIt.media_url,
                        thumbnail_url: doIt.thumbnail_url,
                        permaLink: doIt.permalink,
                        timeStamp: doIt.timestamp,
                        reach: reelsResponse.data.data[0].values[0].value,
                        impressions: 0,
                        engagement: 0,
                      },
                    },
                    { upsert: true, new: true }
                  )
        
                    .then((document) => {
                      // console.log('Document:', document);
                    })
                    .catch((error) => {
                      console.error("Error updating/creating document:", error);
                    });
    
                }
                catch(errorr){
                  console.log('This Catch Error');
                  console.log(errorr);
  
                  PostMetrics.findOneAndUpdate(
                    { media_id: doIt.id },
                    {
                      $set: {
                        media_id: doIt.id,
                        influencer_id: user._id,
                        insta_page_username: user.instagram_business_account_id,
                        media_type: doIt.media_type,
                        media_product_type: doIt.media_product_type,
                        likes: doIt.like_count,
                        caption: doIt.caption,
                        comments_count: doIt.comments_count,
                        media_url: doIt.media_url,
                        thumbnail_url: doIt.thumbnail_url,
                        permaLink: doIt.permalink,
                        timeStamp: doIt.timestamp,
                        beforeBusinessAccount: true,
                        reach: 0,
                        impressions: 0,
                        engagement: 0,
                      },
                    },
                    { upsert: true, new: true }
                  )
        
                    .then((document) => {
                      // console.log('Document:', document);
                    })
                    .catch((error) => {
                      console.error("Error updating/creating document:", error);
                    });
    
                }
              }
    
              else if(doIt.media_type === 'IMAGE') {
                try{
                  const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=reach,impressions,engagement&access_token=" + user.access_token;
    
                  const imageResponse = await axios.get(url);
                  // console.log('Carousel Response:::', imageResponse.data.data[0]);
                  // console.log('Caption:::::', doIt.caption);
                  // console.log('Image Response:::', imageResponse.data);
  
                  PostMetrics.findOneAndUpdate(
                    { media_id: doIt.id },
                    {
                      $set: {
                        media_id: doIt.id,
                        influencer_id: user._id,
                        insta_page_username: user.instagram_business_account_id,
                        media_type: doIt.media_type,
                        media_product_type: doIt.media_product_type,
                        likes: doIt.like_count,
                        caption: doIt.caption,
                        comments_count: doIt.comments_count,
                        media_url: doIt.media_url,
                        thumbnail_url: doIt.thumbnail_url,
                        permaLink: doIt.permalink,
                        timeStamp: doIt.timestamp,
                        reach: imageResponse.data.data[0].values[0].value,
                        impressions: imageResponse.data.data[1].values[0].value,
                        engagement: imageResponse.data.data[2].values[0].value,
                      },
                    },
                    { upsert: true, new: true }
                  )
        
                    .then((document) => {
                      // console.log('Document:', document);
                    })
                    .catch((error) => {
                      console.error("Error updating/creating document:", error);
                    });
    
                }
                catch{
                  // console.log('Catch Block Caption:::::', doIt.caption);
    
                  PostMetrics.findOneAndUpdate(
                    { media_id: doIt.id },
                    {
                      $set: {
                        media_id: doIt.id,
                        influencer_id: user._id,
                        insta_page_username: user.instagram_business_account_id,
                        media_type: doIt.media_type,
                        media_product_type: doIt.media_product_type,
                        likes: doIt.like_count,
                        caption: doIt.caption,
                        comments_count: doIt.comments_count,
                        media_url: doIt.media_url,
                        thumbnail_url: doIt.thumbnail_url,
                        permaLink: doIt.permalink,
                        timeStamp: doIt.timestamp,
                        beforeBusinessAccount: true,
                        reach: 0,
                        impressions: 0,
                        engagement: 0,
                      },
                    },
                    { upsert: true, new: true }
                  )
        
                    .then((document) => {
                      // console.log('Document:', document);
                    })
                    .catch((error) => {
                      console.error("Error updating/creating document:", error);
                    });
    
                }
              }
    
              else {
                try{
                  PostMetrics.findOneAndUpdate(
                    { media_id: doIt.id },
                    {
                      $set: {
                        media_id: doIt.id,
                        influencer_id: user._id,
                        insta_page_username: user.instagram_business_account_id,
                        media_type: doIt.media_type,
                        media_product_type: doIt.media_product_type,
                        likes: doIt.like_count,
                        caption: doIt.caption,
                        comments_count: doIt.comments_count,
                        media_url: doIt.media_url,
                        thumbnail_url: doIt.thumbnail_url,
                        permaLink: doIt.permalink,
                        timeStamp: doIt.timestamp,
                      },
                    },
                    { upsert: true, new: true }
                  )
        
                    .then((document) => {
                      // console.log('Document:', document);
                    })
                    .catch((error) => {
                      console.error("Error updating/creating document:", error);
                    });
    
                }
                catch{
    
                }
              }
             
            });
          })
          .catch((error) => {
            console.error("Error fetching media data:", error);
          });
  
          // --------------------------------Update Media Data Ends--------------------------------------
        const instagram_connected = true;
  
          creatorToken(user, res, instagram_connected);
  

        }

        else if(!user.is_instagram_connected){
       
          const not_instagram_connected = false;

          creatorToken(user, res, not_instagram_connected);
        

        }


      } else {

        res.status(400).send({
          error: "email, password mismatch",
          data: null,
          message: "Invalid email or password",
        });
        res.end();
      }
    });
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
    console.log('Login Error', error);
  }
});

router.post("/check-resetPin-withDb-InfluencerTemp", async function (req, res) {

  const { email, pin } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const pinAsInt = parseInt(pin);
  
  TempInfluencer.findOne({ email : lowerCaseEmail}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

      await Influencer.create({
        email: lowerCaseEmail,
        password: result.password,
        brand_name: result.brand_name,
        category: result.category,
        reset_pin : pin,
      
      });

      await TempInfluencer.deleteOne({ email: lowerCaseEmail  });


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

const getUserData = async (insta_user_id, userId, fields, accessToken, instagram_account_category) => {
  try {

    // console.log('Category::::', instagram_account_category);

    const url ="https://graph.facebook.com/v17.0/" +insta_user_id + "?fields=" + fields + "&access_token=" + accessToken;

    const response = await axios.get(url);
    // console.log('getUserData Response::::', response);

    CreatorInstagram.findOne({ influencer_id: userId })
      .then(async (document) => {
    const url2 = "https://graph.facebook.com/v17.0/"+insta_user_id +"/insights?metric=impressions,reach&period=days_28&access_token=" +
      accessToken;

    const impressionsRes = await axios.get(url2);

    const postPricing = await PostPricing.find();

    const pricingStructureFromDb = await Promise.all( postPricing.map(async (priceData) => {
        // Check if the follower_count is within the range
        if (response.data.followers_count >= priceData.follower_count_min && response.data.followers_count <= priceData.follower_count_max) {
          return priceData;
        } else {
          return null;
        }
      })
    );
    
    // Filter out the records that are not null (i.e., within the range)
    const filteredPrice = pricingStructureFromDb.filter(record => record !== null);

    
    
    
        // console.log('DOCC::::', impressionsRes.data.data[0].values[1].value);
        if (document) {


          document.iG_name = response.data.name;
          document.instagram_business_account_id = insta_user_id;
          document.iG_profile_pic_url = response.data.profile_picture_url;
          document.iG_username = response.data.username;
          document.followers_count = response.data.followers_count;
          document.cost_per_post_image = filteredPrice[0].cost_per_post_image;
          document.cost_per_post_video = filteredPrice[0].cost_per_post_video;
          document.media_count = response.data.media_count;
          document.iG_biography = response.data.biography;
          document.category = instagram_account_category;
          document.impressions_last_28days = impressionsRes.data.data[0].values[1].value;
          document.reach_last_28days = impressionsRes.data.data[1].values[1].value;
          return document.save();
        }

        CreatorInstagram.create({
          influencer_id: userId,
          iG_name: response.data.name,
          instagram_business_account_id: insta_user_id,
          iG_profile_pic_url: response.data.profile_picture_url,
          iG_username: response.data.username,
          followers_count: response.data.followers_count,
          cost_per_post_image : filteredPrice[0].cost_per_post_image,
          cost_per_post_video : filteredPrice[0].cost_per_post_video,
          media_count: response.data.media_count,
          iG_biography: response.data.biography,
          category: instagram_account_category,
          impressions_last_28days: impressionsRes.data.data[0].values[1].value,
          reach_last_28days: impressionsRes.data.data[1].values[1].value,
        });
      })

      .then((updatedDocument) => {
        // console.log('Fields updated:', updatedDocument);
        // res.status(200).send({data: updatedDocument});
        // res.end();
      })
      .catch((error) => {
        console.error("Error updating fields:", error);
      });

    // Process the response data
    // console.log('User Data:', response.data);
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
};

async function fetchMediaData(insta_user_id, accessToken,) {
  try {
    const baseUrl = "https://graph.facebook.com/v17.0";
    const fields =
      "id,caption,media_type,like_count,comments_count,media_product_type,thumbnail_url,media_url,permalink,timestamp,owner";
    const params = new URLSearchParams({
      access_token: accessToken,
      fields,
    });

    const mediaData = [];

    let hasNextPage = true;
    let afterCursor = "";

    while (hasNextPage) {
      const apiUrl = `${baseUrl}/${insta_user_id}/media?${params.toString()}&after=${afterCursor}`;
      const response = await axios.get(apiUrl);
      const { data, paging } = response.data;
      mediaData.push(...data);

      if (paging && paging.next) {
        const url = new URL(paging.next);
        afterCursor = url.searchParams.get("after");
      } else {
        hasNextPage = false;
      }
    }

    return mediaData;

    // mediaData.map((findTypeIterate)=>{

    //   if( findTypeIterate.media_type=='IMAGE' && findTypeIterate.media_product_type=='FEED')


    // })
    // const finalResponse = await axios.get("")





  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
}

const instaAudienceData = async (
  insta_user_id,
  userId,
  metrics,
  accessToken
) => {
  let countriesArray = [];
  let citiesArray = [];
  let totalGenderArray = [];

  try {
    const url =
      "https://graph.facebook.com/v17.0/" +
      insta_user_id +
      "/insights?metric=" +
      metrics +
      "&period=lifetime&access_token=" +
      accessToken;

    const response = await axios.get(url);
    const countryData = response.data.data[0].values;

    const countryValues = countryData.map((item) => item.value)[0];

    // Iterate over the key-value pairs
    countriesArray = Object.entries(countryValues).map(
      ([countryCode, followers_count]) => {
        const countryName = countryList.getName(countryCode);
        return {
          country: countryName,
          followers_count: followers_count,
        };
      }
    );

    const cityData = response.data.data[1].values;
    const cityValues = cityData.map((item) => item.value)[0];

    citiesArray = Object.entries(cityValues).map(
      ([cityName, followers_count]) => {
        // const countryName = countryList.getName(countryCode);
        return {
          city: cityName,
          followers_count: followers_count,
        };
      }
    );

    const genderData = response.data.data[2].values;
    // console.log('genderData::::', genderData);
    const genderValues = genderData.map((item) => item.value)[0];
    const male = /M/;
    const female = /F/;
    const other = /U/;
    let totalMale = 0;
    let totalFemale = 0;
    let totalOther = 0;
    Object.entries(genderValues).map(([gender, followers_count]) => {
      // const countryName = countryList.getName(countryCode);
      if (male.test(gender)) {
        totalMale = totalMale + parseInt(followers_count);
        totalGenderArray.push({
          gender: "Male",
          followers_count: followers_count,
        });
      } else if (female.test(gender)) {
        totalFemale = totalFemale + parseInt(followers_count);
        totalGenderArray.push({
          gender: "Female",
          followers_count: followers_count,
        });
      } else if (other.test(gender)) {
        totalOther = totalOther + parseInt(followers_count);
        totalGenderArray.push({
          gender: "Other",
          followers_count: followers_count,
        });
      }
    });

    let newArray = [];

    for (const key in genderValues) {
      const ageGroup = key.split(".")[1]; // Extract the age group from the key
      const value = genderValues[key]; // Get the value from the object

      // Check if the age group already exists in the newArray
      const existingIndex = newArray.findIndex((obj) =>
        obj.hasOwnProperty(ageGroup)
      );
      if (existingIndex !== -1) {
        newArray[existingIndex][ageGroup] += value; // Append the value to the existing age group
      } else {
        newArray.push({ [ageGroup]: value }); // Push a new object with the age group and value
      }
    }
    // console.log('New Array::', newArray);

    InstaPageMetrics.findOne({ influencer_id: userId })
      .then((document) => {
        const sortedCountries = countriesArray.sort(
          (a, b) => b.followers_count - a.followers_count
        );
        const sortedCities = citiesArray.sort(
          (a, b) => b.followers_count - a.followers_count
        );
        const api_returned_followers = totalMale + totalFemale + totalOther;
        const totalMalePercent = Math.round(
          (totalMale / api_returned_followers) * 100
        );
        const totalFemalePercent = Math.round(
          (totalFemale / api_returned_followers) * 100
        );
        const totalOtherPercent = Math.round(
          (totalOther / api_returned_followers) * 100
        );
        // console.log('DOCC::::', document);
        if (document) {
          document.audience_country = sortedCountries;
          document.audience_cities = sortedCities;
          document.audience_gender_age = totalGenderArray;
          document.age_wise_followers = newArray;
          document.male_percentage = totalMalePercent;
          document.female_percentage = totalFemalePercent;
          document.other_percentage = totalOtherPercent;
          document.updated_at = new Date();
          return document.save();
        }

        InstaPageMetrics.create({
          influencer_id: userId,
          audience_country: sortedCountries,
          audience_cities: sortedCities,
          audience_gender_age: totalGenderArray,
          age_wise_followers: newArray,
          male_percentage: totalMalePercent,
          female_percentage: totalFemalePercent,
          other_percentage: totalOtherPercent,
        });
      })
      .then((updatedDocument) => {
        // console.log('Fields updated:', updatedDocument);
        // res.status(200).send({data: updatedDocument});
        // res.end();
      })
      .catch((error) => {
        console.error("Error updating fields:", error);
      });
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
};

router.post("/fb_insta_redirect_url", async function (req, res) {
  
  let code = req.body.access_code;
  let user_id = req.body.userId;
  let fb_access_token = null;
  let token_expires_in = null;

  await axios
    .get(
      "https://graph.facebook.com/v17.0/oauth/access_token?client_id=" +
        fbAppID +
        "&redirect_uri=" +
        fb_redirecturl +
        "&client_secret=" +
        fb_secret +
        "&code=" +
        code
    )
    .then((res1) => {
      fb_access_token = res1.data.access_token;
      token_expires_in = res1.data.expires_in;

      try {
        const url = "https://graph.facebook.com/v17.0/me/accounts";

        axios
          .get(url, {
            params: {
              fields: "instagram_business_account",
              access_token: fb_access_token,
            },
          })
          .then((res2) => {
            let instagram_businessId = JSON.stringify(
              res2.data.data[0].instagram_business_account.id
            );
            // the above variable returns double quoted instagram account Id ex: "4567898765", so remove double quotes and save to DB
            let removeQuotes_from_Id = instagram_businessId.replaceAll('"', "");
            console.log('Reached getUserData function');
           

            Influencer.findById(user_id)
              .then(async (document) => {

                console.log('Document::::', document);

                const currentDate = new Date();
                const expirationDate = new Date(currentDate.getTime() + 59 * 24 * 60 * 60 * 1000);


                getUserData(
                  removeQuotes_from_Id,
                  user_id,
                  "biography,followers_count,media_count,name,profile_picture_url,username",
                  fb_access_token,
                  document.category
                );
             

                if (!document) {
                  throw new Error("Document not found"); // Handle if the document is not found
                }

                // fields to update
            console.log('Updated token....');

                document.access_token = fb_access_token;
                document.token_expires_in = token_expires_in;
                document.token_expiry_date = expirationDate;
                document.instagram_business_account_id = removeQuotes_from_Id;
                document.is_instagram_connected = true;
                document.updated_at = new Date();

                return document.save();

              })
              .then((updatedDocument) => {
                console.log('Fields updated:', updatedDocument);
                res.status(200).send({ data: updatedDocument });
                res.end();
              })
              .catch((error) => {
                console.error("Error updating fields:", error);
              });
          })
          .catch((e) => {});

        // Extract the Instagram accounts from the response
        // const instagramAccounts = response.data.data.filter(
        //   (account) => account.instagram_business_account
        // );
      } catch (error) {
        console.error("Error retrieving Instagram accounts:", error);
      }
    })
    .catch((e) => {});
});

router.post('/get-campaigns', async (req, res) => {
  try {
    const userId = req.body.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    // function formatPublishDate(publishDate) {
    //   const date = new Date(publishDate);
    //     return format(date, 'dd-MM-yyyy hh:mm:ss a', { timeZone: 'Asia/Kolkata' });
    // }

    // console.log('Todayyy:::::', formatPublishDate(today));


    const categoryMapping = {

      'Actor': ['Art and Design', 'Banking and Finance', 'Beauty and Cosmetics', 'Education and E-learning', 'Entertainment and Media', 
                'Fashion', 'Fitness & Gym', 'Gaming', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
                'Outdoor and Adventure', 'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism'],
      'Artist': ['Art and Design', 'Banking and Finance', 'Beauty and Cosmetics', 'Education and E-learning', 'Entertainment and Media', 
                'Fashion', 'Fitness and Gym', 'Gaming', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
                'Outdoor and Adventure', 'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism', 'Groceries'],
      'Automotive': ['Automotive'],
      'Blogger or Vlogger': ['Art and Design', 'Banking and Finance', 'Entertainment and Media', 'Fashion', 'Home and Decor', 'Lifestyle',
                'Outdoor and Adventure', 'Groceries'],
      'Beauty and Cosmetics': ['Beauty and Cosmetics', 'Home and Decor', 'Lifestyle'],
      'Banking or Finance': ['Banking and Finance'],
      'Digital Creator': ['Art and Design', 'Banking and Finance', 'Beauty and Cosmetics', 'Education and E-learning', 'Entertainment and Media', 
                'Fashion', 'Fitness and Gym', 'Gaming', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
                'Outdoor and Adventure', 'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism'],  
      'Education and E-learning': ['Education and E-learning'],
      'Fashion Model': ['Beauty and Cosmetics', 'Entertainment and Media', 'Fashion', 'Fitness and Gym', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
                'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism'],
      'Fitness and Gym': ['Fitness and Gym', 'Health and Wellness', 'Outdoor and Adventure', 'Travel and Tourism'],
      'Gaming': ['Gaming', 'Outdoor and Adventure', 'Travel and Tourism'],
      'Home and Decor': ['Home and Decor', 'Kitchen and Cooking', 'Travel and Tourism'],
      'Kitchen and Cooking': ['Kitchen and Cooking', 'Health and Wellness'],
      'Travel': ['Automotive', 'Technology and Electronics', 'Travel and Tourism']
  
      };

    const userDetails = await Influencer.findById(userId);
    const forCreatorPricing = await CreatorInstagram.findOne({influencer_id : userId});

    if (!userDetails) {
      return res.status(404).send({ message: 'User not found' });
    }

    const campaignIdsWithInterest = await CampaignRequests.find({
      creator_id: userId,
    }).distinct('campaign_id');


    const campaignIdsApproved = await CampaignApprovedRequests.find({
      creator_id: userId,
    }).distinct('campaign_id');


    const excludedCampaignIds = [...campaignIdsWithInterest, ...campaignIdsApproved];


    const campaigns = await Campaign.find({
      _id: { $nin: excludedCampaignIds }, // Exclude campaigns with interest
      brand_category: { $in: categoryMapping[userDetails.category] },
      is_completed: false,
      in_review: false,
      publishDate: { $gt: today }
    }).populate('brandUser_id');

    const campaignsWithBrandLogo = campaigns.map((campaign) => ({
      // Copy all fields from the campaign
      ...campaign._doc,
      brand_logo: campaign.brandUser_id ? campaign.brandUser_id.brand_logo : null,
      cost_per_post_image : forCreatorPricing.cost_per_post_image,
      cost_per_post_video : forCreatorPricing.cost_per_post_video,
    }));
    // console.log('With Logooo::::', campaignsWithBrandLogo);

    res.status(200).send({ data: campaignsWithBrandLogo });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.post('/myCampaigns', async function (req, res){

  const user_id = req.body.userId;
  const currentDate = new Date();
  let campaignsArray = [];

await CampaignRequests.find({creator_id : user_id}).then(async (result) => {


  if(result){
    
        const campaignRequestsData = await Promise.all( result.map(async (campData) => {
  
        const campaignDetails = await Campaign.findById(campData.campaign_id);
        const brand_details = await Brand.findById(campaignDetails.brandUser_id);
        const campaign_status = currentDate >= campData.publishDate ? 'Expired' : 'Active';

          campaignsArray.push({
            '_id': campData._id,
            'caption': campData.caption,
            'campaign_name' : campaignDetails.campaign_name,
            'publishDate': campData.publishDate,
            'brand_name': campaignDetails.brand_name,
            'brand_category': campaignDetails.brand_category,
            'campaign_status': campaign_status,
            'campaign_id': campData.campaign_id,
            'brand_logo' : brand_details.brand_logo,
            'fileType' : campaignDetails.fileType,
            'costPerPost' : campData.quoted_price,
            'status' : 'Shown Interest'
            
          });
  
      }));


    // console.log('CampaignData::', campaignsArray);

    // res.status(200).send({campaigns: campaignData});
    // res.end();
  }

  else {
    // res.status(200).send({campaigns: null});
    // res.end();
  }


}).catch((error) =>{

});

await CampaignApprovedRequests.find({creator_id : user_id}).then(async (result) => {


  if(result){
    
        const campaignRequestsData = await Promise.all( result.map(async (campData) => {
  
        const campaignDetails = await Campaign.findById(campData.campaign_id);
        const brand_details = await Brand.findById(campaignDetails.brandUser_id);
        const campaign_status = currentDate >= campData.publishDate ? 'Expired' : 'Active';

          campaignsArray.push({
            '_id': campData._id,
            'caption': campData.caption,
            'campaign_name' : campaignDetails.campaign_name,
            'publishDate': campData.publishDate,
            'brand_name': campaignDetails.brand_name,
            'brand_category': campaignDetails.brand_category,
            'campaign_status': campaign_status,
            'campaign_id': campData.campaign_id,
            'brand_logo' : brand_details.brand_logo,
            'fileType' : campaignDetails.fileType,
            'costPerPost' : campData.accepted_price,
            'status' : 'Approved'
            
          });
  
      }));


    // console.log('CampaignData::', campaignsArray);

    // res.status(200).send({campaigns: campaignData});
    // res.end();
  }

  else {
    // res.status(200).send({campaigns: null});
    // res.end();
  }


}).catch((error) =>{

});

// console.log('CampaignsArray:::::', campaignsArray);

    res.status(200).send({campaigns: campaignsArray});
        res.end();






})

router.post('/get-campaign-details', async function (req, res){

  const user_id = req.body.userId;
  const campaignId = req.body.campaignId;

  // console.log('CampaignId', campaignId);



  Campaign.findById(campaignId).then(async (result)=>{

  const brandDetails = await Brand.findById(result.brandUser_id);
  // console.log('Brand Details::::', brandDetails);


    CreatorInstagram.findOne({ influencer_id : user_id}).then((res_price)=>{

      // console.log('RESULTTTTTT:::::', result);

    res.status(200).send({ 
      data: result, 
      cost_per_post_image: res_price.cost_per_post_image, 
      cost_per_post_video: res_price.cost_per_post_video,
      brand_logo: brandDetails.brand_logo, 
      brand_name: brandDetails.brand_name });
    res.end();

    }).catch(e1=>{
    console.log('error:::', e1);

});
  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/get-myCampaign-details', async function (req, res){


  const user_id = req.body.userId;
  const campaignId = req.body.campaignId;




  const campaignReq = await CampaignRequests.findOne({$and: [
    { campaign_id: campaignId },
    { creator_id: user_id }
  ]}).populate('brand_id');

  const campaignSche = await CampaignApprovedRequests.findOne({$and: [
    { campaign_id: campaignId },
    { creator_id: user_id }
  ]}).populate('brand_id');

  if(campaignReq){

    const campaign_details = await Campaign.findById(campaignId);

    const finalData = {
    '_id': campaignReq._id,
    'caption': campaign_details.caption,
    'brand_id': campaignReq.brand_id._id,
    'publishDate' : campaign_details.publishDate,
    'quoted_price' : campaignReq.quoted_price,
    'mediaFiles': campaign_details.mediaFiles,
    'fileType': campaign_details.fileType,
    'brand_logo': campaignReq.brand_id.brand_logo,
    'brand_name' : campaignReq.brand_id.brand_name,
    'status' : 'Awaiting Approval'
    
  }


  res.status(200).send({ data: finalData });
  res.end();

  }

  else if(campaignSche){
    const campaign_details = await Campaign.findById(campaignId);

    const scheduledPostData = {
    '_id': campaignSche._id,
    'caption': campaign_details.caption,
    'brand_id': campaignSche.brand_id._id,
    'publishDate' : campaign_details.publishDate,
    'quoted_price' : campaignSche.quoted_price,
    'mediaFiles': campaign_details.mediaFiles,
    'fileType': campaign_details.fileType,
    'brand_logo': campaignSche.brand_id.brand_logo,
    'brand_name' : campaignSche.brand_id.brand_name,
    'status' : 'Approved'
    
  }


  res.status(200).send({ data: scheduledPostData });
  res.end();

  }


    

});

router.post('/published/campaignDetails', async function (req, res){

  const user_id = req.body.userId;
  const campaignId = req.body.campaignId;


  CampaignApprovedRequests.findOne({$and: [
    { campaign_id: campaignId },
    { creator_id: user_id }
  ]}).then((result)=>{

    Influencer.findById(user_id).then((res_price)=>{

    res.status(200).send({ data: result });
    res.end();

    }).catch(e1=>{
    console.log('error:::', e1);

});
  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/campaign/show-interest', async function (req, res){

  const user_id = req.body.userId;
  const campaignId = req.body.campaignId;
  const price = req.body.price;
  const campaignName = req.body.campaignName;
  const caption = req.body.caption;
  const publishDate = req.body.publishDate;
  const brand_id = req.body.brand_id;
  

  CampaignRequests.findOne({$and: [
    { campaign_id: campaignId },
    { creator_id: user_id }
  ]}).then((result)=>{

    if(result){
      console.log('Entered If');
    res.status(200).send({ isAdded: false });
    res.end();

    }

    else 
    {

      CampaignRequests.create({
                campaign_id: campaignId,
                creator_id: user_id,
                quoted_price: price,
                campaignName: campaignName,
                caption: caption,
                publishDate: publishDate,
                brand_id: brand_id,
              });

      res.status(200).send({ isAdded: true });
    res.end();
    }
   

  }).catch((e)=>{

    console.log('Error:',e );


  });

});




router.post('/published/campaigns', async function (req, res){

  const user_id = req.body.userId;

CampaignApprovedRequests.find({creator_id : user_id}).then(async (result) => {


  if(result){
    
    const campaignData = await Promise.all(
      result.map(async (campData) => {

        console.log('123456777777', campData);
  
  
        const result2 = await Campaign.findById(campData.campaign_id);
    
        return (
          {
            '_id': campData._id,
            'caption': campData.caption,
            'publishDate': campData.publishDate,
            'brand_name': result2.brand_name,
            'brand_category': result2.brand_category,
            'campaign_id': campData.campaign_id,
            'is_published': campData.is_published
            
          }
        )
   
  
      })
    );

    console.log('CampaignData::', campaignData);

    res.status(200).send({campaigns: campaignData});
    res.end();
  }

  else {
    res.status(200).send({campaigns: null});
    res.end();
  }

}).catch((error) =>{

})




})


router.post("/creator-insights", async function (req, res) {
  let user_id = req.body.userId;

  Influencer.findById(user_id).then((userData) => {
    let instagram_account_id = userData.instagram_business_account_id;
    let instagram_account_category = userData.category;
    let access_token = userData.access_token;
    let fields = "name,username,biography,followers_count,media_count,profile_picture_url";
    let metrics = "audience_country,audience_city,audience_gender_age";
    getUserData(instagram_account_id, user_id, fields, access_token, instagram_account_category);
    // console.log('User Data::::', getUserData);
    instaAudienceData(instagram_account_id, user_id, metrics, access_token);
    // console.log('Audience Data::::', instaAudienceData);

    fetchMediaData(instagram_account_id, access_token).then((mediaData) => {
        // console.log('Media Data:', mediaData);
        mediaData.map(async (doIt) => {

          if(doIt.media_type === 'CAROUSEL_ALBUM'){
            try{
              const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=carousel_album_reach,carousel_album_impressions,carousel_album_engagement&access_token=" + access_token;

              const response = await axios.get(url);
              // console.log('Carousel Response:::', response.data);

              PostMetrics.findOneAndUpdate(
                { media_id: doIt.id },
                {
                  $set: {
                    media_id: doIt.id,
                    influencer_id: user_id,
                    insta_page_username: instagram_account_id,
                    media_type: doIt.media_type,
                    media_product_type: doIt.media_product_type,
                    likes: doIt.like_count,
                    caption: doIt.caption,
                    comments_count: doIt.comments_count,
                    media_url: doIt.media_url,
                    thumbnail_url: doIt.thumbnail_url,
                    permaLink: doIt.permalink,
                    timeStamp: doIt.timestamp,
                    comments: doIt.comments.data,
                    reach: response.data.data[0].values[0].value,
                    impressions: response.data.data[1].values[0].value,
                    engagement: response.data.data[2].values[0].value,
                  },
                },
                { upsert: true, new: true }
              )
    
                .then((document) => {
                  // console.log('Document:', document);
                })
                .catch((error) => {
                  console.error("Error updating/creating document:", error);
                });

            }

            catch{
              // console.log('Catch Error');
              PostMetrics.findOneAndUpdate(
                { media_id: doIt.id },
                {
                  $set: {
                    media_id: doIt.id,
                    influencer_id: user_id,
                    insta_page_username: instagram_account_id,
                    media_type: doIt.media_type,
                    media_product_type: doIt.media_product_type,
                    likes: doIt.like_count,
                    caption: doIt.caption,
                    comments_count: doIt.comments_count,
                    media_url: doIt.media_url,
                    thumbnail_url: doIt.thumbnail_url,
                    permaLink: doIt.permalink,
                    timeStamp: doIt.timestamp,
                    comments: doIt.comments.data,
                    beforeBusinessAccount: true,
                    reach: 0,
                    impressions: 0,
                    engagement: 0,
                  },
                },
                { upsert: true, new: true }
              )
    
                .then((document) => {
                  // console.log('Document:', document);
                })
                .catch((error) => {
                  console.error("Error updating/creating document:", error);
                });
            }

          }

          else if(doIt.media_type === 'VIDEO' && doIt.media_product_type === 'REELS') {
            try{

              const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=reach&access_token=" + access_token;

              const reelsResponse = await axios.get(url);
              // console.log('Carousel Response:::', reelsResponse.data);

              PostMetrics.findOneAndUpdate(
                { media_id: doIt.id },
                {
                  $set: {
                    media_id: doIt.id,
                    influencer_id: user_id,
                    insta_page_username: instagram_account_id,
                    media_type: doIt.media_type,
                    media_product_type: doIt.media_product_type,
                    likes: doIt.like_count,
                    caption: doIt.caption,
                    comments_count: doIt.comments_count,
                    media_url: doIt.media_url,
                    thumbnail_url: doIt.thumbnail_url,
                    permaLink: doIt.permalink,
                    timeStamp: doIt.timestamp,
                    comments: doIt.comments.data,
                    reach: reelsResponse.data.data[0].values[0].value,
                    impressions: 0,
                    engagement: 0,
                  },
                },
                { upsert: true, new: true }
              )
    
                .then((document) => {
                  // console.log('Document:', document);
                })
                .catch((error) => {
                  console.error("Error updating/creating document:", error);
                });

            }
            catch{
              console.log('Catch Error');
              PostMetrics.findOneAndUpdate(
                { media_id: doIt.id },
                {
                  $set: {
                    media_id: doIt.id,
                    influencer_id: user_id,
                    insta_page_username: instagram_account_id,
                    media_type: doIt.media_type,
                    media_product_type: doIt.media_product_type,
                    likes: doIt.like_count,
                    caption: doIt.caption,
                    comments_count: doIt.comments_count,
                    media_url: doIt.media_url,
                    thumbnail_url: doIt.thumbnail_url,
                    permaLink: doIt.permalink,
                    timeStamp: doIt.timestamp,
                    comments: doIt.comments.data,
                    beforeBusinessAccount: true,
                    reach: 0,
                    impressions: 0,
                    engagement: 0,
                  },
                },
                { upsert: true, new: true }
              )
    
                .then((document) => {
                  // console.log('Document:', document);
                })
                .catch((error) => {
                  console.error("Error updating/creating document:", error);
                });

            }
          }

          else if(doIt.media_type === 'IMAGE') {
            try{
              const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=reach,impressions,engagement&access_token=" + access_token;

              const imageResponse = await axios.get(url);
              // console.log('Carousel Response:::', imageResponse.data.data[0]);
              // console.log('Caption:::::', doIt.caption);
              PostMetrics.findOneAndUpdate(
                { media_id: doIt.id },
                {
                  $set: {
                    media_id: doIt.id,
                    influencer_id: user_id,
                    insta_page_username: instagram_account_id,
                    media_type: doIt.media_type,
                    media_product_type: doIt.media_product_type,
                    likes: doIt.like_count,
                    caption: doIt.caption,
                    comments_count: doIt.comments_count,
                    media_url: doIt.media_url,
                    thumbnail_url: doIt.thumbnail_url,
                    permaLink: doIt.permalink,
                    timeStamp: doIt.timestamp,
                    comments: doIt.comments.data,
                    reach: imageResponse.data.data[0].values[0].value,
                    impressions: imageResponse.data.data[1].values[0].value,
                    engagement: imageResponse.data.data[2].values[0].value,
                  },
                },
                { upsert: true, new: true }
              )
    
                .then((document) => {
                  // console.log('Document:', document);
                })
                .catch((error) => {
                  console.error("Error updating/creating document:", error);
                });

            }
            catch{
              // console.log('Catch Block Caption:::::', doIt.caption);

              PostMetrics.findOneAndUpdate(
                { media_id: doIt.id },
                {
                  $set: {
                    media_id: doIt.id,
                    influencer_id: user_id,
                    insta_page_username: instagram_account_id,
                    media_type: doIt.media_type,
                    media_product_type: doIt.media_product_type,
                    likes: doIt.like_count,
                    caption: doIt.caption,
                    comments_count: doIt.comments_count,
                    media_url: doIt.media_url,
                    thumbnail_url: doIt.thumbnail_url,
                    permaLink: doIt.permalink,
                    timeStamp: doIt.timestamp,
                    // comments: doIt.comments.data,
                    beforeBusinessAccount: true,
                    reach: 0,
                    impressions: 0,
                    engagement: 0,
                  },
                },
                { upsert: true, new: true }
              )
    
                .then((document) => {
                  // console.log('Document:', document);
                })
                .catch((error) => {
                  console.error("Error updating/creating document:", error);
                });

            }
          }

          else {
            try{
              PostMetrics.findOneAndUpdate(
                { media_id: doIt.id },
                {
                  $set: {
                    media_id: doIt.id,
                    influencer_id: user_id,
                    insta_page_username: instagram_account_id,
                    media_type: doIt.media_type,
                    media_product_type: doIt.media_product_type,
                    likes: doIt.like_count,
                    caption: doIt.caption,
                    comments_count: doIt.comments_count,
                    media_url: doIt.media_url,
                    thumbnail_url: doIt.thumbnail_url,
                    permaLink: doIt.permalink,
                    timeStamp: doIt.timestamp,
                    comments: doIt.comments.data,
                  },
                },
                { upsert: true, new: true }
              )
    
                .then((document) => {
                  // console.log('Document:', document);
                })
                .catch((error) => {
                  console.error("Error updating/creating document:", error);
                });

            }
            catch{

            }
          }
         
        });
      })
      .catch((error) => {
        console.error("Error fetching media data:", error);
      });
  });

  CreatorInstagram.findOne({ influencer_id: user_id })
    .then((resDocument) => {
      // console.log('DATAAA:::::', resDocument);
      if (!resDocument) {
        throw new Error("Document not found"); // Handle if the document is not found
      }

      res.status(200).send({ data: resDocument });
      res.end();
    })
    .catch((error) => {
      console.log(error);
    });

    
});

router.post("/profile-followers-name-image", async function (req, res) {
  let user_id = req.body.userId;


    CreatorInstagram.findOne({ influencer_id: user_id })
    .then((result) => {

      const creator_data = {

        'followers_count' : result.followers_count,
        'iG_name' : result.iG_name,
        'iG_profilePic' : result.iG_profile_pic_url,
        'category' : result.category
        
      }

      res.status(200).send({ data: creator_data });
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });

});

router.post("/email-mobile", async function (req, res) {
  let user_id = req.body.userId;


    Influencer.findById(user_id )
    .then((result) => {

      const creator_data = {

        'email' : result.email,
        'mobile_num' : result.mobile_num,
        'category' : result.category,
        
      }

      res.status(200).send({ data: creator_data });
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });

});

router.post("/creator-camp-details", async function (req, res) {
  let user_id = req.body.userId;
  let total_revenue = 0;


  PublishedPosts.find({ influencer_id : user_id} )
    .then(async (result) => {

    await Promise.all(result.map(async (data) => {
  
      total_revenue = total_revenue + data.costPerPost;
      


      }));

  const scheduled_posts = await ScheduledPosts.find({ 'influencer_id': user_id });


      const creator_camp_details = {

        'revenue' : total_revenue,
        'total_campaigns' : result.length + scheduled_posts.length,
        'onGoing_posts' : scheduled_posts.length,
        
      }

      console.log('dettttt:::::', creator_camp_details);

      res.status(200).send({ data: creator_camp_details });
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });


    

});

router.post("/bank-details", async function (req, res) {
  let user_id = req.body.userId;


  CreatorBankDetails.findOne({influencer_id : user_id})
    .then((result) => {

    if(result){

      res.status(200).send({ data: result });
      res.end();

    }
    else{

      res.status(200).send({ data: {} });
      res.end();

    }

      
    })
    .catch((err) => {
      console.log(err);
    });

});


router.post("/submit-bankDetails", async function (req, res) {

  const { userId, bankName, accountNumber, ifsc} = req.body;

  await CreatorBankDetails.create({
    influencer_id: userId,
    bank_name: bankName,
    account_number: accountNumber,
    ifsc_code: ifsc,
  });

  res.status(200).send({ data: true});
  res.end();




});

router.post("/check-email-exists", async function (req, res) {

  const { email } = req.body;
  
  Influencer.findOne({ email : email}).then( (result)=>{

    if(result){
      res.status(200).send({ exists: true});
      res.end();

    }

    else{

      res.status(200).send({ exists: false});
      res.end();


    }

  }).catch((err) =>{

  })


});

router.post("/send-resetPin", async function (req, res) {

  const { email } = req.body;
  const pin = generatePin();
  const options = {
    to: email,
    subject: "Password Reset PIN - BroadReach",
    text: `Your 6-digit PIN: ${pin}`,
}

  
  Influencer.findOne({ email : email}).then(async (result)=>{

    if(result){

      await Influencer.findByIdAndUpdate(result._id, { reset_pin: pin });
      await sendMail(options);
 
  res.status(200).send({ emailSent: true});
  res.end();


    }

    else{


    }

  }).catch((err) =>{

  })

});


router.post("/check-resetPin-withDb", async function (req, res) {

  const { email, pin } = req.body;
  const pinAsInt = parseInt(pin);
  
  Influencer.findOne({ email : email}).then(async (result)=>{

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
  console.log('email::::', email);
  console.log('password::::', password);
  const hashedPassword = bcrypt.hashSync(password, 10);

  
  Influencer.findOne({ email : email}).then(async (result)=>{

    if(result){

      await Influencer.findByIdAndUpdate(result._id, { password: hashedPassword });
 
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


router.post("/change-password", async function (req, res) {

  const { userId, password, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);


  
  Influencer.findById(userId).select("+hashPassword").then((result)=>{

    if(result){

      bcrypt.compare(password, result.password, async function (err1, ress) {
        if (ress === true) {

          console.log('Correct Password');

          await Influencer.findByIdAndUpdate(result._id, { password: hashedPassword });
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







router.post("/check-token-expiry", async function (req, res) {
  let user_id = req.body.userId;

    Influencer.findById(user_id)
    .then((result) => {

      tokenExpiryDate = result.token_expiry_date;
     

      const currentDate = new Date();
      
      if (currentDate <= tokenExpiryDate) {
        res.status(200).send({ tokenExpired: false });
      } else {
        res.status(200).send({ tokenExpired: true});
        
      }



    })
    .catch((err) => {
      console.log(err);
    });




 

  // getUserData(instagram_account_id, user_id, fields, access_token);
});



router.post('/campaign/scheduleNow', async function(req, res){

  const user_id = req.body.influencer_id;
  const campaignId = req.body.campaign_id;
  const mediaId = req.body.media_id;
  const brandUser_id = req.body.brandUser_id;

  const costPerPost = await Influencer.findById(user_id);

    const jobData = {
      campaignId: campaignId,
      user_id: user_id,
      mediaId: mediaId ,
      brandUser_id: brandUser_id,
      costPerPost: costPerPost.costPerPost,
    };
  
    const scheduledDate = new Date('2023-08-30T01:29:00');
    await agenda.schedule(scheduledDate, 'publish campaign', jobData);

    res.status(200).send({ status: 'posted' });
          res.end();
  
})

router.post('/get-total-campaigns-done', async function (req, res){

  const user_id = req.body.userId;

  PublishedPosts.find({'influencer_id': user_id}).then((result)=>{

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

router.post('/total-revenue-generated', async function (req, res){

  const user_id = req.body.userId;
  let totalRevenue = 0;


  await PublishedPosts.find({'influencer_id': user_id}).then(async (result)=>{

    if(result){

      await Promise.all(result.map(async (data) => {

        totalRevenue = totalRevenue + data.costPerPost;
  
      }));

    res.status(200).send({ data: totalRevenue});
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

router.get('/get-all-bank-names', async function (req, res) {

  await AllBankNames.find().then(async (result)=>{

    res.status(200).send({ data: result});
    res.end();

  });

});



// this piece of cron shit will check & update campaigns whether completed or not in DB eveyday @12:00
const updateCampaigns = async () => {
  try {
    const currentDate = moment();
    const campaigns = await Campaign.find({ is_completed: false });

    campaigns.forEach(async (campaign) => {
      const publishDate = moment(campaign.publishDate);
      if (currentDate.isAfter(publishDate)) {
        await Campaign.findByIdAndUpdate(campaign._id, { is_completed: true });
      }
    });

    // console.log('Campaigns updated successfully.');
  } catch (error) {
    console.error('Error updating campaigns:', error);
  }
};

cron.schedule('0 0 * * *', () => {
  updateCampaigns();
});









module.exports = router;
