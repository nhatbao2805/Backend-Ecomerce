const { Types } = require("mongoose")
const { inventoryModel } = require("../inventory.model")
const { BadRequestError } = require("../../core/error.response")
const { convertToObjectIdMongodb } = require("../../utils")

const insertInventory = async ({ productId, shopId, stock, location = 'unknow' }) => {
    await inventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location,
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: { $gte: quantity }
    }
    const updateSet = {
        $inc: { inven_stock: -quantity },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }
    const options = { new: true, upsert: false }
    return await inventoryModel.findOneAndUpdate(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}