const AppError = require('../utils/appError');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'body' ? req.body : req.params;
    const { error } = schema.validate(data);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
}

module.exports = validate;
