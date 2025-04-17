const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Store = require("../models/storesModel");

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
        res.status(201).json({_id: store.id, name: store.name, email: store.email});
    } else {
        res.status(400);
        throw new Error("User data is invalid");
    }

})

//@desc Login a Store Account
//@route POST /api/stores/login
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
        res.status(200).redirect("/api/stores/product/limited/0/10/");
    } else {
        res.status(401);
        throw new Error("Email or password is incorrect");
    }
});

//@desc Logout Store Account
//@route POST /api/stores/logout
//@access private
const logoutStore = asyncHandler(async (req,res) => {
    res.clearCookie('store_access_token');
    res.status(200).redirect("/store/login");
});

module.exports = {registerStore, loginStore, logoutStore};