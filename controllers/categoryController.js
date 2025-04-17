const asyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");

//@desc Add a category
//@route POST /api/stores/category/add
//@access private
const addCategory = asyncHandler(async (req,res) => {
    const name = req.body.name;

    if (!name) {
        res.status(400);
        throw new Error("You have to include the name of the category");
    }

    const categoryCheck = await Category.findOne({name, store_id: req.storeID});
    console.log(categoryCheck);

    if (categoryCheck) {
        res.status(401);
        throw new Error("This category already exists under your store");
    }

    console.log(req.storeID)

    const category = await Category.create({
        name,
        store_id: req.storeID
    })

    if (category) {
        res.status(201).json({name:name, store:req.storeName})
    } else {
        res.status(400);
        throw new Error("An error occured and the category was not created");
    }

})

//@desc Delete a category
//@route DELETE /api/stores/category/delete/:id
//@access private
const deleteCategory = asyncHandler(async (req,res) => {
    //search for the category
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if(category.store_id.toString() !== req.storeID) {
        res.status(403);//not authorized to update the contact of another store
        throw new Error("Store does not have permission to update other store's categories");
    }

    await Category.deleteOne({_id: req.params.id});//function to delete a record
    //first sending success status then sending in JSON format a message
    res.status(200).json(category); 
})

//@desc Get all categories of a store
//@route DELETE /api/stores/category/:id
//@access private
const getCategories = asyncHandler(async (req,res) => {
    let store_id_passed;
    if (!req.params.id) {
        store_id_passed = req.storeID;
    } else {
        store_id_passed = req.params.id;
    }

    const categories = await Category.find({store_id: store_id_passed})

    if (!categories) {
        res.status(200).json({message: "No categories for your store."})
    } else {
        res.status(200).json(categories)
    }
})

module.exports = {addCategory, deleteCategory, getCategories};