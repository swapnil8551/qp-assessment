const express = require('express');
const OrderDetailController = require('../controller/OrderDetailController');

const router = express.Router();

router
  .route('/')
  .get(OrderDetailController.getAllOrderDetails)


  module.exports = router;