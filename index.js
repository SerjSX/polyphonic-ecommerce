const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");

// cookieParser is used to store the login token as a cookie to access
// and validate throughout the routes
const cookieParser = require("cookie-parser");
const storeValidation = require("./middleware/validateStore");

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");

app.use(cookieParser()); 
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

app.use("/api/stores", require("./routes/storeRoutes")); 
app.use("/api/users",require("./routes/userRoutes"));

app.get("/product/add", storeValidation, (req,res) => {
    res.render("product_add", {});
})

app.get("/store/login", (req,res) => {
    res.render("login", {type_user: "Store"});
})

app.get("/store/register", (req,res) => {
    res.render("register", {type_user: "Store"});
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})