const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, deleteReviews, getProductReviews, getAdminProducts } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRole("admin"), createProduct);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRole("admin"), getAdminProducts);
// router.route("/product/:id").put(updateProduct);
// router.route("/product/:id").delete(deleteProduct);
// router.route("/product/:id").get(getProductDetail);

// since the url is same, so it will work this way also
router.route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRole("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRole("admin"), deleteProduct)
    

router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").delete(isAuthenticatedUser,deleteReviews).get(getProductReviews);

module.exports = router;