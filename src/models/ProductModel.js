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
    img:{
          type : String,
          default: "images not found"
    },
    category:{
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    size: { 
        type: Array
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
    dateCreated: { 
        type: Date, 
        default: Date.now
    }
         
},{versionKey : false});


const ProductModel = mongoose.model('Products', ProductSchema);

module.exports = ProductModel;