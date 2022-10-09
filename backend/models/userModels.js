const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [30, "Name cannot exceed 30 characters"],
        minlength: [3, "Name should have more than 2 characters"],
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },

    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "Password should be Greater than 8 Characters"],
        select: false,
    },

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },

    role: {
        type: String,
        default: "user",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

//hashing the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//JWT Token Generate
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

//compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//generating password reset token
userSchema.methods.getRestPasswordToken = function () {
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and adding resetPasswordToken to UserSchema 
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model("user", userSchema);