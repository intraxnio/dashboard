const ErrorHandler = require("../utils/ErrorHandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Error: Wrong MongoDB ID
  if (err.name === "CastError") {
    const message = `Resources not found with this Id... Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Error: Duplicate Key
  if (err.code === "11000") {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Error: Wrong JWT
  if (err.name === "JsonWebTokenError") {
    const message = `Your Url is Invalid, please try again later`;
    err = new ErrorHandler(message, 400);

    //Error: JWT Expired
    if (err.name === "TokenExpiredError") {
      const message = `Your Url is expired please try again later`;
      err = new ErrorHandler(message, 400);

      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
  }
};
