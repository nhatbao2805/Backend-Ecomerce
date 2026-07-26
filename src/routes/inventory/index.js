const express = require('express');
const inventoryController = require('../../controllers/inventory.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// Checkout routes require authentication
router.use(authentication);

router.post('', asyncHandleError(inventoryController.addStockIntoInventory));

module.exports = router;
