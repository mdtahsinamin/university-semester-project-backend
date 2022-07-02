const ProductModel = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require('cloudinary').v2

// create product  -- Admin
exports.createProduct = catchAsyncErrors(async(req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
    req.body.user = req.user._id;
    const newProduct = new ProductModel(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({
        success: true,
        savedProduct
    });
 })

// read -> get all product

exports.getAllProduct = catchAsyncErrors(async(req, res, next) => {
     
     const resultPerPage = 8;
     const productCount = await ProductModel.countDocuments();
     const apiFeatures = new ApiFeatures(ProductModel.find(), req.query).search().filter().pagination(resultPerPage).sort();

     const allProduct =  await apiFeatures.query;

     res.status(200).json({
        success: true,
        product: allProduct,
        productCount,
     })
})

// * Get Admin Product list
exports.getAllProducts = catchAsyncErrors(async(req, res, next) => {
    const products = await ProductModel.find();
    res.status(200).json({
       success: true,
       products
    })
})




// get single product

exports.getSingleProduct = catchAsyncErrors(async(req, res , next) => {
    
    let singleProduct =  await ProductModel.findById(req.params.id);
    if(!singleProduct){
       return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        singleProduct,
        ratings:singleProduct.ratings
    });

})


// *  updated product -- admin

//* findByIdAndUpdate
exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await ProductModel.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }
    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

   if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await ProductModel.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators : true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,  
        product
    })

})

// delete product -- Admin

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }

       for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
       }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    })
})

//* create Review or update reviews

exports.productReviews = catchAsyncErrors(async (req, res, next)=>{
    const {rating, comment, productId} = req.body;

    const reviews ={
        user: req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    }

    const product = await ProductModel.findById(productId);
    
    if(!product){
        return next(new ErrorHandler('Product not found', 404));
     }


    const isReviewed = product.reviews.find(review =>
         review.user.toString() === req.user._id.toString()
         )

    if(isReviewed){
       product.reviews.forEach(review =>{
          if( review.user.toString() === req.user._id.toString() ){
            review.rating = rating;
            review.comment = comment
          }
       })
    }
    else{
        product.reviews.push(reviews);
        product.numOfReviews = product.reviews.length
    }
    
    let avg = 0;
    product.reviews.forEach(review => {
            avg+=review.rating;
    })
    product.ratings = avg/product.reviews.length;
   

    await product.save({ validateBeforeSave: false});

    res.status(200).json({
        success: true,

    })
})

// * get all reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    // ! product id 
     const product = await ProductModel.findById(req.query.id);

     if(!product){
        return next(new ErrorHandler('Product not found', 404));
     }

     res.status(200).json({
        success: true,
        reviews: product.reviews
     });
})

// * delete product Review
exports.deleteProductReview = catchAsyncErrors(async (req, res, next)=>{
    const product = await ProductModel.findById(req.query.productId);
      
    if(!product){
        return next(new ErrorHandler('Product not found', 404));
     }

     const reviews = product.reviews.filter((review)=>{
        review._id.toString() !== req.query.id.toString()
     })

     let avg = 0;

     reviews.forEach((rev) => {
       avg += rev.rating;
     });
   
     let ratings = 0;

     if (reviews.length === 0) {
        ratings = 0;
      } else {
        ratings = avg / reviews.length;
      }

      const numOfReviews = reviews.length;


      await ProductModel.findByIdAndUpdate(
        req.query.productId,
        {
          reviews,
          ratings,
          numOfReviews,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

     res.status(200).json({
        success: true,
     });
})

