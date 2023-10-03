// const express = require("express");
// // const app = express();
// const cookieParser = require("cookie-parser");
// const mongoose = require('mongoose');
// const moment = require('moment');
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const Influencer = require("../models/Influencer");
// const CreatorInstagram = require("../models/CreatorInstagramDetails");
// const InstaPageMetrics = require("../models/InstaPageMetrics");
// const PostMetrics = require("../models/PostMetrics");
// const Campaign = require("../models/Campaign");
// const CampaignApprovedRequests = require("../models/CampaignApprovedRequests");
// const CampaignRequests = require("../models/CampaignRequests");
// const PublishedPosts = require("../models/PublishedPosts");
// var jwt = require("jsonwebtoken");
// var jwtSecret = "P@sswordIsDangerous#";
// const { body, validationResult } = require("express-validator");
// const ErrorHandler = require("../utils/ErrorHandler");
// const sendMail = require("../utils/sendMail");
// const countryList = require("country-list");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const {
//   createToken,
//   isBrandAuthenticated,
//   creatorToken,
//   isCreatorAuthenticated,
// } = require("../middleware/jwtToken");
// const agenda = require('../middleware/agendaManager');
// router.use(cookieParser());
// const axios = require("axios");
// const { ContactPageSharp } = require("@mui/icons-material");

// const username= "intraxnio";
// const password = 'Pa55w0Rd';
// var dbUrl= "mongodb+srv://"+username+":"+password+"@cluster0.1u64z5l.mongodb.net/?retryWrites=true&w=majority"

// var fbAppID = "957873452119557";
// // var fb_redirecturl = "https://localhost:4700/insta_redirect_url";
// var fb_redirecturl = "https://localhost:4700/insta_graph_dialogue";
// var fb_secret = "f4c9a7fd08841f50856f684b0448fff8";

// router.post("/signup-creator", async (req, res, next) => {
//   try {
//     const { email, password, category } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const userEmail = await Influencer.findOne({ email: email });
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
//     return next(new ErrorHandler(error.message, 500));
//   }
// });

// router.post("/creator-login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res.status(400).send({
//         error: "All fields are mandatory",
//         data: null,
//         message: "Please provide all fields",
//       });
//       res.end();
//     }

//     const user = await Influencer.findOne({ email }).select("+hashPassword");
//     console.log("user record from DB:", user);

//     if (!user) {
//       res.status(400).send({
//         error: "User does not exists!",
//         data: null,
//         message: "User does not exists!",
//       });
//       res.end();
//     }

//     bcrypt.compare(password, user.password, function (err1, result) {
//       if (result === true) {
//         creatorToken(user, res);
//       } else {
//         res.status(400).send({
//           error: "email, password mismatch",
//           data: null,
//           message: "Please provide correct information",
//         });
//         res.end();
//       }
//     });
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });

// router.get("/getCreator", isCreatorAuthenticated, (req, res, next) => {
//   if (req.statusCode == 400) {
//     // res.status(200).send({ data: null });
//     res.status(200).send({ data: null });
//     res.end();
//   } else {
//     const userId = req.userId;
//     res.status(200).send({ data: userId });
//   }
// });

// const getUserData = async (insta_user_id, userId, fields, accessToken, instagram_account_category) => {
//   try {

//     const url ="https://graph.facebook.com/v17.0/" +insta_user_id + "?fields=" + fields + "&access_token=" + accessToken;

//     const response = await axios.get(url);

//     CreatorInstagram.findOne({ influencer_id: userId })
//       .then(async (document) => {
//     const url2 = "https://graph.facebook.com/v17.0/"+insta_user_id +"/insights?metric=impressions,reach&period=days_28&access_token=" +
//       accessToken;

//     const impressionsRes = await axios.get(url2);
    
//         console.log('DOCC::::', impressionsRes.data.data[0].values[1].value);
//         if (document) {
//           document.iG_name = response.data.name;
//           document.instagram_business_account_id = insta_user_id;
//           document.iG_profile_pic_url = response.data.profile_picture_url;
//           document.iG_username = response.data.username;
//           document.followers_count = response.data.followers_count;
//           document.media_count = response.data.media_count;
//           document.iG_biography = response.data.biography;
//           document.category = instagram_account_category;
//           document.impressions_last_28days = impressionsRes.data.data[0].values[1].value;
//           document.reach_last_28days = impressionsRes.data.data[1].values[1].value;
//           return document.save();
//         }

//         CreatorInstagram.create({
//           influencer_id: userId,
//           iG_name: response.data.name,
//           instagram_business_account_id: insta_user_id,
//           iG_profile_pic_url: response.data.profile_picture_url,
//           iG_username: response.data.username,
//           followers_count: response.data.followers_count,
//           media_count: response.data.media_count,
//           iG_biography: response.data.biography,
//           category: instagram_account_category,
//           impressions_last_28days: impressionsRes.data.data[0].values[1].value,
//           reach_last_28days: impressionsRes.data.data[1].values[1].value,
//         });
//       })

//       .then((updatedDocument) => {
//         // console.log('Fields updated:', updatedDocument);
//         // res.status(200).send({data: updatedDocument});
//         // res.end();
//       })
//       .catch((error) => {
//         console.error("Error updating fields:", error);
//       });

