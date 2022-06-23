const express = require('express');
const productController = require("../controllers/productController");
const router = express.Router();
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage});
const {isAuthenticatedUser, verifyAdmin} = require('../middleware/verifyAuth');


//router.post('/new-product', upload.single('img'),productController.createProduct);

router.post('/admin/new-product',isAuthenticatedUser, verifyAdmin("admin"),productController.createProduct);  // image upload

router.get('/get-product',productController.getAllProduct);

router.put('/admin/:id',isAuthenticatedUser, verifyAdmin("admin"),productController.updateProduct);

router.delete('/admin/:id',isAuthenticatedUser, verifyAdmin("admin"),productController.deleteProduct);

router.post('/review',isAuthenticatedUser, productController.productReviews);

router.get('/reviews',productController.getProductReviews)
router.delete('/reviews',isAuthenticatedUser, productController.deleteProductReview);


router.get('/:id',productController.getSingleProduct);

module.exports = router;