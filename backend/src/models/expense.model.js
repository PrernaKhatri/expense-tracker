const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true,
            minlength : 2
        },

        amount : {
            type : String,
            required : true,
            min : 0          
        },

        date : {
            type : Date,
            required : true
        }
    },   
)
module.exports = mongoose.model("Expense",expenseSchema);