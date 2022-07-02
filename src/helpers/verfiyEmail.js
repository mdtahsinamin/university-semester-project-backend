const sendMail = require("./sendMail");
const ErrorHandler = require("../utils/errorHandler");
const verifyEmail = async (user,req, res, next) =>{
    const verifyToken = user.getVerifyToken();
    await user.save();
    const emailVerifyUrl = `${process.env.FRONTEND_URL}/api/v1/auth/email/verify/${verifyToken}`;

    const message = 
      `
      Hello ${user.name}
      You registered an account on [customer portal], before being able to use your account you need to verify that this is your email address by clicking here: ${emailVerifyUrl}
      
      Kind Regards, E-SHOP;
      `
      try {
         await sendMail({
            email : user.email,
            subject: 'E-Shop Email Verification',
            message
         })

         res.status(200).json({
            success: true,
            message:`Email sent to ${user.email} successfully`
         })
         
      } catch (error) {
         user.verifyToken = undefined;
         user.verifyTokenExpires = undefined;
         await user.save({ validateBeforeSave: false });
         return next(new ErrorHandler(error.message, 500));
      }
}

module.exports = verifyEmail; 