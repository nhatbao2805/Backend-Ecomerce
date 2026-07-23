const CartService = require('../services/cart.service');
const { SuccessResponse } = require('../core/success.response');

class CartController {
    /**
     * @desc Add product to cart / Increase quantity
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Add product to cart success!",
            metaData: await CartService.addProductToCart({
                userId: req.userId,
                product: req.body.product
            })
        }).send(res);
    }

    /**
     * @desc Update cart quantity / Sync quantity
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Update cart success!",
            metaData: await CartService.addToCartV2({
                userId: req.userId,
                shop_order_ids: req.body.shop_order_ids
            })
        }).send(res);
    }

    /**
     * @desc Delete product from cart
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete product from cart success!",
            metaData: await CartService.deleteUserCart({
                userId: req.userId,
                productId: req.body.productId
            })
        }).send(res);
    }

    /**
     * @desc Get list cart of user
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    listCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list cart success!",
            metaData: await CartService.getListUserCart({
                userId: req.userId
            })
        }).send(res);
    }
}

module.exports = new CartController();
