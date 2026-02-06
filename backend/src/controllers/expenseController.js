const response = require("../common/response");
const expense = require("../models/expense.model");

exports.addExpense = async(req,res) => {
    try{
        const {title, amount, date} = req.body;

        const newExpense = await expense.create({title,amount,date});

        return response.success(res,"Expense added successfully",{
            expense_id : newExpense._id
        });
    }
    catch(error){
        console.log(error.message);
        return response.error(res, 500, "Internal server error")
    }
}

exports.getExpense = async(req,res) => {
    try{
        const expenses = await expense.find();
        return response.success(res, "Expenses successfully fetched.", expenses)
    }
    catch(error){
        console.log(error.message);
        return response.error(res, 500, "Internal server error");
    }
}