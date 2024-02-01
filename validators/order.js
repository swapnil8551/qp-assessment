const Joi = require('joi');

module.exports.inventoryDataSchema = Joi.array().items(
    Joi.object({
      grocery_item_id: Joi.string().guid({ version: 'uuidv4' }).required(),
      quantity: Joi.number().integer().min(0).required()
    })
  ).min(1);