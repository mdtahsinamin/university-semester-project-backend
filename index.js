const app = require("./app");
const dotenv = require('dotenv');
const connectDatabase = require('./src/db/db');
const cloudinary = require('cloudinary').v2;

// uncaughtException

process.on('uncaughtException', (err)=>{
    console.log(`Error : ${err}`);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1);
})




// config
dotenv.config();

// database
connectDatabase()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




const server = app.listen(process.env.PORT,()=>{
    console.log(`Express server listening on ${process.env.PORT}`);
});


// Unhandled promise rejection

process.on('unhandledRejection',(err)=>{
    console.log(`Error : ${err}`);
    console.log('Shutting down the server due to unhandled Rejection');
    server.close((err)=>{
        process.exit(1);
    })
})
