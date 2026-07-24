const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema({
    order_userId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    order_checkout: { type: Object, default: {} },
    /*
      {
        totalPrice,
        totalApplyDiscount,
        feeShip,
        grandTotal
      }
    */
    order_shipping: { type: Object, default: {} },
    /*
      {
        street,
        city,
        state,
        country
      }
    */
    order_payment: { type: Object, default: {} },
    /*
      {
        payment_method: 'cod' | 'paypal' | 'credit_card',
        payment_status: 'pending' | 'paid' | 'failed'
      }
    */
    order_products: { type: Array, required: true }, // shop_order_ids_new
    order_trackingNumber: { type: String, default: '#00001abc' },
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, orderSchema);
