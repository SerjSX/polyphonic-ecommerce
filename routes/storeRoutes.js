const express = require("express");
const {registerStore, loginStore, logoutStore, getClientInfo} = require("../controllers/storeController");
const {addProduct, deleteProduct, getProductInfo, getLimitedProducts, updateProductPage, updateProduct} = require("../controllers/productController");
const {addCategory, deleteCategory, getCategories} = require("../controllers/categoryController");

const storeValidation = require("../middleware/validateStore");
const { getTransactions, updateTransactionStatus } = require("../controllers/store/transactionsController");

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
router.post("/product/update-page", storeValidation, updateProductPage);
router.post("/product/update", storeValidation, updateProduct);

// Transaction related
router.get("/transactions", storeValidation, getTransactions)
router.post("/transaction/set-status/:id-:status", storeValidation, updateTransactionStatus)

// Customer related
router.get("/get-client/:id", storeValidation, getClientInfo);

module.exports = router;