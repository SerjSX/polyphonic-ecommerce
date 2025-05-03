const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const Transaction = require("../models/transactionsModel");
const Product = require("../models/productsModel");
const { getStores } = require("./storeController");

//@desc Register a User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,age, address, phone_number} = req.body;

    if (!name || !email || !age || !password || !address || !phone_number) {
        return res.status(400).send("All fields are mandatory!");
    }

    const userCheck = await User.findOne({email});

    if (userCheck) {
        return res.status(400).send("A user is already registered with that email!");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        age,
        address,
        phone_number
    })

    console.log(`User created ${user}`)

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
    const {email,password} = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields are necessary to add");
    }

    const user = await User.findOne({email});

    if (user && await(bcrypt.compare(password, user.password))) { //if user exists and password matches
        const userAccessToken = jwt.sign({
            name: user.name,
            email: user.email,
            id: user.id
        }, process.env.USER_ACCESS_TOKEN,
        {expiresIn: "30m"});

        if (req.cookies.user_access_token) {
            res.clearCookie('user_access_token');
        }

        //stores the access token as a cookie!
        res.cookie('user_access_token', userAccessToken, {httpOnly: true, secure: process.env.NODE_ENV === "production"})
        res.status(200).render("user/dashboard", {userName: user.name, stores_list: await getStores()});
    } else {
        res.status(401).send("Email or password is incorrect");
    }
});

//@desc Logout a User Account
//@route POST /api/user/logout
//@access public
const logoutUser = asyncHandler(async (req,res) => {
    res.clearCookie('user_access_token');
    res.status(200).redirect("/");
})

//@desc Load user dashboard
//@route GET /api/user/dashboard
//@access private
const loadDashboard = asyncHandler(async (req,res) => {
    res.status(200).render("user/dashboard", {userName: req.userName, stores_list: await getStores()})
})

//@desc See users' orders
//@route GET /api/user/orders
//@access private
const getOrders = asyncHandler(async (req,res) => {
    const user_id = req.userID;
    const orders = await Transaction.find({user_id}).sort({purchase_date: 1});

    const returnProducts = [];

    for (const order of orders) {
        const product = await Product.findOne({_id: order.product_id}, {name: 1, price: 1});

        returnProducts.push({
            id: order.id,
            name: product.name || "Unknown",
            status: order.order_status,
            price: product.price || 0,
            purchase_date: order.purchase_date
        })
    }

    if (returnProducts.length > 0) {
        res.status(200).render('user/orders', {orders: returnProducts});
    } else {
        res.status(404).send("No orders!");
    }
})

//@desc Delete an order
//@route DELETE /api/user/order/:id
//@access private
const deleteOrder = asyncHandler(async (req,res) => {
    const orderID = req.params.id;
    const order = await Transaction.findOne({_id: orderID});

    if (!order) {
        return res.status(404).send("Order not found.")
    }

    if (order.user_id != req.userID || order.order_status != "pending") {
        return res.status(401).send("Not authorized to delete this order. Either it's not yours or the order is not in pending status.");
    }

    await Transaction.deleteOne({_id: orderID});
    res.status(200).send("Deleted the order!");
})

module.exports = {registerUser, loginUser, logoutUser, getOrders, loadDashboard, deleteOrder};