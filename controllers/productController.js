const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Store = require("../models/storesModel");
const Product = require("../models/productsModel");

//@desc Add a Product
//@route POST /api/stores/product/add
//@access private
const addProduct = asyncHandler(async (req,res) => {
    const {name,description,price,pay_by_installment,category} = req.body;

    if (!name || !description || !price || !pay_by_installment || !category) {
        res.status(400);
        throw new Error("All fields are mandatory for adding a new product.")
    }

    const product = await Product.findOne({name});

    if (product) {
        res.status(400);
        throw new Error("There is already a product with this name. Please make the name unique.");
    }

    const category_search = await Category.findOne({name: category, store_id: req.storeID})

    if (!category_search) {
        res.status(400);
        throw new Error("This category does not exist, please create it beforehand");
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
        res.status(201).redirect("/product/add");
    } else {
        res.status(400);
        throw new Error("An error occured and the product was not added");
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
    res.status(200).redirect("/api/stores/product/limited/0/10");

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
//@route GET /api/store/product/limited/:skip/:limit/:storeID
//@access private
const getLimitedProducts = asyncHandler(async (req,res) => {
    const skip = req.params.skip;
    const limit = req.params.limit;

    let products;

    /*
    if (!store_id) {
        if (!limit) {
            products = await Product.find().skip(skip);
        } else {
            products = await Product.find().skip(skip).limit(limit);
        }
    } else {*/
    if (!limit) {
        products = await Product.find({store_id: req.storeID}).skip(skip);
    } else {
        products = await Product.find({store_id: req.storeID}).skip(skip).limit(limit);
    }
    //}

    res.render("store_dashboard", {products});
    //res.status(200).json(await getInfo(products));

})

//@desc accepts an array of products, loops and returns a formatted information with store and category names
async function getInfo(products) {
    let return_arr = []
    for (let i = 0; i < products.length; i++) {
        product = products[i];

        const category = await Category.findById(product.category_id);
        const store = await Store.findById(product.store_id);

        return_arr.push({name: product.name, description: product.description, price: product.price, 
            pay_by_installment: product.pay_by_installment, category: category.name, store: store.name})
    }

    return return_arr;
}

module.exports = {addProduct, deleteProduct, getProductInfo, getLimitedProducts};