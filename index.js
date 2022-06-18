const app = require("./app");
const dotenv = require('dotenv');


dotenv.config({path:"./.env"});

app.listen(process.env.PORT,()=>{
    console.log(`Express server listening on ${process.env.PORT}`);
});