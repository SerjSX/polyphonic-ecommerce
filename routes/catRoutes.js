const express = require("express");
const {getCategories, getCategoryProducts} = require("../controllers/categoryController");
const userValidation = require("../middleware/validateUser");

const router = express.Router();

//the following getCategories operation route is for users only, for the store check storeRoutes.js
router.get(["/get/:id","/get"], userValidation, getCategories);
router.get("/get-products/:information/:skip", userValidation, getCategoryProducts);


module.exports = router;