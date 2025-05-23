const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please type your name"]
    },
    email: {
        type: String,
        required: [true, "You have to include an email"]
    },
    password: {
        type: String,
        required: [true, "You have to enter a password"]
    },
    age: {
        type: Number,
        required: [true, "You have to include your age to access the online store"]
    },
    address: {
        type: String,
        required: [true, "You have to include your address"]
    },
    phone_number: {
        type: String,
        required: [true, "You have to include your phone number"]
    }
})

module.exports = mongoose.model("Users", userSchema);