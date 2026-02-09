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
            type : Number,
            required : true,
            min : 1          
        },

        date : {
            type : Date,
            required : true
        }
    },   
    {
        versionKey : false,
    }
)
module.exports = mongoose.model("Expense",expenseSchema);