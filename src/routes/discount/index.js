const express = require('express');
const discountController = require('../../controllers/discount.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// Public routes
router.get('/list_product', asyncHandleError(discountController.getAllDiscountCodeWithProduct));

// Authenticated routes
router.use(authentication);

router.post('/amount', asyncHandleError(discountController.getDiscountAmount));
router.post('/cancel', asyncHandleError(discountController.cancelDiscountCode));
router.post('', asyncHandleError(discountController.createDiscountCode));
router.patch('', asyncHandleError(discountController.updateDiscount));
router.get('', asyncHandleError(discountController.getAllDiscountCode));
router.delete('/:codeId', asyncHandleError(discountController.deleteDiscountCode));

module.exports = router;
