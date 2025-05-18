const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Store = require("../models/storesModel");
const Transaction = require("../models/transactionsModel");
const User = require("../models/usersModel");

//@desc Register a Store
//@route POST /api/store/register
//@access public
const registerStore = asyncHandler(async (req,res) => {
    // Get the data from the request body
    const {name,email,phone_number,founded_date,location,password} = req.body;

    // Check if all fields are provided
    // If any field is missing, return a 400 status code with an error message
    if (!name || !email || !phone_number || !founded_date || !location || !password) {
        return res.status(400).send("All fields are mandatory!");
    }

    // Check if a store with the same email already exists in the database
    // If it does, return a 400 status code with an error message
    const storeCheck = await Store.findOne({email});
    if (storeCheck) {
        return res.status(400).send("A store is already registered with that email!");
    }

    // Hash the password using bcrypt
    // The second argument is the number of salt rounds to use for hashing
    const hashedPassword = await bcrypt.hash(password,10);

    // Handle file upload using multer for the profile image of the store
    let filePath = null;
    if (req.file) {
        filePath = `/uploads/${req.file.filename}`; // Save the file path
    }

    // Create a new store in the database with the provided data
    const store = await Store.create({
        name,
        email,
        phone_number,
        founded_date,
        location,
        password: hashedPassword,
        image_location: filePath
    })

    // Check if the store was created successfully
    // If it was, return a 201 status code with a success message
    // If not, return a 400 status code with an error message
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
    // Get the email and password from the request body
    // If either field is missing, return a 400 status code with an error message
    const {email,password} = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error ("All fields are necessary to add");
    }

    // Check if a store with the provided email exists in the database
    const store = await Store.findOne({email});

    // If the store does not exist or the password does not match, return a 401 status code with an error message
    // If the store exists and the password matches, create a JWT token for the store that lasts for 45minutes
    if (store && await(bcrypt.compare(password, store.password))) { 
        const storeAccessToken = jwt.sign({
            name: store.name,
            email: store.email,
            id: store.id
        }, process.env.STORE_ACCESS_TOKEN, //uses secret key from .env file
        {expiresIn: "45m"});

        //If a store cookie already exists, clear it
        if (req.cookies.store_access_token) {
            res.clearCookie('store_access_token');
        }

        //stores the access token as a cookie and renders the store page with skip 0!
        res.cookie('store_access_token', storeAccessToken, {httpOnly: true, secure: process.env.NODE_ENV === "production"})
        res.status(200).redirect("/api/store/product/limited/0");
    } else {
        res.status(401).render("login", {type_user: "Store", error: "Email or password is incorrect"});
    }
});

//@desc Logout Store Account
//@route POST /api/store/logout
//@access private
const logoutStore = asyncHandler(async (req,res) => {
    // Clear the store access token cookie
    res.clearCookie('store_access_token');
    res.status(200).redirect("/");
});

//@desc getting a list of all stores
async function getStores() {
    return await Store.find({}, { _id: 1, name: 1, location: 1, founded_date: 1, image_location:1 })
}

//@desc Get a customer's information
//@route GET /api/store/get-client/:id
//@access PRIVATE
const getClientInfo = (async (req,res) => {
    //Find the transaction by ID and get the user_id
    //Find the user by ID and get the name, email, address, and phone number
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
    
    //Send the customer information as a response
    res.status(200).send(customer);
})



module.exports = {registerStore, loginStore, logoutStore, getStores, getClientInfo};