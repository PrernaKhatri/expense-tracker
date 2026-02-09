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
        return response.error(res, 500, "Internal server error.")
    }
}

exports.getExpense = async(req,res) => {
    try{
        const {filter, month} = req.query;

        if(!filter){
            const expenses = await expense.find();
            return response.success(res, "Expenses successfully fetched.", expenses);
        }

        if(filter === "today"){
            const start = new Date();
            start.setHours(0,0,0,0);

            const end = new Date();
            end.setHours(23,59,59,999);

            const todayExpenses = await expense.aggregate([
                {$match : {date : {$gte : start, $lte : end}}},
                {$group : {
                    _id : "$date",
                    totalAmount : {$sum : "$amount"}
                }}
            ])

            if(todayExpenses.length === 0){
                return response.error(res, 404, "No expenses for today.")
            }
           
            return response.success(res, "Today's expenses successfully calculated.", todayExpenses);

        }

        if(month){
            const months = await expense.find(date.getMonth(month));
            return response.success(res, "Expenses for the month are successfully calculated.", months);
        }
        
    }
    catch(error){
        console.log(error.message);
        return response.error(res, 500, "Internal server error.");
    }
}

exports.deleteExpense = async(req,res) => {
    try{
        const {expense_id} = req.params;

        if(!expense_id){
            return response.error(res, 404, "Expense not found.")
        }

        await expense.findByIdAndDelete(expense_id);
        return response.success(res, "Expense deleted successfully.")
    }
    catch(error){
        console.error(error);
        return response.error(res, 500, "Internal server error")
    }
}