//     // Process the response data
//     // console.log('User Data:', response.data);
//   } catch (error) {
//     console.error("Error retrieving user data:", error);
//   }
// };

// async function fetchMediaData(insta_user_id, accessToken,) {
//   try {
//     const baseUrl = "https://graph.facebook.com/v17.0";
//     const fields =
//       "id,caption,media_type,like_count,comments_count,media_product_type,thumbnail_url,media_url,permalink,timestamp,owner,comments";
//     const params = new URLSearchParams({
//       access_token: accessToken,
//       fields,
//     });

//     const mediaData = [];

//     let hasNextPage = true;
//     let afterCursor = "";

//     while (hasNextPage) {
//       const apiUrl = `${baseUrl}/${insta_user_id}/media?${params.toString()}&after=${afterCursor}`;
//       const response = await axios.get(apiUrl);
//       const { data, paging } = response.data;
//       mediaData.push(...data);

//       if (paging && paging.next) {
//         const url = new URL(paging.next);
//         afterCursor = url.searchParams.get("after");
//       } else {
//         hasNextPage = false;
//       }
//     }

//     return mediaData;

//     // mediaData.map((findTypeIterate)=>{

//     //   if( findTypeIterate.media_type=='IMAGE' && findTypeIterate.media_product_type=='FEED')


//     // })
//     // const finalResponse = await axios.get("")





//   } catch (error) {
//     console.error("Error retrieving user data:", error);
//   }
// }

// const instaAudienceData = async (
//   insta_user_id,
//   userId,
//   metrics,
//   accessToken
// ) => {
//   let countriesArray = [];
//   let citiesArray = [];
//   let totalGenderArray = [];

//   try {
//     const url =
//       "https://graph.facebook.com/v17.0/" +
//       insta_user_id +
//       "/insights?metric=" +
//       metrics +
//       "&period=lifetime&access_token=" +
//       accessToken;

//     const response = await axios.get(url);
//     const countryData = response.data.data[0].values;

//     const countryValues = countryData.map((item) => item.value)[0];

//     // Iterate over the key-value pairs
//     countriesArray = Object.entries(countryValues).map(
//       ([countryCode, followers_count]) => {
//         const countryName = countryList.getName(countryCode);
//         return {
//           country: countryName,
//           followers_count: followers_count,
//         };
//       }
//     );

//     const cityData = response.data.data[1].values;
//     const cityValues = cityData.map((item) => item.value)[0];

//     citiesArray = Object.entries(cityValues).map(
//       ([cityName, followers_count]) => {
//         // const countryName = countryList.getName(countryCode);
//         return {
//           city: cityName,
//           followers_count: followers_count,
//         };
//       }
//     );

//     const genderData = response.data.data[2].values;
//     // console.log('genderData::::', genderData);
//     const genderValues = genderData.map((item) => item.value)[0];
//     const male = /M/;
//     const female = /F/;
//     const other = /U/;
//     let totalMale = 0;
//     let totalFemale = 0;
//     let totalOther = 0;
//     Object.entries(genderValues).map(([gender, followers_count]) => {
//       // const countryName = countryList.getName(countryCode);
//       if (male.test(gender)) {
//         totalMale = totalMale + parseInt(followers_count);
//         totalGenderArray.push({
//           gender: "Male",
//           followers_count: followers_count,
//         });
//       } else if (female.test(gender)) {
//         totalFemale = totalFemale + parseInt(followers_count);
//         totalGenderArray.push({
//           gender: "Female",
//           followers_count: followers_count,
//         });
//       } else if (other.test(gender)) {
//         totalOther = totalOther + parseInt(followers_count);
//         totalGenderArray.push({
//           gender: "Other",
//           followers_count: followers_count,
//         });
//       }
//     });

//     let newArray = [];

//     for (const key in genderValues) {
//       const ageGroup = key.split(".")[1]; // Extract the age group from the key
//       const value = genderValues[key]; // Get the value from the object

//       // Check if the age group already exists in the newArray
//       const existingIndex = newArray.findIndex((obj) =>
//         obj.hasOwnProperty(ageGroup)
//       );
//       if (existingIndex !== -1) {
//         newArray[existingIndex][ageGroup] += value; // Append the value to the existing age group
//       } else {
//         newArray.push({ [ageGroup]: value }); // Push a new object with the age group and value
//       }
//     }
//     // console.log('New Array::', newArray);

//     InstaPageMetrics.findOne({ influencer_id: userId })
//       .then((document) => {
//         const sortedCountries = countriesArray.sort(
//           (a, b) => b.followers_count - a.followers_count
//         );
//         const sortedCities = citiesArray.sort(
//           (a, b) => b.followers_count - a.followers_count
//         );
//         const api_returned_followers = totalMale + totalFemale + totalOther;
//         const totalMalePercent = Math.round(
//           (totalMale / api_returned_followers) * 100
//         );
//         const totalFemalePercent = Math.round(
//           (totalFemale / api_returned_followers) * 100
//         );
//         const totalOtherPercent = Math.round(
//           (totalOther / api_returned_followers) * 100
//         );
//         // console.log('DOCC::::', document);
//         if (document) {
//           document.audience_country = sortedCountries;
//           document.audience_cities = sortedCities;
//           document.audience_gender_age = totalGenderArray;
//           document.age_wise_followers = newArray;
//           document.male_percentage = totalMalePercent;
//           document.female_percentage = totalFemalePercent;
//           document.other_percentage = totalOtherPercent;
//           document.updated_at = new Date();
//           return document.save();
//         }

