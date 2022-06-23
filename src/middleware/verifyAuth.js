
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next)=>{
   const {token} = req.cookies

   if(!token){
     return next(new ErrorHandler('Please login to access the resource.',401));
   }
  
   const decodedData = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

   req.user = await userModel.findById(decodedData.id);
   next();
  
});

exports.verifyAdmin = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Role : ${req.user.role} is not allow to access the resource`,403))
        }
        next();
    }
}

/* 
  firebase admin 
  admin.auth().verifyIdToken(idToken).then((decodedToken)

*/