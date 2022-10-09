const app = require('./app');
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

//handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Server closing due to uncaught exception ");
    process.exit(1);
})

const connectDataBase = require("./config/database");

//config
dotenv.config({ path: "backend/config/.env" });

//connecting to database
connectDataBase();

//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const server = app.listen(process.env.PORT, () => {
    console.log(`server is working on port ${process.env.PORT}`)
})

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Server closing due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    })

})