// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const Influencer = require("../models/Influencer");
// const Brand = require("../models/Brand");
// var jwt = require("jsonwebtoken");
// var jwtSecret = "P@sswordIsDangerous#";
// const { body, validationResult } = require("express-validator");
// const ErrorHandler = require("../utils/ErrorHandler");
// const sendMail = require("../utils/sendMail");
// const axios = require("axios");
// // const sendToken = require("../utils/jwtToken");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// // const { isAuthenticated } = require("../middleware/auth");
// var app = express();

// var fbAppID = "952166639324517";
// var fb_redirecturl = "https://localhost:4700/insta_redirect_url";
// var fb_secret = "bf0f2b54cf445c4acb52f93f4bc7e8e4";



// router.post("/insta_redirect_url", async function (req, res) {
//   console.log("ENTEREDDDDDDDDDDDDDD");
//   let code = req.body.access_code;
//   let redirectUri = req.body.redirectUri;

//   let accessToken = null; 
//   let longLivedToken = null;
//   var reqData =
//     'grant_type=authorization_code&code=' + code +
//     '&client_id=' + fbAppID + 
//     '&client_secret=' + fb_secret +
//     '&redirect_uri=' + fb_redirecturl;

//   axios({
//     method: "post",
//     url: "https://api.instagram.com/oauth/access_token",
//     data: reqData,

//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   })
//     .then(async (response) => {
//      accessToken = response.data.access_token;

//      try {

//       let resp = await axios.get('https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret='+fb_secret+'&access_token='+accessToken)
//       longLivedToken = resp.data.access_token;
//       console.log(longLivedToken)
      

//       // save accessToken  to Database
//     } catch (e) {
//       console.log("Error=====", e.data);
//     }

    
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

// module.exports = router;
