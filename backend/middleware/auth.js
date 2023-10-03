const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const {sign, verify} = require("jsonwebtoken");
const Brand = require('../models/Brand');


// exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
//     const {token} = req.cookies;

//     if(!token){
//         return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = await Brand.findById(decoded.id);

//     next();
// });

const isAuthenticated = (req, res, next) =>{

    const {token} = req.cookies;
    if(!token){
        return res.status(400).json({error: "User is not Authenticated!"});
    }
    try{
        const validToken = verify(token, )

    } catch(err){

    }
}