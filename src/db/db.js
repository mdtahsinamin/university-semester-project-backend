// connect to mongodb
const mongoose = require('mongoose');


console.log(process.env.DB_URI);
function connectDatabase (){
    let options = {user:"",pass:''}
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(data=>{
        console.log(`Mongodb connected with server: ${data.connection.host}`);
      });
}

module.exports = connectDatabase;

/*
  options,(err)=>{
    console.log("Mongoose connection Establish success")
}
*/