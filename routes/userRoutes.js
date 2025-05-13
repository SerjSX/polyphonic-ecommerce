const express = require("express");
const {registerUser, loginUser, logoutUser, getOrders, loadDashboard, deleteOrder} = require("../controllers/userController");
const userValidation = require("../middleware/validateUser");
const { addToCart, getCartItems, deleteCartItem, confirmCart } = require("../controllers/cartController");
const { upload } = require("../middleware/multer_mid");

const router = express.Router();

router.post("/register", upload.none(), registerUser);
router.post("/login", loginUser);
router.post("/logout", userValidation, logoutUser);
router.get("/dashboard", userValidation, loadDashboard);

router.post("/add-to-cart/:id", userValidation, addToCart);
router.get("/get-cart", userValidation, getCartItems);
router.delete("/delete-cart/:id", userValidation, deleteCartItem);
router.post("/confirm-cart", userValidation, confirmCart)

router.get("/orders", userValidation, getOrders);
router.delete("/order/:id", userValidation, deleteOrder);

module.exports = router;