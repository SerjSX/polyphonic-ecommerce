// For store owner account dashboard access restriction
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const storeValidation = asyncHandler(async(req,res,next) => {
    const token = req.cookies.store_access_token;
    if(!token) {
        res.status(403);
        throw new Error("User is not authorized, please login.")
    }

    jwt.verify(token, process.env.STORE_ACCESS_TOKEN, (err,decoded) => {
        if (err) {
            res.status(401);
            throw new Error("User is not authorized");
        }
        console.log(decoded);

        req.storeID = decoded.id;
        req.storeName = decoded.name;
        req.storeEmail = decoded.email;
        next(); //prevents infinite looping on the request
    });
})

module.exports = storeValidation;