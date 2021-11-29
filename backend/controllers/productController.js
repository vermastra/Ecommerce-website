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


//Create new review or update the review
exports.createProductReview = async (req, res, next) => {
    try {
        const { comment, rating, productId } = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find((ele) => {
            return ele.user.toString() === req.user._id.toString() //loop over all the reviwes to find current user.(filter/map can also be used)
        })

        // If user found ,update the review else create new
        if (isReviewed) {
            product.reviews.forEach(ele => {
                if (ele.user.toString() === req.user._id.toString()) {
                    ele.rating = rating
                    ele.comment = comment
                }
            });
        }
        else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;
        product.reviews.forEach(ele => {
            avg += ele.rating;
        });

        product.ratings = avg / product.numOfReviews
        await product.save({ validateBeforeSave: false })

        res.status(200).json({
            sucess: true,
        })

    } catch (err) {
        res.send(err.message);
    }
}

//Get Product Reviews
exports.getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            sucess: true,
            reviews: product.reviews,
        })
    } catch (err) {
        res.send(err.message);
    }
}

//delete Product Reviews
exports.deleteReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const reviews = product.reviews.filter((ele) => {
            return ele._id.toString() != req.query.id.toString()
        });

        let avg = 0;
        reviews.forEach(ele => {
            avg += ele.rating;
        });

        const ratings = avg / reviews.length;
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            req.query.productId,
            { reviews, ratings, numOfReviews },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        )
        res.status(200).json({
            sucess: true,
            reviews: product.reviews,
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
            products,
            productCount
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