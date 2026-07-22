const { Schema, model, Types } = require('mongoose');
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
const inventorySchema = new Schema({
    inven_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    inven_location: {
        type: String,
        default: 'unknow'
    },
    inven_stock: {
        type: Number,
        require: true
    },
    inven_reservations: { // có nghĩa là đặt trước khi họ thêm vào giỏ hàng thì lưu vào trong này và trừ đi hàng tồn kho và khi thanh toán thành công thì sẽ xóa trong reservations
        type: Array,
        default: []
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
module.exports = model(DOCUMENT_NAME, inventorySchema);