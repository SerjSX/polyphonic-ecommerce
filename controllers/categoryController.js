const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Product = require("../models/productsModel");
const Transaction = require("../models/transactionsModel");
const Cart = require("../models/cartModel");

//@desc Add a category. This function is no longer needed as adding a product 
//                      automatically checks if there is the passed category and creates
//                      a new one if does not exist.
//                      This function DOES NOT cooperate with the frontend, nor has a route.
//@route POST /api/stores/category/add
//@access private
const addCategory = asyncHandler(async (req,res) => {
    const name = req.body.name; // Get the name of the category from the request body

    // Check if the name is provided, if not send a 400 status with a message
    if (!name) {
        return res.status(400).send("You have to include the name of the category");
    }

    // Check if the category already exists in the database for the store
    // If it does, send a 401 status with a message
    const categoryCheck = await Category.findOne({name, store_id: req.storeID});
    if (categoryCheck) {
        return res.status(401).send("This category already exists under your store");
    }

    // Create a new category in the database with the provided name and store ID
    const category = await Category.create({
        name,
        store_id: req.storeID
    })

    // Check if the category was created successfully, if not send a 400 status with a message
    // If it was created successfully, send a 201 status with the name and store name
    if (category) {
        res.status(201).json({name:name, store:req.storeName})
    } else {
        res.status(400).send("An error occured and the category was not created");
    }

})

//@desc Delete a category
//@route DELETE /api/stores/category/delete/:id
//@access private
const deleteCategory = asyncHandler(async (req,res) => {
    // Get the category ID from the request parameters and check if it exists in the database
    // If it does not exist, send a 404 status
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).send("Category not found");
    }

    // Check if the store ID of the category matches the store ID of the request
    // If it does not match, send a 403 status with a message
    if(category.store_id.toString() !== req.storeID) {
        return res.status(403).send("Store does not have permission to delete other store's categories");
    }

    //Finding the products of the category to delete
    const products = await Product.find({category_id: category._id});

    // Deleting the products one by one from the category, including any cart items and trasnactions
    // concerning the same product ids that are being deleted.
    for (let i = 0; i < products.length; i++) {
        const product_id = products[i].id;

        await Cart.deleteMany({product_id: product_id});
        await Transaction.deleteMany({product_id: product_id});
    }
    
    //deleting the products first
    await Product.deleteMany({category_id: category._id});

    //deleting the category
    await Category.deleteOne({_id: req.params.id});

    //Sending a success response back for jquery to handle
    res.status(200).send("Successfully deleted the category"); 
})

//@desc Get all categories of a store
//@route GET /api/category/get/:id @desc for users
//@route2 GET /api/store/category/get/ @desc for stores
//@access private
const getCategories = asyncHandler(async (req,res) => {
    let store_id_passed; // Variable to store the store ID passed in the request

    // Check if the request has a specific store parameter ID, if not use the store ID logged in meaning
    // to get the categories of the store logged in.
    if (!req.params.id) {
        store_id_passed = req.storeID;
    } else {
        [store_name,store_id_passed] = (req.params.id).split("-");
    }

    //Finding the categories of the store
    const categories = await Category.find({store_id: store_id_passed})

    // If there are no categories for the store, send a 200 status with a message
    if (!categories) {
        res.status(200).json({message: "No categories for this store."})
    } else {
        //if the paramether id exists then this means this was requested from the 
        // user to see the categories of a specific store, or else it would already give
        // the results of the current store if it was requested from the store.
        // This will take the results and send it to the category dashboard to display the 
        // categories of the store chosen.
        if (req.params.id) {
            res.status(200).render("user/store/see_store", {store_id: store_id_passed, store_name, categories})
        } else {
            res.status(200).render("store/category", {categories});
        }
    }
})

//@desc Get the products of a certain category
//@route GET /api/category/get-products/:information/:skip
//@access private
const getCategoryProducts = asyncHandler(async (req,res) => {
    // Get the store name, store ID, category name, and category ID from the request parameters
    const [store_name,store_id,category_name,category_id] = req.params.information.split("-");

    //Find the products of the category and skip the number of products passed in the request
    // and limit the number of products to 21 for each page.
    const products = await Product.find({category_id}).skip(req.params.skip).limit(21).lean();

    // This variable stores the number of products left in the category after skipping the number of products passed in the request
    // this is needed for the ejs file to render the next/back page buttons correctly and disable them 
    // whenever needed.
    const products_left = (await Product.countDocuments({category_id})) - req.params.skip - 21;

    // If there are no products for the category, send a 404 status with a message
    // If there are products, render the category products page with the store name, store ID,
    if (!products) {
        res.status(404).json({message: "No products found on this page"});
    } else {
        //lines 103-115:
        // If skip_val is <= than 0, then there is no products to show on back page hence the button is disabled since the skip value is 0.
        // If products_left is <= 0, then there is no products to show on next page hence the button is disabled.
        res.status(200).render("user/store/category_products", {store_name, store_id, category_name, category_id, products, skip_val: req.params.skip, products_left});
    }
})

module.exports = {addCategory, deleteCategory, getCategories, getCategoryProducts};