const { Op } = require('sequelize');
const GroceryItem = require('../model/GroceryItem');
const catchAsync = require('../utils/catchasync');
const EndUser = require('../model/EndUser');

const checkloginUserIsAdmin = async (userid)=> {
  const checkAdmin = await EndUser.findOne({
    where: {
      id: userid,
      role: 'Admin'
    },
  });
  if(!checkAdmin){
    throw new AppError('Unauthorize. You do not have access to perform this action', 403);
  }
  return checkAdmin;
}

exports.createGroceryItem = async (req, res) => {
  checkloginUserIsAdmin(req.user.id)
    const doc = await GroceryItem.create(req.body, {
      currentUserUUID: req.user.id,
    },);
    res.status(200).json({
      status: 'User Created Successfully',
      data: doc,
    });
  };

exports.getAllGroceryItem = catchAsync(async (req, res) => {
  const { search } = req.query;
  const searchConditions = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};
    const doc = await GroceryItem.findAll({
      attributes: ['id', 'name', 'weight', 'expdate_epoc', 'price'],
      where: searchConditions
    });
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

  exports.getGroceryItem = catchAsync(async (req, res, next) => {
    const item = await GroceryItem.findByPk(req.params.id);
  if (!item) {
    return next(new AppError('Item Not Exist', 404));
  }
    res.status(200).json({
      status: 'success',
      data: item,
    });
  });

// update GroceryItem
exports.updateGroceryItem = catchAsync(async (req, res, next) => {
  checkloginUserIsAdmin(req.user.id)
  const item = await GroceryItem.findByPk(req.params.id);
  if (!item) {
    return next(new AppError('Item Not Exist', 404));
  }
  await GroceryItem.update(req.body, {
    where: { id: req.params.id },
  },
  { currentUserUUID: req.user.id },);
  res.status(200).json({
    status: 'Success',
    data: "GroceryItem Updated Successfully",
  });
});

// delete GroceryItem
exports.deleteGroceryItem = catchAsync(async (req, res, next) => {
  checkloginUserIsAdmin(req.user.id)
  const item = await GroceryItem.findByPk(req.params.id);
  if (!item) {
    return next(new AppError('Item not exist', 404));
  }
  await GroceryItem.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(204).json({
    status: 'Success',
    message: 'GroceryItem Deleted Successfully',
  });
});