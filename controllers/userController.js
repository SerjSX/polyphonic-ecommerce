const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

//@desc Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,age} = req.body;

    if (!name || !email || !age || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const userCheck = await User.findOne({email});

    if (userCheck) {
        res.status(400);
        throw new Error("A user is already registered with that email!");
    }

    const hashedPassword = await bcrypt.hash(password,10);
    console.log("pass: ", hashedPassword);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        age
    })

    console.log(`User created ${user}`)

    if (user) {
        res.status(201).json({_id: user.id, name: user.name, email: user.email});
    } else {
        res.status(400);
        throw new Error("User data is invalid");
    }

})

//@desc Login a User Account
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error ("All fields are necessary to add");
    }

    const user = await User.findOne({email});

    if (user && await(bcrypt.compare(password, user.password))) { //if user exists and password matches
        const accessToken = jwt.sign({
            user: {
                name: user.name,
                email: user.email,
                id: user.id
            },
        }, process.env.USER_ACCESS_TOKEN,
        {expiresIn: "15m"});
        res.status(200).json({accessToken});
    } else {
        res.status(401);
        throw new Error("Email or password is incorrect");
    }
});

module.exports = {registerUser, loginUser};