//         InstaPageMetrics.create({
//           influencer_id: userId,
//           audience_country: sortedCountries,
//           audience_cities: sortedCities,
//           audience_gender_age: totalGenderArray,
//           age_wise_followers: newArray,
//           male_percentage: totalMalePercent,
//           female_percentage: totalFemalePercent,
//           other_percentage: totalOtherPercent,
//         });
//       })
//       .then((updatedDocument) => {
//         // console.log('Fields updated:', updatedDocument);
//         // res.status(200).send({data: updatedDocument});
//         // res.end();
//       })
//       .catch((error) => {
//         console.error("Error updating fields:", error);
//       });
//   } catch (error) {
//     console.error("Error retrieving user data:", error);
//   }
// };

// router.post("/fb_insta_redirect_url", async function (req, res) {
//   let code = req.body.access_code;
//   let user_id = req.body.userId;
//   let fb_access_token = null;
//   let token_expires_in = null;

//   await axios
//     .get(
//       "https://graph.facebook.com/v17.0/oauth/access_token?client_id=" +
//         fbAppID +
//         "&redirect_uri=" +
//         fb_redirecturl +
//         "&client_secret=" +
//         fb_secret +
//         "&code=" +
//         code
//     )
//     .then((res1) => {
//       fb_access_token = res1.data.access_token;
//       token_expires_in = res1.data.expires_in;

//       try {
//         const url = "https://graph.facebook.com/v17.0/me/accounts";

//         axios
//           .get(url, {
//             params: {
//               fields: "instagram_business_account",
//               access_token: fb_access_token,
//             },
//           })
//           .then((res2) => {
//             let instagram_businessId = JSON.stringify(
//               res2.data.data[0].instagram_business_account.id
//             );
//             // the above variable returns double quoted instagram account Id ex: "4567898765", so remove double quotes and save to DB
//             let removeQuotes_from_Id = instagram_businessId.replaceAll('"', "");
//             console.log('Reached getUserData function');
//             getUserData(
//               removeQuotes_from_Id,
//               user_id,
//               "biography,followers_count,media_count,name,profile_picture_url,username",
//               fb_access_token,
//               res
//             );

//             Influencer.findById(user_id)
//               .then((document) => {
//                 // getMediaIds(removeQuotes_from_Id, fb_access_token);

//                 if (!document) {
//                   throw new Error("Document not found"); // Handle if the document is not found
//                 }

//                 // fields to update
//             console.log('Updated token....');

//                 document.access_token = fb_access_token;
//                 document.token_expires_in = token_expires_in;
//                 document.instagram_business_account_id = removeQuotes_from_Id;
//                 document.updated_at = new Date();
//                 return document.save();

//               })
//               .then((updatedDocument) => {
//                 console.log('Fields updated:', updatedDocument);
//                 res.status(200).send({ data: updatedDocument });
//                 res.end();
//               })
//               .catch((error) => {
//                 console.error("Error updating fields:", error);
//               });
//           })
//           .catch((e) => {});

//         // Extract the Instagram accounts from the response
//         // const instagramAccounts = response.data.data.filter(
//         //   (account) => account.instagram_business_account
//         // );
//       } catch (error) {
//         console.error("Error retrieving Instagram accounts:", error);
//       }
//     })
//     .catch((e) => {});
// });


// router.post("/creator-insights", async function (req, res) {
//   let user_id = req.body.userId;

//   Influencer.findById(user_id).then((userData) => {
//     let instagram_account_id = userData.instagram_business_account_id;
//     let instagram_account_category = userData.category;
//     let access_token = userData.access_token;
//     let fields =
//       "name,username,biography,followers_count,media_count,profile_picture_url";
//     let metrics = "audience_country,audience_city,audience_gender_age";
//     getUserData(instagram_account_id, user_id, fields, access_token, instagram_account_category);
//     // console.log('User Data::::', getUserData);
//     instaAudienceData(instagram_account_id, user_id, metrics, access_token);
//     // console.log('Audience Data::::', instaAudienceData);

//     fetchMediaData(instagram_account_id, access_token).then((mediaData) => {
//         // console.log('Media Data:', mediaData);
//         mediaData.map(async (doIt) => {

//           if(doIt.media_type === 'CAROUSEL_ALBUM'){
//             try{
//               const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=carousel_album_reach,carousel_album_impressions,carousel_album_engagement&access_token=" + access_token;

//               const response = await axios.get(url);
//               // console.log('Carousel Response:::', response.data.data[0]);

