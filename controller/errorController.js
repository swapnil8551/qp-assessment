require('dotenv').config();

const sendErrorDev = (err, req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      stack: err.stack,
      message: err.message || 'Please try again, there seems to be an issue',
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Please try again, there seems to be an issue',
    msg: err.message,
  });
  next();
};


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  sendErrorDev(err, req, res, next);

};
