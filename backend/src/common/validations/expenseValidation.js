const Joi = require("joi");

const createExpenseSchema = Joi.object({
    title : Joi.string().trim().min(2).required(),
    amount : Joi.number().min(1).required(),
    date : Joi.date().max("now").required()
})

module.exports = createExpenseSchema;