const express = require('express');
const app = express();

// const ErrorMiddleware = require("./middleware/error"); //not working*********

// to get the data from user
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Route import
const product = require("./routes/productRoute");

//middleware for error
// app.use(ErrorMiddleware);

app.use("/api/v1", product);
module.exports = app;