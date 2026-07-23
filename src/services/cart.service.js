const { NotFoundError } = require("../core/error.response")
const cartModel = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")

class CartService {

    static createUserCart = async ({ userId, product = {} }) => {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            },
            options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static updateUserCartQuantity = async ({ userId, product = {} }) => {
        const { productId, quantity } = product
        const query = { cart_userId: userId, cart_state: 'active', 'cart.products.productId': productId },
            updateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity
                }
            },
            options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static addProductToCart = async ({ userId, product = {} }) => {
        const userCart = await cartModel.findOne({ cart_userId: userId })

        if (!userCart) {
            return await CartService.createUserCart({ cart_userId: userId, })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save()
        }

        await CartService.updateUserCartQuantity({ userId, product })

    }

    /*
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        quantity,
                        price,
                        shopOd,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */

    static addToCartV2 = async ({ userId, shop_order_ids }) => {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        //check product
        const foundProduct = await getProductById(productId);
        if (!foundProduct) throw new NotFoundError("Product not found !")

        //compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId.toString()) {
            throw new NotFoundError("Product not found in shop!")
        }

        return await CartService.updateUserCartQuantity({
            userId, product: {
                productId,
                quantity: quantity - old_quantity,
            }
        })
    }

    static deleteUserCart = async ({ userId, productId }) => {
        const query = { cart_userId: userId, card_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cartModel.updateOne(query, updateSet);
        return deleteCart;
    }

    static getListUserCart = async ({ userId }) => {
        return await cartModel.findOne({ cart_userId: userId }).lean();
    }

}

module.exports = CartService