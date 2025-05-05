const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Store = require("../models/storesModel");
const Transaction = require("../models/transactionsModel");
const Product = require("../models/productsModel");
const User = require("../models/usersModel");
const { getInfo } = require("./productController");

//@desc Register a Store
//@route POST /api/stores/register
//@access public
const registerStore = asyncHandler(async (req,res) => {
    const {name,email,phone_number,founded_date,location,password} = req.body;

    if (!name || !email || !phone_number || !founded_date || !location || !password) {
        return res.status(400).send("All fields are mandatory!");
    }

    const storeCheck = await Store.findOne({email});

    if (storeCheck) {
        return res.status(400).send("A store is already registered with that email!");
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
        return res.status(201).send("Success");
    } else {
        return res.status(400).send("User data is invalid!");
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

//@desc getting a list of all stores
async function getStores() {
    return await Store.find({}, { _id: 1, name: 1, location: 1, founded_date: 1 })
}

//@desc Get a customer's information
//@route GET /api/store/get-client/:id
//@access PRIVATE
const getClientInfo = (async (req,res) => {
    const transaction = await Transaction.findOne({_id: req.params.id}, {user_id:1});
    const customer = await User.findOne({_id: transaction.user_id}, {name:1, email:1, address:1, phone_number:1});
    
    //this most likely will NOT be needed as the store interface shows the available list of transactions.
    //additionally when people try to access the api link separately they will fail to do so since 
    //the design was later changed for the interaction between backend and frontend. 
    //Keeping it anyways, same goes with the other conditions.
    if (!customer) {
        res.status(404);
        throw new Error("Make sure the ID passed is correct.")
    }
    
    res.status(200).send(customer);
})


module.exports = {registerStore, loginStore, logoutStore, getStores, getClientInfo};