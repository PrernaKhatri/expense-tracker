const response = require("../common/response");
const expense = require("../models/expense.model");

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, date } = req.body;

        const newExpense = await expense.create({ title, amount, date });

        return response.success(res, "Expense added successfully", {
            expense_id: newExpense._id
        });
    }
    catch (error) {
        console.log(error.message);
        return response.error(res, 500, "Internal server error.")
    }
}

exports.getExpense = async (req, res) => {
    try {
        const { filter, month, year, search = '', date='' } = req.query;
        let query = {}
        const now = new Date();

        const isFiltered = !!(filter || month);

        if (filter === "today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        if (month) {
            const getYear = year || now.getFullYear();
            const start = new Date(getYear, parseInt(month) - 1, 1);
            const end = new Date(getYear, parseInt(month), 0, 23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        if (search) {
            const isNum = !isNaN(search);            
            if (isNum) {
                query.amount = Number(search);
            }           
            else{
                query.title = {$regex : search, $options : 'i'}
            }
        } 

        if(date){
            const searchDate = new Date(date);
            const start = new Date(searchDate);
                start.setHours(0, 0, 0, 0);

                const end = new Date(searchDate);
                end.setHours(23, 59, 59, 999);

                query.date = {$gte : start, $lte : end};
        }

        const expenses = await expense.find(query);

        if (!expenses || expenses.length === 0) {
            return response.error(res, 404, "Expenses not found.");
        }

        if (isFiltered) {
            const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            return response.success(res, "Expenses fetched.", {
                totalAmount,
                count: expenses.length,
                expenses
            });
        }

        return response.success(res, "Expenses fetched.", expenses);
    }
    catch (error) {
        console.log(error.message);
        return response.error(res, 500, "Internal server error.");
    }
}


exports.deleteExpense = async (req, res) => {
    try {
        const { expense_id } = req.params;

        if (!expense_id) {
            return response.error(res, 404, "Expense not found.")
        }

        await expense.findByIdAndDelete(expense_id);
        return response.success(res, "Expense deleted successfully.")
    }
    catch (error) {
        console.error(error);
        return response.error(res, 500, "Internal server error")
    }
}