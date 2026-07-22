const { Types } = require("mongoose")
const { inventoryModel } = require("../inventory.model")
const { BadRequestError } = require("../../core/error.response")

const insertInventory = async ({ productId, shopId, stock, location = 'unknow' }) => {
    await inventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location,
    })
}

module.exports = {
    insertInventory
}