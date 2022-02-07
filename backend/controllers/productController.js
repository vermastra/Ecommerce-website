const Product = require("../models/productModels"); //schema
const ApiFeatures = require("../utils/apifeature")
const cloudinary = require("cloudinary")

//create product---ADMIN
exports.createProduct = async (req, res, next) => {
    try {
        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images)
        }
        else images = req.body.images

        const imagesLink = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }

        req.body.images = imagesLink;
        req.body.user = req.user.id;
        const product = await Product.create(req.body);  
        res.status(201).json({
            success: true,
            product
        })

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

        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images)
        }
        else images = req.body.images

        //checking if any image is uploded or not
        if (images !== undefined) {
            //removing old images
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            //updating image links
            const imagesLink = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLink.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                })
            }
            req.body.images = imagesLink;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
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

        //removing images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
        await product.remove();

        res.status(200).json({
            success: true,
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
            success: true,
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
            success: true,
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

        let ratings = 0;
        if (reviews.length == 0) ratings = 0; //for the edge case of avg/reviews.length = 0/0;
        else ratings = avg / reviews.length;

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
            success: true,
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
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            product,
        })
    } catch (err) {
        res.send(err.message);
    }
}


//get all product
exports.getAllProducts = async (req, res) => {
    try {
        const resultPerPage = 2;
        const productsCount = await Product.countDocuments();
        const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
        let products = await apiFeature.query;
        let filteredProductsCount = products.length;
        apiFeature.pagination(resultPerPage);
        products = await apiFeature.query.clone(); //clone bcoz Mongoose no longer allows executing the same query object twice
        res.status(201).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount
        })
    } catch (err) {
        res.send(err.message);
    }
}

//get all product --ADMIN
exports.getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).json({
            success: true,
            products
        })
    } catch (err) {
        res.send(err.message);
    }
}
