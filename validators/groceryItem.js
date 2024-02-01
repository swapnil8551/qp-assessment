const Joi = require('joi');

module.exports.groceryItemCheck = Joi.object({
    name: Joi.string().required(),
    weight: Joi.string().required(),
    expdate_epoc: Joi.string().required(),
    price: Joi.number().precision(2).positive().required(),
    inventory_level: Joi.number().integer().positive().required()
});

module.exports.updateGroceryItemCheck = Joi.object({
    name: Joi.string(),
    weight: Joi.string(),
    expdate_epoc: Joi.string(),
    price: Joi.number().precision(2).positive(),
    inventory_level: Joi.number().integer().positive()
});