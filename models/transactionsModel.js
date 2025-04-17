const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Products"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Stores"
    },
    purchase_date: {
        type: Date,
        required: true
    },
    quantity: {
        type: Int32Array,
        required: true
    }
})

module.exports = mongoose.model("Transactions", transactionSchema);