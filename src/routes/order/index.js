const express = require('express');
const orderController = require('../../controllers/order.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// Order routes require authentication
router.use(authentication);

router.post('', asyncHandleError(orderController.orderByUser));
router.get('', asyncHandleError(orderController.getOrdersByUser));
router.get('/:orderId', asyncHandleError(orderController.getOneOrderByUser));
router.post('/cancel/:orderId', asyncHandleError(orderController.cancelOrderByUser));
router.patch('/status', asyncHandleError(orderController.updateOrderStatusByShop));

module.exports = router;
