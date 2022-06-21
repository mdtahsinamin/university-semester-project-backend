const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require('bcrypt');
const sentToken = require('../helpers/jwt_token');
const ObjectId = require('mongodb').ObjectId;

const isValidPassword = async (candidatePassword, password) =>{
   try {
      return await bcrypt.compare(candidatePassword, password)
   } catch (error) {
      console.log(error);
   }
}

exports.userRegistration = catchAsyncErrors(async (req , res) =>{
 
    const {name, email, password} = req.body;

    const user = await userModel.create({
       name,
       email,
       password,
       picture:{
         public_id :'It is public_id',
         url:'https://somting.com'
      }
    });

    sentToken(user,200,res);
})

exports.login = catchAsyncErrors(async (req , res) =>{
   const {email , password} = req.body;
   // check email or password available or what
   if(!email || !password){
      return next(new ErrorHandler('Please enter email or password', 400));
   }

   // match email and password

   const user = await userModel.findOne({email}).select('+password')
   

   if(!user){
      return next(new ErrorHandler('Invalid email or password', 401));
   }
   
   const isConfirm =  user.comparePassword(password);

   if(!isConfirm){
         return next(new ErrorHandler('Invalid email or password', 401));
   }

   sentToken(user,200,res);
})
