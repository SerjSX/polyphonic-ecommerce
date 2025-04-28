const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const userValidation = asyncHandler(async(req,res,next) => {
    const token = req.cookies.user_access_token;
    if(!token) {
        return res.status(401).render("login", {type_user: "User", error: "Please login to your account."});
    }

    try {
        const decoded = jwt.verify(token, process.env.USER_ACCESS_TOKEN);
        req.userID = decoded.id;
        req.userName = decoded.name;
        req.userEmail = decoded.email;
        next(); //prevents infinite looping on the request
    } catch (err) {
        console.log(err);
        return res.status(401).render("main");       
    }
})

module.exports = userValidation;