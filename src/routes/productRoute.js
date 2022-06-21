const express = require('express');
const productController = require("../controllers/productController");
const router = express.Router();
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage});

//router.post('/new-product', upload.single('img'),productController.createProduct);

router.post('/new-product',productController.createProduct);
router.get('/get-product', productController.getAllProduct);

router.put('/:id',productController.updateProduct);
router.delete('/:id',productController.deleteProduct);
router.get('/:id',productController.getSingleProduct);


module.exports = router;