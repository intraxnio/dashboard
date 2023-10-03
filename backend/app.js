// // const express = require('express');
// // const ErrorHandler = require('./middleware/error');
// // const app = express();
// // const cookieParser = require("cookie-parser");
// // const bodyParser = require("body-parser");
// // const path = require("path");
// // const cors = require('cors');
// // var jwt = require("jsonwebtoken");



// app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true, limit:"50mb"}));
// app.use(cookieParser());


// //config

// if(process.env.NODE_ENV !=="PRODUCTION"){
//     require("dotenv").config({
//         path:"backend/config/.env"
//     })
// }

// // "proxy": "http://localhost:8000",

// const corsOptions ={
//     origin:'https://localhost:4700', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

// const brand = require("./routes/brandUser");
// app.use("/api/v1/brand", brand);

// const auth = require("./routes/fb_auth");
// app.use("/api/v1", auth);





  


// //Error Handling
// app.use(ErrorHandler);



// module.exports = app;