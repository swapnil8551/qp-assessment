const express = require('express');
const authController = require('../controller/authController');
const validate = require('../middleware/joimiddleware');
const { signinCheck } = require('../validators/auth');

const router = express.Router();

router.route('/signin').post(validate(signinCheck), authController.passwordVerifierAuth);

module.exports = router