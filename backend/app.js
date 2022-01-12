const express = require('express');
const app = express();
const cookieparser= require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// const ErrorMiddleware = require("./middleware/error"); //not working*********

// to get the data from user
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload());

//Route import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

//middleware for error
// app.use(ErrorMiddleware);

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);


module.exports = app;