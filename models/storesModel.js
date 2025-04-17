const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the store's name"]
    },
    email: {
        type: String,
        required: [true, "Please enter the store's primary email address for clients"]
    },
    phone_number: {
        type: String,
    },
    founded_date: {
        type: Date,
        required: [true, "Please include the founded date of your store"]
    },
    location: {
        type: String,
        required: [true, "Please include your location"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password!"]
    }
})

module.exports = mongoose.model("Stores", storeSchema);