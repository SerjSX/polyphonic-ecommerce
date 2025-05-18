// Importing the required modules
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const bodyParser = require('body-parser');
const asyncHandler = require("express-async-handler");

// Importing the models needed for root-level routes
const Store = require("./models/storesModel");
const Products = require("./models/productsModel");

// cookieParser is used to store the login token as a cookie to access
// and validate throughout the routes
const cookieParser = require("cookie-parser");

//Connecting to the database
connectDB();

// Launching express server and using the port specified in the .env file
// or 5000 if not specified
const app = express();
const port = process.env.PORT || 5000;

// Setting up the view engine to use EJS for rendering HTML templates
app.set("view engine", "ejs");

// Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.static("public")); // Middleware to serve static files from the public directory
app.use(bodyParser.urlencoded({extended: false})); // Middleware to parse URL-encoded data

// Setting up the routes for store,user and category related inner-routes
app.use("/api/store", require("./routes/storeRoutes")); 
app.use("/api/user",require("./routes/userRoutes"));
app.use("/api/category",require("./routes/catRoutes"));

// The initial route for the application which renders the main page views/main.ejs
app.get("/", async (req,res) => {
    res.render("main", {error_passed: "", success_passed: ""});
});

// The route for the products page which fetches random 4 products from 5 stores from the database
app.get("/products",async(req,res) => {
    // Fetching 5 random stores from the database
    const stores_five = await Store.find({},{_id:1, name:1}).limit(5)
    const products_four = []; // Array to store the products from each store

    // Looping through each store and fetching 4 random products from each store
    for (let i = 0; i < stores_five.length; i++) {
        const product = await Products.aggregate([
            { $match: { store_id: stores_five[i]._id } },
            { $project: { id: 1, name: 1, price: 1, image_location: 1 } },
            { $sample: { size: 4 } }
        ]);
        products_four.push([stores_five[i].name,product]); // Pushing the store name and products to the array
    }

    // Filtering out the stores that have no products
    const clean_products = products_four.filter(products => products[1].length > 0);

    res.render("products", {products_four: clean_products}); // Rendering the products page with the fetched products
})

//@desc Checks if the user cookie exists. Used in public\js\entrance_functions\login.js
//@route GET /check
//@access public
app.get("/check", asyncHandler(async (req,res) => {
    // Getting the user and store cookies from the request
    const user_cookie = req.cookies.user_access_token;
    const store_cookie = req.cookies.store_access_token;

    //The first priority is store account, so we check if the store cookie exists
    // Then user cookie, and finally if neither exists nothing happens on the front end.
    if (store_cookie) {
        //Send the signal to the login.js file to handle the store account loading
        res.status(200).send("Store Account");
    } else if (user_cookie) {
        res.status(200).send("User Account");
    } else {
        res.status(200).send("No Account");
    }
}));

//Launching the server on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})