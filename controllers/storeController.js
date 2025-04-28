const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Store = require("../models/storesModel");
const Transaction = require("../models/transactionsModel");
const Product = require("../models/productsModel");
const { getInfo } = require("./productController");

//@desc Register a Store
//@route POST /api/stores/register
//@access public
const registerStore = asyncHandler(async (req,res) => {
    const {name,email,phone_number,founded_date,location,password} = req.body;

    if (!name || !email || !phone_number || !founded_date || !location || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const storeCheck = await Store.findOne({email});

    if (storeCheck) {
        res.status(400);
        throw new Error("A store is already registered with that email!");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const store = await Store.create({
        name,
        email,
        phone_number,
        founded_date,
        location,
        password: hashedPassword
    })

    console.log(`Store created ${store}`)

    if (store) {
        res.status(201).redirect("/store/login");
    } else {
        res.status(400);
        throw new Error("User data is invalid");
    }

})

//@desc Login a Store Account
//@route POST /api/store/login
//@access public
const loginStore = asyncHandler(async (req,res) => {
    const {email,password} = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error ("All fields are necessary to add");
    }

    const store = await Store.findOne({email});

    if (store && await(bcrypt.compare(password, store.password))) { //if store exists and password matches
        console.log("Attempting to login:", store.id);
        const storeAccessToken = jwt.sign({
            name: store.name,
            email: store.email,
            id: store.id
        }, process.env.STORE_ACCESS_TOKEN,
        {expiresIn: "45m"});

        if (req.cookies.store_access_token) {
            res.clearCookie('store_access_token');
        }

        //stores the access token as a cookie!
        res.cookie('store_access_token', storeAccessToken, {httpOnly: true, secure: process.env.NODE_ENV === "production"})
        res.status(200).redirect("/api/store/product/limited/0/10/");
    } else {
        res.status(401).render("login", {type_user: "Store", error: "Email or password is incorrect"});
    }
});

//@desc Logout Store Account
//@route POST /api/store/logout
//@access private
const logoutStore = asyncHandler(async (req,res) => {
    res.clearCookie('store_access_token');
    res.status(200).redirect("/");
});

//@desc get current transactions
//@route GET /api/store/transactions
//@access private
const getTransactions = asyncHandler(async (req,res) => {
    const transactions = await Transaction.find({store_id: req.storeID});
    const return_arr = []

    if (!transactions) {
        res.status(404);
        throw new Error("No transactions found for this store!");
    }

    for (let i = 0; i < transactions.length; i++) {
        const product = await Product.findById(transactions[i].product_id, {name: 1, price: 1});
        return_arr.push({transactions_id: transactions[i]._id, name: product.name, price: product.price, status: transactions[i].order_status, purchase_date: transactions[i].purchase_date});    
    }

    res.status(200).render("store/transactions", {transactions: return_arr});
});

//@desc getting a list of all stores
async function getStores() {
    return await Store.find({}, { _id: 1, name: 1, location: 1, founded_date: 1 })
}


module.exports = {registerStore, loginStore, logoutStore, getStores, getTransactions};