const Joi = require('joi');

module.exports.signinCheck = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Admin', 'Enduser', 'Vendor').required(),
});