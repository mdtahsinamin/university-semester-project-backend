const express = require('express');
const authController = require("../controllers/authController");
const { isAuthenticatedUser,verifyAdmin } = require('../middleware/verifyAuth');
const router = express.Router();


router.post('/user-register', authController.userRegistration );
router.post('/user-login', authController.login);

router.post('/password/forgot', authController.forgotPassword);
router.put('/password/reset/:token', authController.resetPassword);

router.get('/user-profile', isAuthenticatedUser,authController.getUserDetails);
router.put('/update-password', isAuthenticatedUser,authController.updatePassword);

router.put('/update-profile', isAuthenticatedUser, authController.userProfileUpdate);


router.get('/admin/get-users', isAuthenticatedUser, verifyAdmin("admin"),authController.getAllUser)

router.get('/admin/user/:id', isAuthenticatedUser, verifyAdmin("admin"),authController.singleUser)

router.put('/admin/role/:id', isAuthenticatedUser, verifyAdmin("admin"),authController.updateRoles);

router.delete('/admin/user/:id', isAuthenticatedUser, verifyAdmin("admin"),authController.deleteUser)



router.get('/user-logout',authController.logout);

module.exports = router;
