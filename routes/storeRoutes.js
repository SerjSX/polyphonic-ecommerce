const express = require("express");
const { registerStore, loginStore, logoutStore, getClientInfo } = require("../controllers/storeController");
const { addProduct, deleteProduct, getLimitedProducts, updateProductPage, updateProduct, addProductPage } = require("../controllers/productController");
const { upload } = require("../middleware/multer_mid");//for malter config
const { addCategory, deleteCategory, getCategories } = require("../controllers/categoryController");

const storeValidation = require("../middleware/validateStore");
const { getTransactions, updateTransactionStatus } = require("../controllers/store/transactionsController");

const router = express.Router();

// Store related
router.post("/register", upload.single("file"), registerStore);
router.post("/login", loginStore);
router.post("/logout", storeValidation, logoutStore);

// Category related
router.delete("/category/delete/:id", storeValidation, deleteCategory);
router.get("/category/get", storeValidation, getCategories);

// Product related
router.get("/product/add-page", storeValidation, addProductPage);
router.post("/product/add", storeValidation, upload.single("file"), addProduct);
router.delete("/product/delete/:id", storeValidation, deleteProduct);
router.get(["/product/limited/:skip/:limit", "/product/limited/:skip", "/product/limited/:skip/:limit/:storeid"], storeValidation, getLimitedProducts);
router.post("/product/update-page", storeValidation, updateProductPage);
router.post("/product/update", storeValidation, updateProduct);

// Transaction related
router.get("/transactions", storeValidation, getTransactions)
router.post("/transaction/set-status/:transaction_id/:product_id/:status", storeValidation, updateTransactionStatus)

// Customer related
router.get("/get-client/:id", storeValidation, getClientInfo);

module.exports = router;