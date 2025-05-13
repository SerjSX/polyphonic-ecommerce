const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the store's name"]
    },
    description: {
        type: String,
        required: [true, "Please enter the store's primary email address for clients"]
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: [true, "Please include the price of the product"]
    },
    pay_by_installment: {
        type: Boolean,
        required: [true, "Please include the option whether this product can be paid by installments or no"]
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Categories"
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Stores"
    },
    image_location: {
        type: String,
    }
})

module.exports = mongoose.model("Products", productSchema);