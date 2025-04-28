const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
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
    }

})

module.exports = mongoose.model("Carts", cartSchema);