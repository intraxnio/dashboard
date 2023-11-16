const mongoose = require('mongoose');
// const username= "intraxnio";
// const password = 'Pa55w0Rd';
// var dbUrl= "mongodb+srv://"+username+":"+password+"@cluster0.1u64z5l.mongodb.net/?retryWrites=true&w=majority"
var dbUrl= process.env.MONGODB_URL;



const connectToMongo = ()=>{
    mongoose.connect(dbUrl).then(() => console.log('DB Connection successfull'))
    .catch((err) => { console.error(err); });
}

module.exports = connectToMongo;