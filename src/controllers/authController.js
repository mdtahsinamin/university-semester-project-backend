const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

const isValidPassword = async (candidatePassword, password) =>{
   try {
      return await bcrypt.compare(candidatePassword, password,(err, result)=>{
         console.log(result);
      })
   } catch (error) {
      console.log(err);
   }
}

exports.userRegistration = async (req , res) =>{
    const reqBody = req.body;

    userModel.create(reqBody , (err , data) =>{
       if(err){
          res.status(404).json({
            status: 'error',
            error: err
          })
       }
       else{
         
          res.status(201).json({
            status: 'success',
            isInsert: true,
            data: data
          })
       }
    })

}

exports.login = async (req , res) =>{
   const {email , password} = req.body;
   // check email or password available or what
   if(!email || !password){
       res.status(400).json({
         status : 'error',
         message: 'Provide your email address or password'
       })
   }

   // match email and password

   const user = await userModel.find({ email: email}).select('+password')
   

   if(user.length === 0){
      res.status(404).json({
         status : 'unauthorized',
         message: 'Unauthorized access'
      })
   }

   else{
      const isConfirm =  isValidPassword(password , user.password);

      if(!isConfirm){
         res.status(401).json({
            status : 'error',
            message: 'Password does not match please try again'
         })
      }


      else {
         let Payload={
            exp: Math.floor(Date.now() / 1000) + (24*60*60),
            name: user[0]?.name,
            email : user[0]?.email,
            id : ObjectId(user[0]?._id),
            picture: user[0]?.picture
         }
         
         const accessToken =  jwt.sign( Payload, process.env.JWT_TOKEN_SECRET );
         
         res.status(200).json({
            status : 'success',
            accessToken
         })
      }
      
   }
}
