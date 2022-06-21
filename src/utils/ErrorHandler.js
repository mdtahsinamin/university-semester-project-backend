/*
define the error handler class and inherit Error class errorHandler send two thing message and statusCode

custom error handler

*/
class ErrorHandler extends Error{
    constructor(message , statusCode){
        super(message);
        //this.message = message;
        this.statusCode  = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;