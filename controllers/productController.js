const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Store = require("../models/storesModel");
const Product = require("../models/productsModel");

//@desc Add a Product
//@route POST /api/stores/product/add
//@access private
const addProduct = asyncHandler(async (req,res) => {
    const {name,description,price,pay_by_installment,category} = req.body;

    if (!name || !description || !price || !category) {
        res.send("All fields are mandatory for adding a new product.")
    }

    const product = await Product.findOne({name});

    if (product) {
        return res.send("Product Exists");
    }

    const category_search = await Category.findOne({name: category, store_id: req.storeID})

    if (!category_search) {
        return res.send("No Category");
    }

    const productCreated = await Product.create({
        name,
        description,
        price,
        pay_by_installment: pay_by_installment == "on" ? 1 : 0,
        category_id: category_search.id,
        store_id: req.storeID
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
const deleteProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product does not exist!")
    }

    if(product.store_id.toString() != req.storeID) {
        res.status(403);
        throw new Error("You can't delete this product since it belongs to another store.")
    }

    await Product.deleteOne({_id: req.params.id});
    res.status(200).send("Successfully deleted the product! Page will now reload.");

})

//@desc Get info of a product
//@route GET /api/store/product/:id
//@access public
const getProductInfo = asyncHandler(async (req,res) => {
    const id = req.params.id;
    let products;

    if (!id) {
        products = await Product.find({store_id: req.storeID});
    } else {
        products = [await Product.findById(id)];
    }

    if ((products[0] == null) && (id)) {
        res.status(404);
        throw new Error("This product does not exist");
    }

    res.status(200).json(await getInfo(products));
})

//@desc Get limited product count
//@route GET /api/store/product/limited/:skip/:limit/
//@access private
const getLimitedProducts = asyncHandler(async (req,res) => {
    const skip = req.params.skip;
    const limit = req.params.limit;

    let products;

    if (!limit) {
        products = await Product.find({store_id: req.storeID}).skip(skip);
    } else {
        products = await Product.find({store_id: req.storeID}).skip(skip).limit(limit);
    }

    const products_left = (await Product.countDocuments({store_id: req.storeID})) - skip - 2;

    if (!products) {
        res.status(404).json({message: "You don't have products!"})
    } else {
        res.render("store/store_dashboard", {products: await getInfo(products), skip_val: skip, products_left});
    }

})

//@desc accepts an array of products, loops and returns a formatted information with store and category names
async function getInfo(products) {
    let return_arr = []
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        const category = await Category.findById(product.category_id);
        const store = await Store.findById(product.store_id);

        return_arr.push({id: product.id, name: product.name, description: product.description, price: product.price, 
            pay_by_installment: product.pay_by_installment, category: category.name, store: store.name})
    }

    return return_arr;
}

module.exports = {addProduct, deleteProduct, getProductInfo, getLimitedProducts, getInfo};