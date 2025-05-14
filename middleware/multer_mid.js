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
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            return cb("Error: Images only!");
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 } // Limit file size to 2MB
});

module.exports = { storage, upload };