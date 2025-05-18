const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Product = require("../models/productsModel");
const Cart = require("../models/cartModel");
const Transaction = require("../models/transactionsModel");
const mongoose = require("mongoose");
const fs = require("fs");

//@desc Renders the add product sidebar from views/store/product_add.ejs
//@route GET /api/store/product/add-page
//@access private
const addProductPage = asyncHandler(async (req, res) => {
    res.status(200).render("store/product_add", {});
})


//@desc Add a Product
//@route POST /api/store/product/add
//@access private
const addProduct = asyncHandler(async (req, res) => {
    //Get the data from the request body
    const { name, description, price, pay_by_installment, category } = req.body;

    //Check if the data input is valid, if not return a 406 error
    if (!name || !description || !price || !category) {
        return res.status(406).send("All fields are mandatory for adding a new product.")
    }

    //Find the product in the database to check if a product with the same name exists
    // If it does, return a 406 error
    const product = await Product.findOne({ name: name.trim(), store_id: req.storeID });
    if (product) {
        return res.status(406).send("There is already a product with this name. Please make the name unique.");
    }

    //Check if the category passed exists in the database, if not create it
    let category_search = await Category.findOne({ name: category.trim(), store_id: req.storeID })
    if (!category_search) {
        category_search = await Category.create({ name: category.trim(), store_id: req.storeID });
    }

    //Save the file path of the image uploaded to be used in the database when adding the product
    let filePath = null;
    if (req.file) {
        filePath = `/uploads/${req.file.filename}`;//save the file path
    }

    // Create the product in the database
    const productCreated = await Product.create({
        name: name.trim(),
        description: description.trim(),
        price,
        pay_by_installment: (pay_by_installment == "on") ? true : false,
        category_id: category_search.id,
        store_id: req.storeID,
        image_location: filePath
    })

    //Check if the product was created successfully, if not return a 400 error
    if (productCreated) {
        return res.status(201).send("Product added successfully! Page will now reload.");
    } else {
        return res.status(400).send("An error occured and the product was not added");
    }
})

//@desc Remove a Product
//@route DELETE /api/store/product/delete/:id
//@access private
const deleteProduct = asyncHandler(async (req, res) => {
    //check if the product exists in the database
    //if it does not exist, return a 404 error
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send("Product does not exist!")
    }

    //check if the product belongs to the store
    //if it does not belong to the store, return a 403 error
    if (product.store_id.toString() != req.storeID) {
        return res.status(403).send("You can't delete this product since it belongs to another store.")
    }

    //check if the category the product is under has this as the last product, if so, delete the category
    const products = await Product.find({ category_id: product.category_id });
    if (products.length == 1) {
        //delete the category
        await Category.deleteOne({ _id: product.category_id });
    }

    //delete the image of the product
    fs.unlinkSync(`public${product.image_location}`)

    //deleting all cart and transactions that fall under the product deleting
    await Cart.deleteMany({ product_id: req.params.id });
    await Transaction.deleteMany({ product_id: req.params.id });

    //deleting the product
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).send("Successfully deleted the product! Page will now reload.");

})

//@desc Load the update product page
//@route POST /api/store/product/update-page
//@access private
const updateProductPage = asyncHandler(async (req, res) => {
    //Get the current product data from the request body
    const { category, name, description, price, installment } = req.body;
    //Fix the format of the price to remove the dollar sign
    const formattedPrice = price.replace("$", "");
    let formattedInstallment = 2; //default value for installment is 2, meaning it cannot be paid in installments

    //Check if the installment value is "Can be paid in installments", if so, set the formattedInstallment to 1
    if (installment == "Can be paid in installments") {
        formattedInstallment = 1;
    }

    //Render the update product page with the current product data so the user can modify it
    res.status(200).render("store/product_update", { category: category.trim(), name: name.trim(), price: formattedPrice, description, installment: formattedInstallment });
})

//@desc Update a product
//@route POST /api/store/product/update/
//@access private
const updateProduct = asyncHandler(async (req, res) => {
    //Get the new data from the request body which includes the modified data as wel
    const { product_name_modifying, name, description, price, installment, product_id } = req.body;

    //Check if another product with the same name exists in the database
    //If it does, return a 403 error
    const product_search = await Product.findOne({ name: name.trim(), store_id: req.storeID });
    if (product_search && (product_search.name).trim() != product_name_modifying.trim()) {
        return res.status(403).send("You cannot use this name since another product exists already under your store.")
    }

    //Update the product in the database with the new data
    const result = await Product.updateOne({ _id: product_id }, { name: name.trim(), description: description.trim(), price, pay_by_installment: installment });

    //Check if the product was updated successfully, if not return a 400 error
    if (result) {
        return res.status(200).send("Updated the product information!");
    } else {
        return res.status(400).send("Error when trying to update");
    }
})


//@desc Get limited product count
//@route GET /api/store/product/limited/:skip/:limit/
//@access private
const getLimitedProducts = asyncHandler(async (req, res) => {
    //Get the skip value from the request parameters which signals how many products
    //to skip when fetching the products from the database.
    //The limit is set to 16, meaning 16 products will be fetched at a time and shown in 1 page
    //User can use back/next buttons to navigate through the pages
    const skip = parseInt(req.params.skip);
    const limit = 16;

    // Get the total count for calculating products left to make pagination proper and disable
    // the next button when there are no more products to show
    const totalProducts = await Product.countDocuments({ store_id: req.storeID });
    const products_left = totalProducts - skip - limit;

    // Using aggregate to fetch products with category and store data in one query
    const products = await Product.aggregate([
        { $match: { store_id: new mongoose.Types.ObjectId(req.storeID) } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $lookup: {
                from: "stores",
                localField: "store_id",
                foreignField: "_id",
                as: "store"
            }
        },
        { $unwind: "$category" },
        { $unwind: "$store" },
        {
            $project: {
                id: "$_id",
                name: 1,
                description: 1,
                price: 1,
                pay_by_installment: 1,
                image_location:1,
                category: "$category.name",
                store: "$store.name"
            }
        }
    ]);

    // Render the store dashboard with the products data
    return res.render("store/store_dashboard", {
        products,
        skip_val: skip,
        products_left
    });
})

module.exports = { addProductPage, addProduct, deleteProduct, getLimitedProducts, updateProductPage, updateProduct};