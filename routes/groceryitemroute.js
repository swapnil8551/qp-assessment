const express = require('express');
const GroceryitemControler = require('../controller/GroceryitemControler');
const { groceryItemCheck, updateGroceryItemCheck } = require('../validators/groceryItem');
const validate = require('../middleware/joimiddleware');
const auth = require('../controller/authController');

const router = express.Router();
router.use(auth.protect);

router
  .route('/')
  .get(GroceryitemControler.getAllGroceryItem)
  .post(validate(groceryItemCheck),GroceryitemControler.createGroceryItem)

  router
  .route('/:id')
  .get(GroceryitemControler.getGroceryItem)
  .patch(validate(updateGroceryItemCheck), GroceryitemControler.updateGroceryItem)
  .delete(GroceryitemControler.deleteGroceryItem)

  module.exports = router;