const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enums: ['Electronics', 'Clothing', 'Funiture']
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }, // Linked voi th shop
    product_attributes: {
        type: Schema.Types.Mixed,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


// define the product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
}, {
    timestamps: true,
    collection: 'Clothes'
});

// define the product type = Electronic

const electronicSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
}, {
    timestamps: true,
    collection: 'Electronics'
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    'clothing': model('Clothing', clothingSchema),
    'electronic': model('Electronic', electronicSchema),
}


/* 
product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
Giải thích chi tiết:

type: Schema.Types.ObjectId 
  — field này lưu một ObjectId (giống như khóa ngoại 
  - foreign key trong SQL), chính là giá trị _id của một document bên collection khác.
ref: 'Shop' 
  — đây là phần quan trọng nhất: nó khai báo rằng ObjectId này tham chiếu (reference) đến model tên là 'Shop'. Nhờ đó, khi bạn dùng hàm .populate('product_shop'), 
  Mongoose sẽ tự động tìm và lấy toàn bộ document Shop tương ứng thay vì chỉ trả về một chuỗi ObjectId.
*/