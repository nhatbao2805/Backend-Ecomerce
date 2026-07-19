const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

//authentication
router.use(authentication);
////////////////
router.post('', asyncHandleError(productController.createProduct));
// router.post(`/product/handlerRefreshToken`, asyncHandleError(productController.handleRefreshToken));

module.exports = router;