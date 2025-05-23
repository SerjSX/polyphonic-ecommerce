const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const userValidation = asyncHandler(async(req,res,next) => {
    const token = req.cookies.user_access_token;
    if(!token) {
        res.status(401).send("Please login to your account.")
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.USER_ACCESS_TOKEN);
        req.userID = decoded.id;
        req.userName = decoded.name;
        req.userEmail = decoded.email;
        next(); //prevents infinite looping on the request
    } catch (err) {
        res.clearCookie('user_access_token');
        res.status(401).send("Please login to your account.")
        return -1;     
    }
})

module.exports = userValidation;