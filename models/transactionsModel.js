const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Products"
        },
        store_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Stores"
        },
        single_order_status: {
            type: String,
            default: "pending", //can be pending, accepted, rejected, or completed
        }
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    purchase_date: {
        type: Date,
        required: true
    },
    order_status: {
        type: String,
        default: "pending", //can be pending, accepted, rejected, or completed
    }
})

module.exports = mongoose.model("Transactions", transactionSchema);