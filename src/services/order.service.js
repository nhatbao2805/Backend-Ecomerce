const orderModel = require('../models/order.model');
const cartModel = require('../models/cart.model');
const inventoryModel = require('../models/inventory.model');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const CheckoutService = require('./checkout.service');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class OrderService {

    /**
     * Place order by User
     */
    static orderByUser = async ({ cartId, userId, shop_order_ids, user_address = {}, user_payment = {} }) => {
        // 1. Re-evaluate cart and discounts using CheckoutService
        const { checkout_order, shop_order_ids_new } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        });

        // 2. flat products list from shop_order_ids_new to reserve stock
        const products = shop_order_ids_new.flatMap(shop_order => shop_order.item_products);
        
        // 3. Reserve stock in inventory (optimistic locking)
        for (const product of products) {
            const reservationResult = await reservationInventory({
                productId: product.productId,
                quantity: product.quantity,
                cartId
            });

            if (!reservationResult) {
                throw new BadRequestError(`Some products are out of stock. Please update your cart!`);
            }
        }

        // 4. Create Order
        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        });

        // 5. Clear cart products
        if (newOrder) {
            await cartModel.updateOne(
                { cart_userId: userId, cart_state: 'active' },
                { $set: { cart_products: [] } }
            );
        }

        return newOrder;
    }

    /**
     * Get list of orders by User
     */
    static getOrdersByUser = async ({ userId }) => {
        return await orderModel.find({ order_userId: userId }).lean();
    }

    /**
     * Get specific order detail by User
     */
    static getOneOrderByUser = async ({ userId, orderId }) => {
        const order = await orderModel.findOne({ _id: orderId, order_userId: userId }).lean();
        if (!order) throw new NotFoundError("Order not found!");
        return order;
    }

    /**
     * Cancel Order by User
     */
    static cancelOrderByUser = async ({ userId, orderId }) => {
        const foundOrder = await orderModel.findOne({ _id: orderId, order_userId: userId });
        if (!foundOrder) throw new NotFoundError("Order not found!");
        if (foundOrder.order_status !== 'pending') {
            throw new BadRequestError("Cannot cancel confirmed, shipped, or delivered orders!");
        }

        // Restore inventory stock
        for (const shop_order of foundOrder.order_products) {
            for (const product of shop_order.item_products) {
                await inventoryModel.updateOne(
                    { inven_productId: product.productId },
                    { 
                        $inc: { inven_stock: product.quantity },
                        $pull: {
                            inven_reservations: {
                                cartId: foundOrder.order_products[0].cartId // Restore reservations
                            }
                        }
                    }
                );
            }
        }

        foundOrder.order_status = 'cancelled';
        await foundOrder.save();
        return foundOrder;
    }

    /**
     * Update order status by Shop
     */
    static updateOrderStatusByShop = async ({ shopId, orderId, status }) => {
        const foundOrder = await orderModel.findById(orderId);
        if (!foundOrder) throw new NotFoundError("Order not found!");

        // Verify if shop owns items in this order
        const hasShopProduct = foundOrder.order_products.some(
            shop_order => shop_order.shopId.toString() === shopId.toString()
        );
        if (!hasShopProduct) {
            throw new BadRequestError("You do not have permission to modify this order!");
        }

        foundOrder.order_status = status;
        await foundOrder.save();
        return foundOrder;
    }

}

module.exports = OrderService;
