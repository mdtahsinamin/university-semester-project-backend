const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res , next) => {
    let {message ='Internal Server Error', statusCode = 500} = err;
   // console.log(err.message);
    
   // wrong mongodb id error

   if(err.name == "CastError"){
       message = `Resource not found: Invalid ${err.path}`;

       err = new ErrorHandler(message, 400);
   }

   // duplicate mongodb id error

    if(err.code === 11000){
        message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT Token error

    if (err.name === "JsonWebTokenError") {
         message = `Json Web Token is invalid, Try again `;
        err = new ErrorHandler(message, 400);
    }

     // JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
        message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 400);
    }

    res.status(statusCode).json({
        success: false,
        message: message
    });
}

/*
   !errors
  -> custom error handler
  -> mongodb error handler
  -> unhandledRejection error handler
  -> uncaughtException

*/