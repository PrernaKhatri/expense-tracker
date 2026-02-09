const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const validate = require("../middlewares/validate.middleware");
const createExpenseSchema = require("../common/validations/expenseValidation");

router.post("/expense",validate(createExpenseSchema),expenseController.addExpense);

router.get("/expense",expenseController.getExpense)

router.delete("/expense/:expense_id",expenseController.deleteExpense);

module.exports = router