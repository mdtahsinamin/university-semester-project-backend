const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
const sentToken = require("../helpers/jwt_token");
const ObjectId = require("mongodb").ObjectId;
const sendMail = require("../helpers/sendMail");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const verifyEmail = require("../helpers/verfiyEmail");

exports.userRegistration = catchAsyncErrors(async (req, res, next) => {
  const file = req.files.picture;

  const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "User-Profile",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    picture: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  verifyEmail(user,req,res,next);
  sentToken(user, 200, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // check email or password available or what
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email or password", 400));
  }

  // match email and password

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isConfirm = await user.comparePassword(password);

  console.log(isConfirm);

  if (!isConfirm) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sentToken(user, 200, res);
});

// * logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
});

// * forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // get resetToken
  const resetToken = user.getResetPasswordToken();

  // save
  await user.save();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // ${req.protocol}://${req.get('host')}

  const message = `
         It seems like you forgot your password for ${user.email}. If this is true, click the link below to reset your password.

         Reset my password ${resetPasswordUrl}
         
         If you did not forget your password, please disregard this email.
         
      `;
  try {
    await sendMail({
      email: user.email,
      subject: "E-Shop Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//* Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  sentToken(user, 200, res);
});

// * Get user details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// * Update Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  const isPasswordConfirmed = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordConfirmed) {
    return next(new ErrorHandler("Old Password is not correct", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sentToken(user, 200, res);
});

// * User Other profile details updated

exports.userProfileUpdate = catchAsyncErrors(async (req, res, next) => {
  const file = req.files.picture;

  const updatedInfo = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.files.picture !== "") {
    const user = await userModel.findById(req.user.id);
    const imagesId = user.picture.public_id;
    await cloudinary.uploader.destroy(imagesId);

    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "User-Profile",
    });
    updatedInfo.picture = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await userModel.findByIdAndUpdate(req.user.id, updatedInfo, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// * Get all user -- Admin

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// * Get single user -- Admin
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// * Update role -- Admin

exports.updateRoles = catchAsyncErrors(async (req, res, next) => {
  const updatedInfo = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userModel.findByIdAndUpdate(req.params.id, updatedInfo, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// * Delete user -- admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id ${req.params.id}`, 404)
    );
  }

  const imageId = user.picture.public_id;

  await cloudinary.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

exports.emailVerify = catchAsyncErrors(async (req, res, next) => {
  const verifyToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    verifyToken,
    verifyTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or has been expired", 400));
  }

  user.isEmailVerify = true;
  user.verifyToken = undefined;
  user.verifyTokenExpires = undefined;

  await user.save();
  sentToken(user, 200, res);
});

exports.Stats = catchAsyncErrors(async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await userModel.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
