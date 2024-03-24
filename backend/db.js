const mongoose = require('mongoose');
// const username = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;

const username = 'groopsappin';
const password = '9ZUmTwIcAHCLwaUn';

// var dbUrl= "mongodb+srv://"+username+":"+password+"@cluster0.1u64z5l.mongodb.net/?retryWrites=true&w=majority"

var dbUrl = 'mongodb+srv://'+username+':'+password+'@appcluster01.juvp7dd.mongodb.net/?retryWrites=true&w=majority&appName=AppCluster01';

// var dbUrl= process.env.MONGODB_URL;



const connectToMongo = ()=>{
    mongoose.connect(dbUrl).then()
    .catch((err) => { console.error(err); });
}

module.exports = connectToMongo;