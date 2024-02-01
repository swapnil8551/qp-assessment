const express = require('express');
const userController = require('../controller/UserController');
const validate = require('../middleware/joimiddleware');
const { checkuserinfo } = require('../validators/user');

const router = express.Router();
const auth = require('../controller/authController');

router.route('/onboarduser')
  .post(validate(checkuserinfo),userController.createUser);

router.use(auth.protect);

router
  .route('/')
  .get(userController.getAllUsers)

  router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


  


  module.exports = router;