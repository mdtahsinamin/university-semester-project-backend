
// import 
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const morgan = require('morgan')
const router = require("./src/routes/userRoute");

// initialize
const app = express();

// use 
app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// mongo 

let URL =  "mongodb://127.0.0.1:27017/customer"
let options = {user:"",pass:''}
mongoose.connect(URL, options,(err)=>{
    try {
        console.log("Mongoose connection Establish success")
    }catch(e) {
        console.log(err)
    }
})


app.use('/api/v1',router);


// Undefined Route

app.use('*', (req,res)=>{
    res.status(404).json({status:"Failure" , data:"Not Found"});
})


module.exports = app;