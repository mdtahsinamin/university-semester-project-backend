const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new Schema({
     name : {
         type : String,
         required : [true,  'Please enter your name'],
         minlength: [3, 'Must be at least 3']
     },
     username : {
       type : String,
       default: uuidv4()
     },
     email: {
         type : String,
         required : [true, 'Please enter your email'],
         unique : [true, 'User already exists'],
         lowercase : true,
         validate:{
            validator : function(value) {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
            },
            message: 'Please enter a valid email address'
         }
     },
     picture:{
          public_id :{
            type: String,
            required: true
          },
          url:{
            type: String,
            required: true
          }
     },
     password: {
        type : String,
        required : [true, 'Please enter your password'],
        minLength: [8, 'Must be at least 8'],
        select: false
     },
     role:{
      type: String,
      default: "user"
     },
     address: {
       type: String,
       default: "Dhaka"
     },
     isEmailVerify:{
        type: Boolean,
        default: false
     },
     createdAt: {
      type: Date,
      default: Date.now,
    },
     verifyToken:String,
     verifyTokenExpires: Date,
     resetPasswordToken : String,
     resetPasswordExpires : Date,
     
},{versionKey : false});

// *  password hash

userSchema.pre('save', async function (next){
   if(!this.isModified("password")){
      next();
   }
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(this.password, salt);
   this.password = hashPassword;
})

// * jwt token

userSchema.methods.getJWTToken = function(){

   return jwt.sign({ 
      id: this._id, 
      name : this.name,
      email: this.email, 
      username: this.username, 
      picture: this.picture.url,
      isEmailVerify: this.isEmailVerify
    }, process.env.JWT_TOKEN_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRE,
    });
}

// *compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password)
}

// * Generating Password Reset Token

userSchema.methods.getResetPasswordToken =  function( ){
   // rest token
   const resetToken = crypto.randomBytes(20).toString("hex");
   
   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')
   this.resetPasswordExpires = Date.now() + 15 * 60 *1000;

   return resetToken;
}
userSchema.methods.getVerifyToken = function( ){
   const emailVerifyToken = crypto.randomBytes(20).toString("hex");
   this.verifyToken = crypto.createHash("sha256").update(emailVerifyToken).digest('hex')
   this.verifyTokenExpires = Date.now() + 15 * 60 *1000;

   return emailVerifyToken;
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
