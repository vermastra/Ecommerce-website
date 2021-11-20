const express = require('express');
const app = express();
const cookieparser= require("cookie-parser");

// const ErrorMiddleware = require("./middleware/error"); //not working*********

// to get the data from user
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Route import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

//middleware for error
// app.use(ErrorMiddleware);

app.use("/api/v1", product);
app.use("/api/v1", user);


module.exports = app;