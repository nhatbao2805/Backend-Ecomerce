const OrderService = require('../services/order.service');
const { SuccessResponse } = require('../core/success.response');

class OrderController {

    orderByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Place order success!",
            metaData: await OrderService.orderByUser({
                userId: req.userId,
                ...req.body
            })
        }).send(res);
    }

    getOrdersByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Get user orders success!",
            metaData: await OrderService.getOrdersByUser({
                userId: req.userId
            })
        }).send(res);
    }

    getOneOrderByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Get order details success!",
            metaData: await OrderService.getOneOrderByUser({
                userId: req.userId,
                orderId: req.params.orderId
            })
        }).send(res);
    }

    cancelOrderByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Cancel order success!",
            metaData: await OrderService.cancelOrderByUser({
                userId: req.userId,
                orderId: req.params.orderId
            })
        }).send(res);
    }

    updateOrderStatusByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Update order status success!",
            metaData: await OrderService.updateOrderStatusByShop({
                shopId: req.userId,
                orderId: req.body.orderId,
                status: req.body.status
            })
        }).send(res);
    }

}

module.exports = new OrderController();
