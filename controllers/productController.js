const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Store = require("../models/storesModel");
const Product = require("../models/productsModel");
const Cart = require("../models/cartModel");
const Transaction = require("../models/transactionsModel");

//@desc Add a Product
//@route POST /api/stores/product/add
//@access private
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, pay_by_installment, category } = req.body;

    console.log(pay_by_installment);

    if (!name || !description || !price || !category) {
        res.send("All fields are mandatory for adding a new product.")
    }

    const product = await Product.findOne({ name, store_id: req.storeID });

    if (product) {
        return res.send("Product Exists");
    }

    let category_search = await Category.findOne({ name: category, store_id: req.storeID })

    if (!category_search) {
        category_search = await Category.create({ name: category, store_id: req.storeID });
    }

    const productCreated = await Product.create({
        name,
        description,
        price,
        pay_by_installment,
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
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product does not exist!")
    }

    if (product.store_id.toString() != req.storeID) {
        res.status(403);
        throw new Error("You can't delete this product since it belongs to another store.")
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
    if (product_search && product_search.name != product_name_modifying) {
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

//@desc Get info of a product
//@route GET /api/store/product/:id
//@access public
const getProductInfo = asyncHandler(async (req, res) => {
    const id = req.params.id;
    let products;

    if (!id) {
        products = await Product.find({ store_id: req.storeID });
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
const getLimitedProducts = asyncHandler(async (req, res) => {
    const skip = req.params.skip;
    const limit = req.params.limit;

    let products;

    if (!limit) {
        products = await Product.find({ store_id: req.storeID }).skip(skip);
    } else {
        products = await Product.find({ store_id: req.storeID }).skip(skip).limit(limit);
    }

    const products_left = (await Product.countDocuments({ store_id: req.storeID })) - skip - 2;

    if (!products) {
        res.status(404).json({ message: "You don't have products!" })
    } else {
        res.render("store/store_dashboard", { products: await getInfo(products), skip_val: skip, products_left });
    }

})

//@desc accepts an array of products, loops and returns a formatted information with store and category names
async function getInfo(products) {
    let return_arr = []
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        const category = await Category.findById(product.category_id);
        const store = await Store.findById(product.store_id);

        return_arr.push({
            id: product.id, name: product.name, description: product.description, price: product.price,
            pay_by_installment: product.pay_by_installment, category: category.name, store: store.name
        })
    }

    return return_arr;
}

module.exports = { addProduct, deleteProduct, getProductInfo, getLimitedProducts, getInfo, updateProductPage, updateProduct };