//               PostMetrics.findOneAndUpdate(
//                 { media_id: doIt.id },
//                 {
//                   $set: {
//                     media_id: doIt.id,
//                     influencer_id: user_id,
//                     insta_page_username: instagram_account_id,
//                     media_type: doIt.media_type,
//                     media_product_type: doIt.media_product_type,
//                     likes: doIt.like_count,
//                     caption: doIt.caption,
//                     comments_count: doIt.comments_count,
//                     media_url: doIt.media_url,
//                     thumbnail_url: doIt.thumbnail_url,
//                     permaLink: doIt.permalink,
//                     timeStamp: doIt.timestamp,
//                     comments: doIt.comments.data,
//                     reach: response.data.data[0].values[0].value,
//                     impressions: response.data.data[1].values[0].value,
//                     engagement: response.data.data[2].values[0].value,
//                   },
//                 },
//                 { upsert: true, new: true }
//               )
    
//                 .then((document) => {
//                   // console.log('Document:', document);
//                 })
//                 .catch((error) => {
//                   console.error("Error updating/creating document:", error);
//                 });

//             }

//             catch{
//               // console.log('Catch Error');
//               PostMetrics.findOneAndUpdate(
//                 { media_id: doIt.id },
//                 {
//                   $set: {
//                     media_id: doIt.id,
//                     influencer_id: user_id,
//                     insta_page_username: instagram_account_id,
//                     media_type: doIt.media_type,
//                     media_product_type: doIt.media_product_type,
//                     likes: doIt.like_count,
//                     caption: doIt.caption,
//                     comments_count: doIt.comments_count,
//                     media_url: doIt.media_url,
//                     thumbnail_url: doIt.thumbnail_url,
//                     permaLink: doIt.permalink,
//                     timeStamp: doIt.timestamp,
//                     comments: doIt.comments.data,
//                     beforeBusinessAccount: true,
//                     reach: 0,
//                     impressions: 0,
//                     engagement: 0,
//                   },
//                 },
//                 { upsert: true, new: true }
//               )
    
//                 .then((document) => {
//                   // console.log('Document:', document);
//                 })
//                 .catch((error) => {
//                   console.error("Error updating/creating document:", error);
//                 });
//             }

//           }

//           else if(doIt.media_type === 'VIDEO' && doIt.media_product_type === 'REELS') {
//             try{

//               const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=reach&access_token=" + access_token;

//               const reelsResponse = await axios.get(url);
//               // console.log('Carousel Response:::', reelsResponse.data.data[0]);

//               PostMetrics.findOneAndUpdate(
//                 { media_id: doIt.id },
//                 {
//                   $set: {
//                     media_id: doIt.id,
//                     influencer_id: user_id,
//                     insta_page_username: instagram_account_id,
//                     media_type: doIt.media_type,
//                     media_product_type: doIt.media_product_type,
//                     likes: doIt.like_count,
//                     caption: doIt.caption,
//                     comments_count: doIt.comments_count,
//                     media_url: doIt.media_url,
//                     thumbnail_url: doIt.thumbnail_url,
//                     permaLink: doIt.permalink,
//                     timeStamp: doIt.timestamp,
//                     comments: doIt.comments.data,
//                     reach: reelsResponse.data.data[0].values[0].value,
//                     impressions: 0,
//                     engagement: 0,
//                   },
//                 },
//                 { upsert: true, new: true }
//               )
    
//                 .then((document) => {
//                   // console.log('Document:', document);
//                 })
//                 .catch((error) => {
//                   console.error("Error updating/creating document:", error);
//                 });

//             }
//             catch{
//               console.log('Catch Error');
//               PostMetrics.findOneAndUpdate(
//                 { media_id: doIt.id },
//                 {
//                   $set: {
//                     media_id: doIt.id,
//                     influencer_id: user_id,
//                     insta_page_username: instagram_account_id,
//                     media_type: doIt.media_type,
//                     media_product_type: doIt.media_product_type,
//                     likes: doIt.like_count,
//                     caption: doIt.caption,
//                     comments_count: doIt.comments_count,
//                     media_url: doIt.media_url,
//                     thumbnail_url: doIt.thumbnail_url,
//                     permaLink: doIt.permalink,
//                     timeStamp: doIt.timestamp,
//                     comments: doIt.comments.data,
//                     beforeBusinessAccount: true,
//                     reach: 0,
//                     impressions: 0,
//                     engagement: 0,
//                   },
//                 },
//                 { upsert: true, new: true }
//               )
    
//                 .then((document) => {
//                   // console.log('Document:', document);
//                 })
//                 .catch((error) => {
//                   console.error("Error updating/creating document:", error);
//                 });

//             }
//           }

//           else if(doIt.media_type === 'IMAGE') {
//             try{
//               const url = "https://graph.facebook.com/v17.0/" + doIt.id + "/insights?metric=reach,impressions,engagement&access_token=" + access_token;

