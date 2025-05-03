const asyncHandler = require("express-async-handler");
const Product = require("../models/productsModel");
const Cart = require("../models/cartModel");
const Transaction = require("../models/transactionsModel");

//@desc Add a product to the cart
//@route POST /api/user/add-to-cart/:id
//@access private
const addToCart = asyncHandler(async (req, res) => {
    const product_id = req.params.id;
    const store_id = (await Product.findOne({ _id: product_id })).store_id;
    const user_id = req.userID;

    const cart_item = await Cart.create({
        product_id,
        user_id,
        store_id
    });

    //redirect to cart page to see the items in the cart
    res.status(200).redirect("/api/user/get-cart");
});

//@desc Get cart items of a user
//@route GET /api/user/get-cart
//@access private
const getCartItems = asyncHandler(async (req, res) => {
    const user_id = req.userID;
    const cart_items = await Cart.find({ user_id });
    let products = [];

    for (const item of cart_items) {
        const product_id = item.product_id;
        const product = await Product.findById(product_id, { name: 1, price: 1 });
        products.push([item.id, product]);
    }

    if (products.length > 0) {
        res.status(200).render("user/cart", { cart: products });
    } else {
        res.status(404).send("Your cart is empty now!");
    }
});

//@desc delete an item from cart
//@route DELETE /api/user/delete-cart/:id
//@access private
const deleteCartItem = asyncHandler(async (req, res) => {
    const cart_item_id = req.params.id;

    const cart_item = await Cart.findOne({ _id: cart_item_id });

    if (!cart_item) {
        return res.status(404).send("This item does not exist in your cart!");
    }

    if (req.userID != cart_item.user_id) {
        return res.status(403).send("You can't delete this item since it belongs to another user.");
    }

    await Cart.deleteOne({ _id: cart_item_id });
    res.status(200).send("Deleted the item from your cart!");
});

//@desc Confirm card as an order
//@route POST /api/user/confirm-cart/
//@access private
const confirmCart = asyncHandler(async (req, res) => {
    const user_id = req.userID;
    const cart_items = await Cart.find({ user_id });

    if (cart_items.length == 0) {
        return res.status(404).send("Your cart is empty!");
    }

    //add to transactionsModel, and delete all of the cart items
    for (const item of cart_items) {
        const transaction = Transaction.create({
            product_id: item.product_id,
            user_id: item.user_id,
            purchase_date: Date.now(),
            order_status: "pending",
            store_id: item.store_id
        });

        await Cart.deleteOne({ _id: item._id });
    }

    res.status(200).send("Submitted your order! The stores will contact you soon.");
});

module.exports = { addToCart, getCartItems, deleteCartItem, confirmCart };
