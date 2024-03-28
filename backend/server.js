const express = require('express');
const jwt = require("jsonwebtoken");
const dbConnection = require("./db");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
dbConnection();
const brand = require("./routes/brandUser");
// const creator = require("./routes/creatorUser");

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true, limit:"50mb"}));



//Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionSuccessStatus: 200,
  changeOrigin: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});




app.use("/brand", brand);


//create server
const server = app.listen(8003, () => {
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});