//               const imageResponse = await axios.get(url);
//               // console.log('Carousel Response:::', reelsResponse.data.data[0]);
//               PostMetrics.findOneAndUpdate(
//                 { media_id: doIt.id },
//                 {
//                   $set: {
//                     media_id: doIt.id,
//                     influencer_id: user_id,
//                     insta_page_username: instagram_account_id,
//                     media_type: doIt.media_type,
//                     media_product_type: doIt.media_product_type,
//                     likes: doIt.like_count,
//                     caption: doIt.caption,
//                     comments_count: doIt.comments_count,
//                     media_url: doIt.media_url,
//                     thumbnail_url: doIt.thumbnail_url,
//                     permaLink: doIt.permalink,
//                     timeStamp: doIt.timestamp,
//                     comments: doIt.comments.data,
//                     reach: imageResponse.data.data[0].values[0].value,
//                     impressions: imageResponse.data.data[1].values[0].value,
//                     engagement: imageResponse.data.data[2].values[0].value,
//                   },
//                 },
//                 { upsert: true, new: true }
//               )
    
//                 .then((document) => {
//                   // console.log('Document:', document);
//                 })
//                 .catch((error) => {
//                   console.error("Error updating/creating document:", error);
//                 });

//             }
//             catch{
//               PostMetrics.findOneAndUpdate(
//                 { media_id: doIt.id },
//                 {
//                   $set: {
//                     media_id: doIt.id,
//                     influencer_id: user_id,
//                     insta_page_username: instagram_account_id,
//                     media_type: doIt.media_type,
//                     media_product_type: doIt.media_product_type,
//                     likes: doIt.like_count,
//                     caption: doIt.caption,
//                     comments_count: doIt.comments_count,
//                     media_url: doIt.media_url,
//                     thumbnail_url: doIt.thumbnail_url,
//                     permaLink: doIt.permalink,
//                     timeStamp: doIt.timestamp,
//                     comments: doIt.comments.data,
//                     beforeBusinessAccount: true,
//                     reach: 0,
//                     impressions: 0,
//                     engagement: 0,
//                   },
//                 },
//                 { upsert: true, new: true }
//               )
    
//                 .then((document) => {
//                   // console.log('Document:', document);
//                 })
//                 .catch((error) => {
//                   console.error("Error updating/creating document:", error);
//                 });

//             }
//           }

//           else {
//             try{
//               PostMetrics.findOneAndUpdate(
//                 { media_id: doIt.id },
//                 {
//                   $set: {
//                     media_id: doIt.id,
//                     influencer_id: user_id,
//                     insta_page_username: instagram_account_id,
//                     media_type: doIt.media_type,
//                     media_product_type: doIt.media_product_type,
//                     likes: doIt.like_count,
//                     caption: doIt.caption,
//                     comments_count: doIt.comments_count,
//                     media_url: doIt.media_url,
//                     thumbnail_url: doIt.thumbnail_url,
//                     permaLink: doIt.permalink,
//                     timeStamp: doIt.timestamp,
//                     comments: doIt.comments.data,
//                   },
//                 },
//                 { upsert: true, new: true }
//               )
    
//                 .then((document) => {
//                   // console.log('Document:', document);
//                 })
//                 .catch((error) => {
//                   console.error("Error updating/creating document:", error);
//                 });

//             }
//             catch{

//             }
//           }
         
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching media data:", error);
//       });
//   });

//   CreatorInstagram.findOne({ influencer_id: user_id })
//     .then((resDocument) => {
//       if (!resDocument) {
//         throw new Error("Document not found"); // Handle if the document is not found
//       }

//       res.status(200).send({ data: resDocument });
//       res.end();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

// router.post("/creator-audience-countries", async function (req, res) {
//   let user_id = req.body.userId;
//   let country_data = [];

//   setTimeout(() => {
//     InstaPageMetrics.findOne({ influencer_id: user_id })
//       .then((result) => {
//         countries = result.audience_country;
//         for (i = 0; i < 6; i++) {
//           country_data.push({
//             country: countries[i].country,
//             Followers: countries[i].followers_count,
//           });
//         }

//         res.status(200).send({ countries: country_data });
//         res.end();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, 3000);
// });

// router.post("/creator-audience-cities", async function (req, res) {
//   let user_id = req.body.userId;
//   let city_data = [];

//   setTimeout(() => {
//     InstaPageMetrics.findOne({ influencer_id: user_id })
//       .then((result) => {
//         cities = result.audience_cities;
//         for (i = 0; i < 6; i++) {
//           city_data.push({
//             city: cities[i].city,
//             Followers: cities[i].followers_count,
//           });
//         }

//         // console.log('Dataaa:::', city_data);

//         res.status(200).send({ cities: city_data });
//         res.end();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, 2000);
// });

// router.post("/creator-followers", async function (req, res) {
//   let user_id = req.body.userId;
//   console.log('user_id:::', user_id);
//   let followers_count = 0;

//   setTimeout(()=>{
//     CreatorInstagram.findOne({ influencer_id: user_id })
//     .then((result) => {
//       // console.log('Result:::::', result);
//       // console.log('Count::::', result.followers_count);
//       followers_count = result.followers_count;
//       res.status(200).send({ followers: followers_count });
//       res.end();
//     })
//     .catch((err) => {
//       console.log(err);
//     });


//   }, 1000);

 

//   // getUserData(instagram_account_id, user_id, fields, access_token);
// });

