const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Product = require("../models/productsModel");
const Transaction = require("../models/transactionsModel");
const Cart = require("../models/cartModel");

//@desc Add a category
//@route POST /api/stores/category/add
//@access private
const addCategory = asyncHandler(async (req,res) => {
    const name = req.body.name;

    if (!name) {
        res.status(400);
        throw new Error("You have to include the name of the category");
    }

    const categoryCheck = await Category.findOne({name, store_id: req.storeID});
    console.log(categoryCheck);

    if (categoryCheck) {
        res.status(401);
        throw new Error("This category already exists under your store");
    }

    console.log(req.storeID)

    const category = await Category.create({
        name,
        store_id: req.storeID
    })

    if (category) {
        res.status(201).json({name:name, store:req.storeName})
    } else {
        res.status(400);
        throw new Error("An error occured and the category was not created");
    }

})

//@desc Delete a category
//@route DELETE /api/stores/category/delete/:id
//@access private
const deleteCategory = asyncHandler(async (req,res) => {
    //search for the category
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    if(category.store_id.toString() !== req.storeID) {
        res.status(403);//not authorized to update the category of another store
        throw new Error("Store does not have permission to delete other store's categories");
    }

    //Finding the products of the category to delete
    const products = await Product.find({category_id: category._id});

    for (let i = 0; i < products.length; i++) {
        const product_id = products[i].id;

        //deleting all cart and transactions that fall under the items of the category deleting
        await Cart.deleteMany({product_id: product_id});
        await Transaction.deleteMany({product_id: product_id});
    }
    
    //deleting the products
    const product_del = await Product.deleteMany({category_id: category._id});
    console.log(product_del);

    await Category.deleteOne({_id: req.params.id});//function to delete a record
    //first sending success status then sending in JSON format a message
    res.status(200).send("Successfully deleted the category"); 
})

//@desc Get all categories of a store
//@route GET /api/category/get/:id @desc for users
//@route2 GET /api/store/category/get/ @desc for stores
//@access private
const getCategories = asyncHandler(async (req,res) => {
    let store_id_passed;
    if (!req.params.id) {
        store_id_passed = req.storeID;
    } else {
        [store_name,store_id_passed] = (req.params.id).split("-");
    }

    const categories = await Category.find({store_id: store_id_passed})

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
    const [store_name,store_id,category_name,category_id] = req.params.information.split("-");

    const products = await Product.find({category_id}).skip(req.params.skip).limit(2).lean();
    const products_left = (await Product.countDocuments({category_id})) - req.params.skip - 2;

    if (!products) {
        res.status(404).json({message: "No products found on this page"});
    } else {
        res.status(200).render("user/store/category_products", {store_name, store_id, category_name, category_id, products, skip_val: req.params.skip, products_left});
    }
})

module.exports = {addCategory, deleteCategory, getCategories, getCategoryProducts};