const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const bodyParser = require('body-parser');
const asyncHandler = require("express-async-handler");

//Models
const Store = require("./models/storesModel");
const Products = require("./models/productsModel");

// cookieParser is used to store the login token as a cookie to access
// and validate throughout the routes
const cookieParser = require("cookie-parser");
const storeValidation = require("./middleware/validateStore");
const userValidation = require("./middleware/validateUser");
const { getStores } = require("./controllers/storeController");

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(cookieParser()); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

app.use("/api/store", require("./routes/storeRoutes")); 
app.use("/api/user",require("./routes/userRoutes"));
app.use("/api/category",require("./routes/catRoutes"));

app.get("/", async (req,res) => {

    res.render("main", {error_passed: "", success_passed: ""});
});

app.get("/products",async(req,res) => {
    const stores_five = await Store.find({},{_id:1, name:1}).limit(5)
    const products_four = [];

    for (let i = 0; i < stores_five.length; i++) {
        const product = await Products.find({store_id: stores_five[i]._id}, {id:1,name:1,price:1, image_location:1}).limit(4)
        products_four.push([stores_five[i].name,product]);
    }

    const clean_products = products_four.filter(products => products[1].length > 0);
    console.log(clean_products);

    res.render("products", {products_four})
})

// To get an HTML template from the public/templates directory
app.get("/templates/:templateName", (req,res) => {
    const templateName = req.params.templateName;
    res.sendFile(Path2D.join(__dirname, "public", "templates", templateName));
})

app.get("/product/add", storeValidation, (req,res) => {
    res.render("store/product_add", {});
})

app.get("/store/login", (req,res) => {
    if (req.cookies.store_access_token) {
        res.redirect("/api/store/product/limited/16/");
    } else {
         res.render("login", {type_user: "Store", error: "none"});
    }
})

app.get("/store/register", (req,res) => {
    res.render("store/register");
})

app.get("/user/login", (req,res) => {
    if (req.cookies.user_access_token) {
        res.redirect("/user");
    } else {
         res.render("login", {type_user: "User", error: "none"});
    }

})

app.get("/user/register", (req,res) => {
    res.render("user/register");
})

//@desc Checks if the user cookie exists
//@route GET /check
//@access public
app.get("/check", asyncHandler(async (req,res) => {
    const user_cookie = req.cookies.user_access_token;
    const store_cookie = req.cookies.store_access_token;

    if (store_cookie) {
        res.status(200).send("Store Account");
    } else if (user_cookie) {
        res.status(200).send("User Account");
    } else {
        res.status(200).send("No Account");
    }
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})