// For store owner account dashboard access restriction
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const storeValidation = asyncHandler(async(req,res,next) => {
    const token = req.cookies.store_access_token;
    if(!token) {
        return res.status(401).render("login", {type_user: "Store", error: "Please login to your account."});
    }

    try {
        const decoded = jwt.verify(token, process.env.STORE_ACCESS_TOKEN);
        req.storeID = decoded.id;
        req.storeName = decoded.name;
        req.storeEmail = decoded.email;
        next(); //prevents infinite looping on the request
    } catch (err) {
        console.log(err);
        return res.status(401).render("login", {type_user: "Store", error: "User is not authorized, please login again."});       
    }
})

module.exports = storeValidation;