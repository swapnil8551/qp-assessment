const { Op } = require('sequelize');
const moment = require('moment-timezone');
const Order = require('../model/Order');
const OrderDetails = require('../model/OrderDetails');
const GroceryItem = require('../model/GroceryItem');
const catchAsync = require('../utils/catchasync');
const AppError = require('../utils/appError');

 const getEpocDateNow = () => {
  return moment().unix();
};

exports.createOrder = catchAsync(async (req, res) => {
  const getCurrentEpoch = getEpocDateNow();
    const orderCreate = await Order.create({order_date_epoc: getCurrentEpoch, payment_mode: 'cash'}, { currentUserUUID: req.user.id });
    const data = req.body.map(item => ({
      ...item,
      order_id: orderCreate.id,
      created_by: req.user.id,
      updated_by: req.user.id
    }))
    await OrderDetails.bulkCreate(data);
    res.status(200).json({
      status: 'Order Created Successfully',
      data: orderCreate,
    });
  });

  exports.viewOrder = catchAsync(async (req, res) => {
    const item = await Order.findByPk(req.params.id);
    if (!item) {
      return next(new AppError('Order Not Exist', 404));
    }

    const getOrder = await OrderDetails.findAndCountAll({
      include: [{
        model: GroceryItem,
        as: 'GroceryItem',
        attributes: ['name', 'weight', 'expdate_epoc', 'price']
      }
      ],
      where: { order_id:  req.params.id},
      attributes: ['id', 'order_id', 'grocery_item_id', 'quantity', 'created_by', 'updated_by']
    })

    // Calculate subtotal for each order item and total sum of all order items
    getOrder.totalSum = 0;
getOrder.rows.forEach(orderItem => {
  const price = parseFloat(orderItem.GroceryItem.price);
  const quantity = orderItem.quantity;
  const subtotal = price * quantity;
  orderItem.subtotal = subtotal;
  getOrder.totalSum += subtotal;
});

res.status(200).json({
  status: 'success',
  data: getOrder
});
     
    });

exports.confirmOrder = catchAsync(async (req, res, next) => {
  const getCurrentEpoch = getEpocDateNow();
  const item = await Order.findByPk(req.params.id);
  if (!item) {
    return next(new AppError('Order Not Exist', 404));
  }

  const getOrder = await OrderDetails.findAll({
    include: [{
      model: GroceryItem,
      as: 'GroceryItem',
      attributes: ['id', 'name', 'weight', 'expdate_epoc', 'price']
    }
    ],
    where: { order_id:  req.params.id},
    attributes: ['id', 'order_id', 'grocery_item_id', 'quantity', 'created_by', 'updated_by']
  })

   // Reduce the quantity of each GroceryItem
   let totalSum = 0;
   getOrder.forEach(async (orderItem) => {
    const price = parseFloat(orderItem.GroceryItem.price);
    const quantity = orderItem.quantity;
    const subtotal = price * quantity;
    totalSum += subtotal;

    const groceryItemId = orderItem.grocery_item_id;
    let updatedQuantity = 0;
    const groceryItem = await GroceryItem.findByPk(groceryItemId);
    if (!groceryItem) {
      return next(new AppError('Grocery Item Not Found', 404));
    }
    if(groceryItem.inventory_level <= 0){
      return next(new AppError(`${groceryItem.name} Item Out of Stock`, 200));
    }
    if(!(groceryItem.inventory_level >= orderItem.quantity)){
      return next(new AppError(`Please Reduce quantity. Only ${groceryItem.inventory_level} quantity is in Stock`, 200));
    }
    updatedQuantity = groceryItem.inventory_level - orderItem.quantity;
    await groceryItem.update({ inventory_level: updatedQuantity });
  });

  await Order.update({total_amount: totalSum , order_date_epoc: getCurrentEpoch}, {
    where: { id: req.params.id },
  }),
 

  res.status(200).json({
    status: 'Order Placed Successfully',
    data: getOrder,
  });


})

exports.getAllOrder = catchAsync(async (req, res) => {
    const doc = await Order.findAll({});
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });