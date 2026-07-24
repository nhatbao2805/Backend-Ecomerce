const express = require('express');
const checkoutController = require('../../controllers/checkout.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// Checkout routes require authentication
router.use(authentication);

router.post('/review', asyncHandleError(checkoutController.checkoutReview));

module.exports = router;
