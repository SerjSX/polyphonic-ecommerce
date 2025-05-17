const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Product = require("../models/productsModel");
const Cart = require("../models/cartModel");
const Transaction = require("../models/transactionsModel");
const mongoose = require("mongoose");

//@desc Get Add Product page
//@route GET /api/store/product/add-page
//@access private
const addProductPage = asyncHandler(async (req, res) => {
    res.status(200).render("store/product_add", {});
})

//@desc Add a Product
//@route POST /api/store/product/add
//@access private
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, pay_by_installment, category } = req.body;

    if (!name || !description || !price || !category) {
        //406 is for not acceptable input
        return res.status(406).send("All fields are mandatory for adding a new product.")
    }

    const product = await Product.findOne({ name, store_id: req.storeID });

    if (product) {
        return res.status(406).send("There is already a product with this name. Please make the name unique.");
    }

    let category_search = await Category.findOne({ name: category, store_id: req.storeID })

    if (!category_search) {
        category_search = await Category.create({ name: category, store_id: req.storeID });
    }

    let filePath = null;
    if (req.file) {
        filePath = `/uploads/${req.file.filename}`;//save the file path
    }
    console.log(filePath);

    const productCreated = await Product.create({
        name,
        description,
        price,
        pay_by_installment: (pay_by_installment == "on") ? true : false,
        category_id: category_search.id,
        store_id: req.storeID,
        image_location: filePath
    })

    if (productCreated) {
        return res.status(201).send("Success");
    } else {
        return res.status(400).send("An error occured and the product was not added");
    }
})

//@desc Remove a Product
//@route DELETE /api/store/product/delete/:id
//@access private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).send("Product does not exist!")
    }

    if (product.store_id.toString() != req.storeID) {
        return res.status(403).send("You can't delete this product since it belongs to another store.")
    }


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
    const { category, name, description, price, installment } = req.body;
    const formattedPrice = price.replace("$", "");
    let formattedInstallment = 2;

    if (installment == "Can be paid in installments") {
        formattedInstallment = 1;
    }

    res.status(200).render("store/product_update", { category, name, price: formattedPrice, description, installment: formattedInstallment });
})

//@desc Update a product
//@route POST /api/store/product/update/
//@access private
const updateProduct = asyncHandler(async (req, res) => {
    const { product_name_modifying, name, description, price, installment, product_id } = req.body;

    const product_search = await Product.findOne({ name: name, store_id: req.storeID });
    if (product_search) {
        return res.status(403).send("You cannot use this name since another product exists already under your store.")
    }

    //implement updating the data of the product_id passed.
    const result = await Product.updateOne({ _id: product_id }, { name, description, price, pay_by_installment: installment });

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
    const skip = parseInt(req.params.skip);
    const limit = 16;

    // Get the total count for calculating products left
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

    if (!products || products.length === 0) {
        return res.render("store/store_dashboard", {
            products,
            skip_val: skip,
            products_left
        });;
    } else {
        res.render("store/store_dashboard", {
            products,
            skip_val: skip,
            products_left
        });
    }
})

//@desc Search for products
//@route GET /api/product/searc/:searchkey
//@access public


module.exports = { addProductPage, addProduct, deleteProduct, getLimitedProducts, updateProductPage, updateProduct};