const express = require('express');
const cartController = require('../../controllers/cart.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// Cart routes require authentication to extract req.userId
router.use(authentication);

router.post('', asyncHandleError(cartController.addToCart));
router.post('/update', asyncHandleError(cartController.updateCart));
router.delete('', asyncHandleError(cartController.deleteCart));
router.get('', asyncHandleError(cartController.listCart));

module.exports = router;
