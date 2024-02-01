const Joi = require('joi');

module.exports.checkuserinfo = Joi.object({
    fullname: Joi.string().required(),
    mobileno: Joi.string().required(),
    email: Joi.string().required(),
    city: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Admin', 'Enduser', 'Vendor').required(),
});
