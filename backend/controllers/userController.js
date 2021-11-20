const User = require("../models/userModels"); //schema
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

//register user
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "this is a sample id",
                url: "profilePicUrl",
            }
        });

        sendToken(user, 201, res) //  why save is not used for mogodb*****

    } catch (err) {
        res.send(err.message);
    }

}


//login user
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //checkng if user has entered both email and password
        if (!email || !password) {
            return res.status(500).json({
                success: false,
                message: "Please Enter Email and Password"
            })
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Enter Email or Password"
            })
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid Enter Email or Password"
            })
        }

        sendToken(user, 200, res);

    } catch (err) {
        res.send(err.message);
    }

}

//logout user
exports.logout = async (req, res, next) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            sucess: true,
            message: "Logged Out",
        });

    } catch (err) {
        res.send(err.message);
    }

}

//forgot password
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            })
        }

        //getting reset password tokken
        const resetToken = user.getRestPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `Your Password Rest Token is ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore`;

        try {
            await sendEmail({
                email:user.email,
                subject:`Ecommerce Password Recovery`,
                message,
            })

            return res.status(200).json({
                success: true,
                message:`Email sent to ${user.email} successfully`, 
            })

        } catch (err) {
            //removing all the changes which are done earlier by user.save();
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;

            await user.save({ validateBeforeSave: false });
            return res.status(505).json({
                success: false,
                message:err.message
            })
        }

    } catch (err) {
        res.send(err.message);
    }

}


//Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        //creating token hash
        const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user=await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}, 
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset password token is invalid or has been expired"
            })
        }
        if (req.body.password!=req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password doesn't matched"
            })
        }

        user.password=req.body.password;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save();

        //relogin the user
        sendToken(user,200,res);

    } catch (err) {
        res.send(err.message);
    }

}
