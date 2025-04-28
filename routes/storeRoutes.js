const express = require("express");
const {registerStore, loginStore, logoutStore, getTransactions} = require("../controllers/storeController");
const {addProduct, deleteProduct, getProductInfo, getLimitedProducts} = require("../controllers/productController");
const {addCategory, deleteCategory, getCategories} = require("../controllers/categoryController");

const storeValidation = require("../middleware/validateStore");

const router = express.Router();

// Store related
router.post("/register", registerStore);
router.post("/login", loginStore);
router.post("/logout", storeValidation, logoutStore);

// Category related
router.post("/category/add", storeValidation, addCategory);
router.delete("/category/delete/:id", storeValidation, deleteCategory);
router.get("/category/get", storeValidation, getCategories);

// Product related
router.post("/product/add", storeValidation, addProduct);
router.delete("/product/delete/:id", storeValidation, deleteProduct);
router.get(["/product/limited/:skip/:limit", "/product/limited/:skip", "/product/limited/:skip/:limit/:storeid"], storeValidation, getLimitedProducts);
router.get(["/product/:id", "/product"], getProductInfo);

// Transaction related
router.get("/transactions", storeValidation, getTransactions)

module.exports = router;