// router.post("/creator-impressions-28days", async function (req, res) {
//   let user_id = req.body.userId;
//   // console.log('user_id:::', user_id);
//   let followers_count = 0;

//   setTimeout(()=>{
//     CreatorInstagram.findOne({ influencer_id: user_id })
//     .then((result) => {
//       // console.log('Result:::::', result);
//       // console.log('Count::::', result.followers_count);
//       impressions_28days = result.impressions_last_28days;
//       reach_28days = result.reach_last_28days;
//       res.status(200).send({ impressions: impressions_28days, reach: reach_28days });
//       res.end();
//     })
//     .catch((err) => {
//       console.log(err);
//     });


//   }, 1000);

 

//   // getUserData(instagram_account_id, user_id, fields, access_token);
// });

// router.post("/creator-reach-28days", async function (req, res) {
//   let user_id = req.body.userId;
//   // console.log('user_id:::', user_id);
//   let followers_count = 0;

//   setTimeout(()=>{
//     CreatorInstagram.findOne({ influencer_id: user_id })
//     .then((result) => {
//       // console.log('Result:::::', result);
//       // console.log('Count::::', result.followers_count);
//       reach_28days = result.reach_last_28days;
//       res.status(200).send({ reach: reach_28days });
//       res.end();
//     })
//     .catch((err) => {
//       console.log(err);
//     });


//   }, 1000);

 

//   // getUserData(instagram_account_id, user_id, fields, access_token);
// });

// router.post("/creator-posts", async function (req, res) {
//   let user_id = req.body.userId;
//   // console.log('user_id:::', user_id);
//   let media_count = 0;

//   CreatorInstagram.findOne({ influencer_id: user_id })
//     .then((result) => {
//       media_count = result.media_count;
//       res.status(200).send({ media: media_count });
//       res.end();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// router.post("/creator-audience-gender", async function (req, res) {
//   let user_id = req.body.userId;
//   let gender_data = [];

//   setTimeout(() => {
//     InstaPageMetrics.findOne({ influencer_id: user_id })
//       .then((result) => {
//         gender_data = [
//           {
//             type: "Male",
//             value: result.male_percentage,
//           },

//           {
//             type: "Female",
//             value: result.female_percentage,
//           },
//         ];

//         // console.log('Gendersss:::', gender_data);

//         res.status(200).send({ gender_percentage: gender_data });
//         res.end();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, 2000);
// });

// router.post("/creator-age-wise-followers", async function (req, res) {
//   let user_id = req.body.userId;
//   let gender_wise = [];

//   setTimeout(() => {
//     InstaPageMetrics.findOne({ influencer_id: user_id })
//       .then((result) => {
//         // console.log("Resultss:::", result.age_wise_followers);

//         for (i = 0; i < result.age_wise_followers.length; i++) {
//           gender_wise.push({
//             type: "Age: " + Object.keys(result.age_wise_followers[i])[0],
//             value: Object.values(result.age_wise_followers[i])[0],
//           });
//         }

//         // console.log("Gendersss:::", gender_wise);

//         res.status(200).send({ genderWise: gender_wise });
//         res.end();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, 2000);
// });

// router.post("/creator-dashboard-posts", async function (req, res) {
//   let user_id = req.body.userId;
//   let recent_posts = [];

//   // {media-id}?fields=like_count,comments_count => for album,reels,photo,video?


//   // setTimeout(() => {

//     PostMetrics.find({ influencer_id: user_id })
//       .then((result) => {
//         // console.log("Resultss:::", result);
//         result.map((dataIteration)=>{
//           recent_posts.push({

//             'media_url': dataIteration.media_url,
//             'thumbnail_url': dataIteration.thumbnail_url,
//             'caption': dataIteration.caption,
//             'date': dataIteration.timeStamp,
//             'likes': dataIteration.likes,
//             'reach': dataIteration.reach,
//             'comments': dataIteration.comments_count,
//             'media_type': dataIteration.media_type,
//             'permaLink': dataIteration.permaLink,

//           })


//         })

//       // console.log('Posts::::', recent_posts);
      
//         res.status(200).send({ postsArray: recent_posts });
//         res.end();


//         // for (i = 0; i < result.age_wise_followers.length; i++) {
//         //   gender_wise.push({
//         //     type: "Age: " + Object.keys(result.age_wise_followers[i])[0],
//         //     value: Object.values(result.age_wise_followers[i])[0],
//         //   });
//         // }

//         // console.log("Gendersss:::", gender_wise);

//         // res.status(200).send({ genderWise: gender_wise });
//         // res.end();
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//   // }, 2000);

// });



// router.post('/get-campaigns', async (req, res) => {
//   try {
//     const userId = req.body.userId;

//     const categoryMapping = {

