const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    title:{
        type: String,
        required : [true, 'Please enter product title'],
    },
    desc:{
        type : String,
        required : [true, 'Please enter description']
    },
    images:[{
        public_id:{
            type: String,
            required:true,
        },
        url:{
            type: String,
            required:true,
        },
     },],
    category:{
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    color: { 
        type: Array
    },
    price: { 
      type: Number, 
      required: [true, 'Please enter the product price'],
      maxLength : [8 , "Price cannot exceed 8 characters"] 
    },
    stock: { 
        type: Number,
        required: [true, 'Please enter the product stock'],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
          user:{
              type: mongoose.Schema.ObjectId,
              ref:"User",
              required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    },
    dateCreated: { 
        type: Date, 
        default: Date.now
    }
         
},{versionKey : false});


const ProductModel = mongoose.model('Products', ProductSchema);

module.exports = ProductModel;