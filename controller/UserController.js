const { Op } = require('sequelize');
const EndUser = require('../model/EndUser');
const catchAsync = require('../utils/catchasync');
const CryptoJS = require('crypto-js');

exports.getAllUsers = catchAsync(async (req, res) => {
    const doc = await EndUser.findAll({});
    res.status(200).json({
      status: 'Success',
      data: doc,
    });
  });

exports.createUser = async (req, res) => {
  req.body.password = CryptoJS.SHA256(req.body.password).toString();
    const doc = await EndUser.create(req.body);
    res.status(200).json({
      status: 'User Created Successfully',
      data: doc,
    });
  };


  exports.getUser = catchAsync(async (req, res, next) => {
    const user = await EndUser.findByPk(req.params.id);
  if (!user) {
    return next(new AppError('User Not Exist', 404));
  }
    res.status(200).json({
      status: 'success',
      data: user,
    });
  });

// update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await EndUser.findByPk(req.params.id);
  if (!user) {
    return next(new AppError(USER.NOT_EXIST, 404));
  }
  await User.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({
    status: 'Success',
    data: "User Updated Successfully",
  });
});

// delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await EndUser.findByPk(req.params.id);
  if (!doc) {
    return next(new AppError(USER.NOT_EXIST, 404));
  }
  await EndUser.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(204).json({
    status: 'Success',
    message: 'User Deleted Successfully',
  });
});