//       'Actor': ['Art and Design', 'Banking and Finance', 'Beauty and Cosmetics', 'Education and E-learning', 'Entertainment and Media', 
//                 'Fashion', 'Fitness & Gym', 'Gaming', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
//                 'Outdoor and Adventure', 'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism'],
//       'Artist': ['Art and Design', 'Banking and Finance', 'Beauty and Cosmetics', 'Education and E-learning', 'Entertainment and Media', 
//                 'Fashion', 'Fitness and Gym', 'Gaming', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
//                 'Outdoor and Adventure', 'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism', 'Groceries'],
//       'Automotive': ['Automotive'],
//       'Blogger or Vlogger': ['Art and Design', 'Banking and Finance', 'Entertainment and Media', 'Fashion', 'Home and Decor', 'Lifestyle',
//                 'Outdoor and Adventure', 'Groceries'],
//       'Beauty and Cosmetics': ['Beauty and Cosmetics', 'Home and Decor', 'Lifestyle'],
//       'Banking or Finance': ['Banking and Finance'],
//       'Digital Creator': ['Art and Design', 'Banking and Finance', 'Beauty and Cosmetics', 'Education and E-learning', 'Entertainment and Media', 
//                 'Fashion', 'Fitness and Gym', 'Gaming', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
//                 'Outdoor and Adventure', 'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism'],  
//       'Education and E-learning': ['Education and E-learning'],
//       'Fashion Model': ['Beauty and Cosmetics', 'Entertainment and Media', 'Fashion', 'Fitness and Gym', 'Health and Wellness', 'Home and Decor', 'Lifestyle',
//                 'Pets and Animals', 'Technology and Electronics', 'Travel and Tourism'],
//       'Fitness and Gym': ['Fitness and Gym', 'Health and Wellness', 'Outdoor and Adventure', 'Travel and Tourism'],
//       'Gaming': ['Gaming', 'Outdoor and Adventure', 'Travel and Tourism'],
//       'Home and Decor': ['Home and Decor', 'Kitchen and Cooking', 'Travel and Tourism'],
//       'Kitchen and Cooking': ['Kitchen and Cooking', 'Health and Wellness'],
//       'Travel': ['Automotive', 'Technology and Electronics', 'Travel and Tourism']
  
//       };

//     const userDetails = await Influencer.findById(userId);

//     if (!userDetails) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     console.log('Creator Category:', userDetails.category);

//     const campaignIdsWithInterest = await CampaignRequests.find({
//       creator_id: userId,
//     }).distinct('campaign_id');

//     const campaigns = await Campaign.find({
//       _id: { $nin: campaignIdsWithInterest }, // Exclude campaigns with interest
//       brand_category: { $in: categoryMapping[userDetails.category] },
//     });

//     res.status(200).send({ data: campaigns });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send({ message: 'Internal Server Error' });
//   }
// });


// router.post('/get-campaign-details', async function (req, res){

//   const user_id = req.body.userId;
//   const campaignId = req.body.campaignId;

//   // console.log('CampaignId', campaignId);

//   Campaign.findById(campaignId).then((result)=>{

//     Influencer.findById(user_id).then((res_price)=>{

//     // console.log('Result:', result);
//     res.status(200).send({ data: result, price:res_price.costPerPost });
//     res.end();

//     }).catch(e1=>{
//     console.log('error:::', e1);

// });
//   }).catch(e2=>{

//     console.log('Error2', e2);

//   })
// });

// router.post('/campaign/check-shown-interest', async function (req, res){

//   const user_id = req.body.userId;
//   const campaignId = req.body.campaignId;



//   CampaignRequests.findOne({$and: [
//     { campaign_id: campaignId },
//     { creator_id: user_id }
//   ]}).then((result)=>{

//     if(result){

//       res.status(200).send({ isAvailable: true });
//       res.end();

//     }
//     // console.log("Already User Available:", isUserAdded);



//     else 
//     {
//       res.status(200).send({ isAvailable: false });
//       res.end();
//     }
   

//   }).catch((e)=>{

//     console.log('Error:',e );


//   });

// });


// router.post('/campaign/show-interest', async function (req, res){

//   const user_id = req.body.userId;
//   const campaignId = req.body.campaignId;
//   const price = req.body.price;

//   console.log('influencer_id:', user_id);
//   console.log('campaign_id:', campaignId);

//   CampaignRequests.findOne({$and: [
//     { campaign_id: campaignId },
//     { creator_id: user_id }
//   ]}).then((result)=>{

//     if(result){
//       console.log('Entered If');
//     res.status(200).send({ isAdded: false });
//     res.end();

//     }

//     else 
//     {

//       CampaignRequests.create({
//                 campaign_id: campaignId,
//                 creator_id: user_id,
//                 quoted_price: price,
//               });

//       res.status(200).send({ isAdded: true });
//     res.end();
//     }
   

//   }).catch((e)=>{

//     console.log('Error:',e );


//   });

// });

// router.post('/campaign/dont-show-interest', async function (req, res){

//   const user_id = req.body.userId;
//   const campaignId = req.body.campaignId;
//   const price = req.body.price;

//   console.log('influencer_id:', user_id);
//   console.log('campaign_id:', campaignId);

//   CampaignRequests.findOne({$and: [
//     { campaign_id: campaignId },
//     { creator_id: user_id }
//   ]}).then(async (result)=>{

//     if(result){
//       console.log('Entered If');
//       await CampaignRequests.deleteOne({ $and: [{ campaign_id: campaignId }, { creator_id: user_id }] });

//     res.status(200).send({ isDeleted: true });
//     res.end();

//     }

//     else 
//     {

