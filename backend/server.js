const express = require('express');
const jwt = require("jsonwebtoken");
const dbConnection = require("./db");
const ErrorHandler = require('./middleware/error');
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');
const agenda = require('./middleware/agendaManager');
dbConnection();
const brand = require("./routes/brandUser");
const auth = require("./routes/fb_auth");
const creator = require("./routes/creatorUser");

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true, limit:"50mb"}));


//Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});


const corsOptions ={
  origin: 'http://app.buzzreach.in:8000', // Update the origin to match your backend's address and port
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));



app.use("/api/brand", brand);
app.use("/api/auth", auth);
app.use("/api/creator", creator);


//Error Handling
app.use(ErrorHandler);

//create server
const server = app.listen(8000, () => {
  // console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});


(async () => {
  await agenda.start();
  console.log('Agenda started');
})();




