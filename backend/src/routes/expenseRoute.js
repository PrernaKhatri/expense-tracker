const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.post("/expense",expenseController.addExpense);

router.get("/expense",expenseController.getExpense)

module.exports = router