//       res.status(200).send({ isDeleted: false });
//     res.end();
//     }
   

//   }).catch((e)=>{

//     console.log('Error:',e );


//   });

// });

// router.post('/interested/campaigns', async function (req, res){

//   const user_id = req.body.userId;

// CampaignRequests.find({creator_id : user_id}).then(async (result) => {

//   console.log('Resulttttttt', result);


//   if(result){
    
//     const campaignData = await Promise.all(
//       result.map(async (campData) => {
  
  
//         const result2 = await Campaign.findById(campData.campaign_id);
    
//         return result2
   
  
//       })
//     );

//     console.log('CampaignData::', campaignData);

//     res.status(200).send({campaigns: campaignData});
//     res.end();
//   }

//   else {
//     res.status(200).send({campaigns: null});
//     res.end();
//   }

// }).catch((error) =>{

// })


// })

// router.post('/approved/campaigns', async function (req, res){

//   const user_id = req.body.userId;

// CampaignApprovedRequests.find({creator_id : user_id}).then(async (result) => {

//   console.log('Resulttttttt', result);


//   if(result){
    
//     const campaignData = await Promise.all(
//       result.map(async (campData) => {
  
  
//         const result2 = await Campaign.findById(campData.campaign_id);
    
//         return result2
   
  
//       })
//     );

//     console.log('CampaignData::', campaignData);

//     res.status(200).send({campaigns: campaignData});
//     res.end();
//   }

//   else {
//     res.status(200).send({campaigns: null});
//     res.end();
//   }

// }).catch((error) =>{

// })


// })


// // router.post('/approved/campaigns', async function (req, res){
// //   const user_id = req.body.userId;

// // Campaign.aggregate([ { $match: { approved_interests: user_id }} ])
// //   .then((result) => {
// //     if (result.length > 0) {
// //       res.status(200).send({ data: result });
// //       res.end();
// //     } else {
// //       console.log(`User with ID ${user_id} is not present in any campaign's accepted_interests array.`);
// //     }
// //   })
// //   .catch((error) => {
// //     console.error('Error:', error);
// //   });


// // })




// router.post('/campaign/publishNow', async function(req, res){

//   const user_id = req.body.influencer_id;
//   const campaignId = req.body.campaign_id;
//   const mediaId = req.body.media_id;
//   const brandUser_id = req.body.brandUser_id;

//   console.log('Entered Schedule');
//   console.log('user_id:::', user_id);
//   console.log('campaignId:::', campaignId);
//   console.log('mediaId:::', mediaId);
//   console.log('brand_id:::', brandUser_id);

//   const costPerPost = await Influencer.findById(user_id);

//     const jobData = {
//       campaignId: campaignId,
//       user_id: user_id,
//       mediaId: mediaId ,
//       brandUser_id: brandUser_id,
//       costPerPost: costPerPost.costPerPost,
//     };
  
//     const scheduledDate = new Date('2023-09-23T19:54:00');
//     await agenda.schedule(scheduledDate, 'publish campaign', jobData);

//     res.status(200).send({ status: 'posted' });
//           res.end();
  
// })

// router.post('/scheduled/scheduled-campaigns', async function (req, res){

//   const user_id = req.body.userId;
//   const jobs = await agenda.jobs({'data.user_id': user_id, 'nextRunAt': { $ne: null } });

//   const jobsData = await Promise.all(
//     jobs.map(async (dataReach) => {

//       if(dataReach.attrs.nextRunAt !== null)
//       {

//       const result2 = await Campaign.findById(dataReach.attrs.data.campaignId);
  
//       return result2
//       }

//     })
//   );

//   res.status(200).send({ scheduledJobs: jobsData });
//   res.end();

// });

// router.post('/campaigns/published-campaigns', async function (req, res){

//   const user_id = req.body.userId;
//   const publishedPosts = await PublishedPosts.find({'influencer_id': user_id});
  
//   const postsData = await Promise.all(
//     publishedPosts.map(async (dataReach) => {
//       const result2 = await Campaign.findById(dataReach.campaign_id);
//       return result2

//     })
//   );

//   res.status(200).send({ publishedPosts: postsData });
//   res.end();

// });


// // router.post('/campaign/publishNow', async function (req, res){

// //   const user_id = req.body.influencer_id;
// //   const campaignId = req.body.campaign_id;
// //   const mediaId = req.body.media_id;
// //   const brandUser_id = req.body.brandUser_id;

// //   PublishedPosts.findOne({'campaign_id': campaignId, 'influencer_id': user_id}).then((result)=>{

// //     // console.log("Already User Available:", isUserAdded);

// //     if(result){
// //       console.log('ALready Posted');

// //     }

// //     else 
// //     {
// //       console.log('Entered else');
// //       PublishedPosts.create({
// //         campaign_id: campaignId,
// //         influencer_id: user_id,
// //         media_id: mediaId,
// //         brandUser_id: brandUser_id,
// //       });

// //       res.status(200).send({ status: 'posted' });
// //       res.end();
// //     }
   

// //   }).catch((e)=>{

// //     console.log('Error:',e );


// //   });

// // });









// module.exports = router;
