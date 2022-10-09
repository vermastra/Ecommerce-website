const jwt = require("jsonwebtoken");
const User = require("../models/userModels"); //schema


exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this Resource",
            })
        }
        
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();

    } catch (err) {
        res.send(err.message);
    }
}

exports.authorizeRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is Not allowed to access this page`,
            })
        }
        next();
    }
}