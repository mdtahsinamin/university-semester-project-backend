const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
     name : {
        type : String,
         require : [true,  'Please enter your name'],
         minlength: [3, 'Must be at least 3']
     },
     email: {
         type : String,
         require : [true, 'Please enter your email'],
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
        type : String,
        default:"picture not uploaded"
     },
     password: {
        type : String,
        require : [true, 'Please enter your password'],
        minLength: [8, 'Must be at least 8'],
        select: false
     },
     
},{versionKey : false});

userSchema.pre('save', async function (next){
       try {
          if(this.isNew){
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(this.password, salt);
            this.password = hashPassword;
          }
       } catch (error) {
        
       }
})
/*
userSchema.methods.isValidPassword = async function (candidatePassword, userPassword) {
   try {
      return await bcrypt.compare(candidatePassword, userPassword)
   } catch (error) {
      console.log(error);
   }
}
*/

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;