// This middleware is  used to UPLOAD AND STORE images (products and store pic) in the /public/uploads folder

const multer = require("multer");
const path = require("path")

//Configuring multer for storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads")); // Save files in the "uploads" folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname); // Create a unique filename
    }
});

// Initialize multer
const upload = multer({ storage: storage });

module.exports = { storage, upload };