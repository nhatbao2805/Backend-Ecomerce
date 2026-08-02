const RedisPubSubService = require('../services/redisPublish.service');

class InventoryServiceTest {
    constructor() {
        RedisPubSubService.subscribe('purchase_events', message => {
            try {
                const { productId, quantity } = JSON.parse(message);
                InventoryServiceTest.updateInventory(productId, quantity);
            } catch (error) {
                console.error("Lỗi parse tin nhắn từ Redis:", error);
            }
        });
    }

    static updateInventory = (productId, quantity) => {
        console.log("Update Inventory for product:", productId, "with quantity:", quantity);
    }
}

module.exports = new InventoryServiceTest();