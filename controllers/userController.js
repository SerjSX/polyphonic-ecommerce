const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const Transaction = require("../models/transactionsModel");
const Product = require("../models/productsModel");
const { getStores } = require("./storeController");
const mongoose = require("mongoose");

//@desc Register a User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    //Get the user entered data from the body
    const {name,email,password,age, address, phone_number} = req.body;

    // Chck if all the fields are filled, if not, return an error
    if (!name || !email || !age || !password || !address || !phone_number) {
        return res.status(400).send("All fields are mandatory!");
    }

    // Check if the email is already registered
    // If it is, return an error
    const userCheck = await User.findOne({email});
    if (userCheck) {
        return res.status(400).send("A user is already registered with that email!");
    }

    // Hash the password entered for security
    const hashedPassword = await bcrypt.hash(password,10);

    // Create a new user in the database
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        age,
        address,
        phone_number
    })

    // Check if the user was created successfully
    // If it was, return a success message, else an error
    if (user) {
        res.status(201).send("Success");
    } else {
        res.status(400).send("User data is invalid!");
    }
})

//@desc Login a User Account
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req,res) => {
    //Get the user entered data from the body
    const {email,password} = req.body;

    // Chck if all the fields are filled, if not, return an error
    if (!email || !password) {
        return res.status(400).send("All fields are necessary to add");
    }

    // Check if the account by that email exists
    const user = await User.findOne({email});

    // check if the user's entered password matches the hashed password in the database
    // If it does, create a JWT token and send it back to the user
    // The token lasts for 30 minutes
    if (user && await(bcrypt.compare(password, user.password))) {
        const userAccessToken = jwt.sign({
            name: user.name,
            email: user.email,
            id: user.id
        }, process.env.USER_ACCESS_TOKEN, // secret key from .env file
        {expiresIn: "30m"});

        // clear the cookie of the user if it already exists
        if (req.cookies.user_access_token) {
            res.clearCookie('user_access_token');
        }

        //stores the access token as a cookie!
        res.cookie('user_access_token', userAccessToken, {httpOnly: true, secure: process.env.NODE_ENV === "production"})
        res.status(200).render("user/dashboard", {userName: user.name, stores_list: await getStores()});
    } else {
        // If the password is incorrect, return an error
        res.status(401).send("Email or password is incorrect");
    }
});

//@desc Logout a User Account
//@route POST /api/user/logout
//@access public
const logoutUser = asyncHandler(async (req,res) => {
    // clear the cookie of the user and redirect to the home page
    res.clearCookie('user_access_token');
    res.status(200).redirect("/");
})

//@desc Load user dashboard
//@route GET /api/user/dashboard
//@access private
const loadDashboard = asyncHandler(async (req,res) => {
    //Loads the main user dashboard with a list of stores passed to render the ejs file
    res.status(200).render("user/dashboard", {userName: req.userName, stores_list: await getStores()})
})

//@desc See users' orders
//@route GET /api/user/orders
//@access private
const getOrders = asyncHandler(async (req,res) => {
    // Get the user ID of the user logged in, and find the transactions made by that user
    const user_id = req.userID;

    // Use aggregation to join transactions with products
    // Since we will also display the product name and price in the orders page which are from another model
    // We will use the $lookup operator to join the two collections in order to use data from two collections/models
    const orders = await Transaction.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
        { $sort: { purchase_date: 1 } },
        {
            $project: {
                _id: 1,
                order_status: 1,
                purchase_date: 1,
                products: 1
            }
        },
        { $unwind: "$products" },
        {
            $lookup: {
                from: "products",
                localField: "products.product_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "stores",
                localField: "productInfo.store_id",
                foreignField: "_id",
                as: "storeInfo"
            }
        },
        { $unwind: { path: "$storeInfo", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                "products.name": { $ifNull: ["$productInfo.name", "Unknown"] },
                "products.price": { $ifNull: ["$productInfo.price", 0] },
                "products.store_name": { $ifNull: ["$storeInfo.name", "Unknown"] }
            }
        },
        {
            $group: {
                _id: "$_id",
                order_status: { $first: "$order_status" },
                purchase_date: { $first: "$purchase_date" },
                products: { $push: "$products" }
            }
        },
        {
            $project: {
                id: "$_id",
                order_status: 1,
                purchase_date: 1,
                products: 1,
                _id: 0
            }
        }
    ]);

    if (orders.length > 0) {
        res.status(200).render('user/orders', {orders});
    } else {
        res.status(404).send("No orders!");
    }
})

//@desc Delete an order
//@route DELETE /api/user/order/:id
//@access private
const deleteOrder = asyncHandler(async (req,res) => {
    // Get the user ID of the user logged in, and find the transactions made by that user
    const orderID = req.params.id;
    const order = await Transaction.findOne({_id: orderID});

    // Check if the order exists, if not then send an error
    if (!order) {
        return res.status(404).send("Order not found.")
    }

    // Check if the order belongs to the user logged in and if the order is in pending status
    if (order.user_id != req.userID || order.order_status != "pending") {
        return res.status(401).send("Not authorized to delete this order. Either it's not yours or the order is not in pending status.");
    }

    // Delete the order from the database
    await Transaction.deleteOne({_id: orderID});
    res.status(200).send("Deleted the order!");
})

module.exports = {registerUser, loginUser, logoutUser, getOrders, loadDashboard, deleteOrder};