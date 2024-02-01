const express = require('express');
const OrderController = require('../controller/OrderController');
const { inventoryDataSchema } = require('../validators/order');
const validate = require('../middleware/joimiddleware');
const auth = require('../controller/authController');

const router = express.Router();
router.use(auth.protect);

router
  .route('/')
  .get(OrderController.getAllOrder)
  .post(validate(inventoryDataSchema), OrderController.createOrder);

router.route('/:id').get(OrderController.viewOrder);


router.route('/confirmorder/:id').get(OrderController.confirmOrder);


  module.exports = router;