const { Op } = require('sequelize');
const OrderDetails = require('../model/OrderDetails');
const catchAsync = require('../utils/catchasync');

exports.getAllOrderDetails = catchAsync(async (req, res) => {
    const doc = await OrderDetails.findAll({});
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });