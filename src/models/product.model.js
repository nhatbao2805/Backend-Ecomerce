const { Schema, model } = require('mongoose');
const slugify = require('slugify')
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
    product_slug: String,
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
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Ratting must be above 1.0'],
        max: [5, 'Ratting must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true, // đánh index
        select: false //sẽ không lấy giá trị này show ra
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: false, // đánh index
        select: false //sẽ không lấy giá trị này show ra
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//create index for search\
productSchema.index({ product_name: 'text', product_description: 'text' })
// Document middleware: run before .save() and .create()
productSchema.pre('save', (next) => {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
})

// define the product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'Clothes'
});

// define the product type = Electronic

const electronicSchema = new Schema({
    manufactuter: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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