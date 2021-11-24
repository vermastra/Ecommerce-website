const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, deleteUser, updateUserRole } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizeRole("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser,authorizeRole("admin"), getSingleUser)
    .delete(isAuthenticatedUser,authorizeRole("admin"), deleteUser)
    .put(isAuthenticatedUser,authorizeRole("admin"), updateUserRole) 

module.exports = router;