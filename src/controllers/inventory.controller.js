const InventoryService = require('../services/inventory.service');
const { SuccessResponse } = require('../core/success.response');

class InventoryController {
    addStockIntoInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Checkout review success!",
            metaData: await InventoryService.addStockIntoInventory(req.body)
        }).send(res);
    }
}

module.exports = new InventoryController();
