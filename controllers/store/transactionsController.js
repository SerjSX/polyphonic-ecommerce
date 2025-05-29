const asyncHandler = require("express-async-handler");
const Transaction = require("../../models/transactionsModel");
const mongoose = require("mongoose");

//@desc get current transactions
//@route GET /api/store/transactions
//@access private
const getTransactions = asyncHandler(async (req, res) => {
    // Getting the transactions for the store based on the store ID. 
    // Also combining product information with the transactions from the products collection to provide information.
    // It ignores completed transactions.
    const transactions = await Transaction.aggregate([
        {
            $match: {
                "products.store_id": new mongoose.Types.ObjectId(req.storeID),
                order_status: { $ne: "completed" }
            }
        },
        {
            $addFields: {
                products: {
                    $filter: {
                        input: "$products",
                        cond: { $eq: ["$$this.store_id", new mongoose.Types.ObjectId(req.storeID)] }
                    }
                }
            }
        },
        {
            $unwind: "$products"
        },
        {
            $lookup: {
                from: "products",
                localField: "products.product_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        {
            $unwind: "$productInfo"
        },
        {
            $addFields: {
                "products.name": "$productInfo.name",
                "products.price": "$productInfo.price"
            }
        },
        {
            $group: {
                _id: "$_id",
                products: { $push: "$products" },
                order_status: { $first: "$order_status" },
                purchase_date: { $first: "$purchase_date" },
                user_id: { $first: "$user_id" }
            }
        }
    ]);

    if (transactions.length === 0) {
        return res.status(404).send("No transactions found for this store!");
    }

    res.status(200).render("store/transactions", { transactions });
});

//@desc update a transaction
//@route POST /api/store/transaction/set-status/:transaction_id/:product_id/:status
//@access private
const updateTransactionStatus = asyncHandler(async (req, res) => {
    const transaction_id = req.params.transaction_id;
    const product_id = req.params.product_id;
    const change_to_status = req.params.status;

    // Checking the status change passed.
    if (change_to_status !== "accepted" &&
        change_to_status !== "rejected" &&
        change_to_status !== "completed") {
        return res.status(400).send("Invalid status change");
    };

    // Updates the transaction matching the same product id in the array and the same
    // store id logged in, and changing the single product's order status to the new one
    // again with filtering the array to find the correct product.
    const transaction_updated = await Transaction.updateOne(
        { 
            _id: transaction_id,
            "products.product_id": new mongoose.Types.ObjectId(product_id),
            "products.store_id": new mongoose.Types.ObjectId(req.storeID)
        },
        { $set: { "products.$[elem].single_order_status": change_to_status } },
        {
            arrayFilters: [{
                "elem.product_id": new mongoose.Types.ObjectId(product_id),
                "elem.store_id": new mongoose.Types.ObjectId(req.storeID)
            }]
        }
    );

    // Checking the order status of all the products in the transaction to change
    // the main transaction's status immediately.
    // Getting the transaction again to check the status of all products.
    const transaction = await Transaction.findById(transaction_id);

    // Setting the first product's status as the beginning status to compare with others.
    const begin_status = transaction.products[0]?.single_order_status;

    // Checking if all products have the same status as the first product's status.
    const all_same = transaction.products.every(p => p.single_order_status === begin_status);

    // If all of the products have the same status, then we can update the main transaction's status to the same status.
    if (all_same) {
        await Transaction.updateOne(
            { _id: transaction_id },
            { $set: { order_status: begin_status } }
        );
    } else {
        // If not all products have the same status, we can set the main transaction's status to "pending".
        await Transaction.updateOne(
            { _id: transaction_id },
            { $set: { order_status: "pending" } }
        );
    }

    // If no documents were matched, it means the transaction or product does not exist. Or else send a success message.
    if (transaction_updated.matchedCount === 0) {
        return res.status(404).send("This transaction does not exist")
    } else {
        return res.status(200).send("Updated status successfully");
    }
})

module.exports = { getTransactions, updateTransactionStatus };