
// import 
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const morgan = require('morgan')
const router = require("./src/routes/index");
const rateLimit =require('express-rate-limit');
const helmet =require('helmet');
const mongoSanitize =require('express-mongo-sanitize');
const xss =require('xss-clean');
const hpp =require('hpp')
const ErrorMiddleware = require('./src/middleware/error')
const cookieParser = require('cookie-parser');
// initialize
const app = express();

// use 
app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

// Request Rate Limit
const limiter= rateLimit({windowMs:15*60*1000,max:3000})
app.use(limiter)



app.use('/api/v1',router);


// error handler route 
app.use(ErrorMiddleware);

// Undefined Route

app.use('*', (req,res)=>{
    res.status(404).json({status:"Failure" , data:"Not Found"});
})


module.exports = app;