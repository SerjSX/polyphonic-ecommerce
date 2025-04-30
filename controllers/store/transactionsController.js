const asyncHandler = require("express-async-handler");
const Product = require("../../models/productsModel");
const Transaction = require("../../models/transactionsModel");

//@desc get current transactions
//@route GET /api/store/transactions
//@access private
const getTransactions = asyncHandler(async (req,res) => {
    const transactions = await Transaction.find({store_id: req.storeID, order_status: /accepted|pending|rejected/});
    const return_arr = []

    if (transactions.length === 0) {
        res.status(404);
        throw new Error("No transactions found for this store!");
    }

    for (let i = 0; i < transactions.length; i++) {
        const product = await Product.findById(transactions[i].product_id, {name: 1, price: 1});
        return_arr.push({id: transactions[i]._id, name: product.name, price: product.price, status: transactions[i].order_status, purchase_date: transactions[i].purchase_date});    
    }

    res.status(200).render("store/transactions", {transactions: return_arr});
});

//@desc update a transaction
//@route POST /api/store/transaction/set-status/:transaction_id-:status
//@access private
const updateTransactionStatus = asyncHandler(async (req,res) => {
    const transaction_id = req.params.id;
    const change_to_status = req.params.status;

    const transaction_search = await Transaction.find({_id: transaction_id});

    if (transaction_search.length == 0) {
        res.status(404);
        throw new Error("This transaction does not exist")
    }

    const transaction_updated = await Transaction.updateOne({_id: transaction_id}, {order_status: change_to_status});

    if (transaction_updated) {
        return res.status(200).send("Updated status successfully");
    } else {
        return res.status(400).send("Error when trying to update");
    }
})

module.exports = {getTransactions, updateTransactionStatus};