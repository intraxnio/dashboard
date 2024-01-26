const mongoose = require('mongoose');
const username= "brandthisin";
const password = 'Pa55w0Rd1234';
var dbUrl = "mongodb+srv://" + username + ":" + password + "@cluster0.0md4vf5.mongodb.net/?retryWrites=true&w=majority"

// var dbUrl= process.env.MONGODB_URL;


const connectToMongo = ()=>{
    mongoose.connect(dbUrl).then(() => console.log('DB Connection successfull'))
    .catch((err) => { console.error(err); });
}

module.exports = connectToMongo;