const asyncHandler = require("express-async-handler");
const Product = require("../models/productsModel");
const Cart = require("../models/cartModel");
const Transaction = require("../models/transactionsModel");


//@desc Add a product to the cart
//@route POST /api/user/add-to-cart/:id
//@access private
const addToCart = asyncHandler(async (req, res) => {
    const product_id = req.params.id; // Get the product ID that was passed with the route
    const store_id = (await Product.findOne({ _id: product_id })).store_id; //find the store id of the product
    const user_id = req.userID; //get the user id logged in 

    //Add the product to the cart with the information following the models/cartModel.js
    await Cart.create({
        product_id,
        user_id,
        store_id
    });

    //redirect to cart route to see the items in the cart and render the ejs file accordingly
    res.status(200).redirect("/api/user/get-cart");
});


//@desc Get cart items of a user
//@route GET /api/user/get-cart
//@access private
const getCartItems = asyncHandler(async (req, res) => {
    const user_id = req.userID; // Get the user ID logged in
    const cart_items = await Cart.find({ user_id }); //find all the cart items of the user
    let products = [];// Array to store the products

    // Loop through each cart item and push the product details to the products array
    for (const item of cart_items) {
        const product = await Product.findById(item.product_id, { name: 1, price: 1 });
        products.push([item.id, product]);
    }

    // If there are products in the cart, render views/user/cart.ejs with the products
    if (products.length > 0) {
        res.status(200).render("user/cart", { cart: products });
    } else { // If there are no products in the cart, send a 404 status with a message
        res.status(404).send("Your cart is empty now!");
    }
});


//@desc delete an item from cart
//@route DELETE /api/user/delete-cart/:id
//@access private
const deleteCartItem = asyncHandler(async (req, res) => {
    const cart_item_id = req.params.id; // Get the cart item ID that was passed with the route

    // Check if the cart item exists in the database, if not send a 404 status with a message
    const cart_item = await Cart.findOne({ _id: cart_item_id });
    if (!cart_item) {
        return res.status(404).send("This item does not exist in your cart!");
    }

    // Check if the user ID in the request matches the user ID of the cart item, if not send a 403 status with a message
    // This is to prevent users from deleting items from other users' carts
    if (req.userID != cart_item.user_id) {
        return res.status(403).send("You can't delete this item since it belongs to another user.");
    }

    // If the cart item exists and the user ID matches, delete the cart item from the database
    // and send a 200 status with a success message
    await Cart.deleteOne({ _id: cart_item_id });
    res.status(200).send("Deleted the item from your cart!");
});


//@desc Confirm card as an order
//@route POST /api/user/confirm-cart/
//@access private
const confirmCart = asyncHandler(async (req, res) => {
    const user_id = req.userID; // Get the user ID logged in

    // Check if the user has any items in the cart
    // If not, send a 404 status with a message
    const cart_items = await Cart.find({ user_id }, {product_id: 1, store_id: 1 });
    if (cart_items.length == 0) {
        return res.status(404).send("Your cart is empty!");
    }

    //Add each cart item to the transactions collection and then delete the cart item
    // from the cart collection
    Transaction.create({
            user_id: req.userID,
            products: cart_items,
            purchase_date: Date.now(),
            order_status: "pending", // Set the order status to pending by default
    });

    // Delete the cart item from the cart collection
    await Cart.deleteMany({ user_id });

    // Send a 200 status with a success message
    res.status(200).send("Submitted your order! The stores will contact you soon.");
});

// Export the functions to be used in the routes
module.exports = { addToCart, getCartItems, deleteCartItem, confirmCart };
