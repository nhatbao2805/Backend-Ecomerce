const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {

    static addStockIntoInventory = async ({
        stock,
        productId,
        shopId,
        location = ""
    }) => {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError("The product does not exist");

        const query = { inven_shopId: shopId, inven_productId: productId }
        const updateSet = {
            $inc: {
                iven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }
        const option = {
            upsert: true, new: true
        }
        return inventoryModel.findOneAndUpdate(query, updateSet, option)
    }

}

module.exports = InventoryService