const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the category's name"]
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Stores"
    }
})

module.exports = mongoose.model("Categories", categorySchema);