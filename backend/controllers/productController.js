const Product = require("../models/productModels"); //schema
const ApiFeatures = require("../utils/apifeature")

// const ErrorHandler = require("../utils/errorHandler");
// const catchAsyncError = require("../middleware/catchAsyncError") //subtitute of try-catch


//create product---ADMIN
exports.createProduct = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);  // other way: new Product(req.body)
        res.status(201).json({
            success: true,
            product
        }) //  why save is not used for mogodb*****

    } catch (err) {
        res.send(err.message);
    }

}

//update product---ADMIN
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            sucess: true,
            product
        })
    } catch (err) {
        res.send(err.message);
    }
}

//Delete product---ADMIN
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }

        await product.remove();

        res.status(200).json({
            sucess: true,
            message: "Product deleted"
        })
    } catch (err) {
        res.send(err.message);
    }
}

//Get one Product Detail
exports.getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            // return next(new Error('Product Not found', 404));
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            sucess: true,
            product,
            productCount
        })
    } catch (err) {
        res.send(err.message);
    }
}


//get all product
exports.getAllProducts = async (req, res) => {
    try {
        const resultPerPage = 3;
        const productCount = await Product.countDocuments();
        const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
        const products = await apiFeature.query;//Product.find()
        res.status(201).json({
            success: true,
            products
        })
    } catch (err) {
        res.send(err.message);
    }
}


// copy of what was there (the other way)
// //get all product
// exports.getAllProducts = catchAsyncError(async (req, res) => {

//     const products = await Product.find();
//     res.status(201).json({
//         success: true,
//         products
//     })
// })