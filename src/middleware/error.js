const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res , next) => {
    let {message ='Internal Server Error', statusCode = 500} = err;
   // console.log(err.message);
    
   // wrong mongodb id error

   if(err.name == "CastError"){
       message = `Resource not found: Invalid ${err.path}`;

       err = new ErrorHandler(message, 400);
   }
   //console.log(err.name);

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