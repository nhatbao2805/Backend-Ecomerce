const cartModel = require('../cart.model')
const { convertToObjectIdMongodb } = require('../../utils/index');

const findCartById = async (cardId) => {
    return await cartModel.findOne({ _id: convertToObjectIdMongodb(cardId), card_state: 'active' }).lean();
}

module.exports = {
    findCartById
}