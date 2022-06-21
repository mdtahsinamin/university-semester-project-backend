const ProductModel = require("../models/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


// create product  -- Admin
exports.createProduct = catchAsyncErrors(async(req, res, next) => {
    const newProduct = new ProductModel(req.body);
    //newProduct.img = req.file.path;
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
 })

// read -> get all product

exports.getAllProduct = catchAsyncErrors(async(req, res, next) => {
     
     const resultPerPage = 12;
     const productCount = await ProductModel.countDocuments();
     const apiFeatures = new ApiFeatures(ProductModel.find(), req.query).search().filter().pagination(resultPerPage);

     const allProduct =  await apiFeatures.query;

     res.status(200).json({
        success: true,
        product: allProduct,
        productCount
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
    });

})


// *  updated product -- admin

//* findByIdAndUpdate
exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await ProductModel.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }

    product = await ProductModel.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators : true,
        useFindAndModify: false,
    });

    res.status(200).json(product)

})

// delete product -- Admin

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }

    await ProductModel.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    })
})