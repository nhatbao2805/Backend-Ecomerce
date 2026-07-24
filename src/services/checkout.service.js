const { findCartById } = require("../models/repositories/cart.repo");
const { AuthFailureError, NotFoundError, BadRequestError } = require('../core/error.response');
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { getAmountDiscountByServer } = require("../models/repositories/discount.repo");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
    /*
       {
           cartId,
           userId,
           shop_order_ids:[
               {
                   shopId,
                   shop_discounts:[],
                   item_products: [
                       price,
                       quantity,
                       productId
                   ]
               }
           ]
    
       }
       
    */
    static checkoutReview = async ({ cartId, userId, shop_order_ids }) => {

        // check cartId
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new NotFoundError("Not found cart!");

        const checkout_order = {
            totalPrice: 0, //tong tien hang
            feeShip: 0,//phi van chuyen
            totalDiscount: 0, //tong tien discount
            totalCheckout: 0 // tong thanh toan
        }, shop_order_ids_new = []

        for (const shop_order of shop_order_ids) {
            const { shopId, shop_discounts, item_products } = shop_order;
            const checkProductServer = await checkProductByServer(item_products);
            if (!checkProductServer || checkProductServer.length === 0) {
                throw new BadRequestError("Order wrong: Product not found or invalid!");
            }
            const priceRaw = checkProductServer.reduce((acc, prod) => {
                return acc + (prod.quantity * prod.price);
            }, 0);
            checkout_order.totalPrice += priceRaw;
            let shopDiscountAmount = 0;
            let currentShopPrice = priceRaw; // Dùng để cap discount
            if (shop_discounts && shop_discounts.length > 0) {
                for (const discount of shop_discounts) {
                    const discountResult = await getAmountDiscountByServer({
                        codeId: discount.codeId,
                        userId,
                        shopId,
                        products: item_products
                    });
                    if (discountResult && discountResult.discount > 0) {
                        const actualDiscount = Math.min(discountResult.discount, currentShopPrice);
                        shopDiscountAmount += actualDiscount;
                        currentShopPrice -= actualDiscount;
                    }
                }
            }
            checkout_order.totalDiscount += shopDiscountAmount;
            const shopFeeShip = priceRaw > 100 ? 0 : 10;
            checkout_order.feeShip += shopFeeShip;
            shop_order_ids_new.push({
                shopId,
                priceRaw,
                priceApplyDiscount: priceRaw - shopDiscountAmount,
                shop_discounts,
                item_products: checkProductServer
            });
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static orderByUser = async ({ shop_order_ids, cartId, userId, user_address, user_payment }) => {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({ cartId, userId, shop_order_ids: shop_order_ids })

        //check lai mot lan nua co vuot ton kho khong
        const products = shop_order_ids_new.flatMap(v => v.item_products);

        //dung optimistic lock (khóa lạc quan) => có nhiều luồng cùng lúc truy cập vào nhưng gom lại hết và cho phép từng luồng đi vào lấy giá trị xong rồi trả về lại nhược điểm thời gian đợi lâu
        const acquireLockProduct = [];
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireLockProduct(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        //check lai neu co 1 san pham het hang trong kho
        if (acquireLockProduct.includes(false)) {
            throw new BadRequestError("Someone product false!")
        }

        const newOrder = await create();

        return newOrder
    }

}

module.exports = CheckoutService;