const cartModel = require('../cart.model')
const { convertToObjectIdMongodb } = require('../../utils/index');

const findCartById = async (cardId) => {
    return await cartModel.findOne({ _id: convertToObjectIdMongodb(cardId), cart_state: 'active' }).lean();
}

const removeProductInCartById = async ({ cartId, userId, productIds }) => {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart not found!");

    const query = {
        _id: foundCart._id
    }
    const updateSet = {
        $pull: {
            cart_products: {
                productId: { $in: productIds }
            }
        },
        $inc: {
            cart_count_products: -productIds.length
        }
    }
    return await cartModel.findOneAndUpdate(query, updateSet, { new: true });
}

module.exports = {
    findCartById,
    removeProductInCartById
}                