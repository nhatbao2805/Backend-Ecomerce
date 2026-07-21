const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic } = require('../models/product.model');
const { findAllDraftForShop, publishedProductByShop, findAllPublishedForShop, unPublishedProductByShop, searchProductsForUser, findAllProducts, findProduct } = require('../models/repositories/product.repo');

//define factory pattern class to create product

class ProductFactory {
    /*
        type: 'clothing',
        payload
        With out Strategy Pattern
    */
    // static createProduct = async (type, payload) => {
    //     switch (type) {
    //         case 'Electronics':
    //             return new Electronic(payload).createProduct();
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct();
    //         default:
    //             throw new BadRequestError(`Invalid ${type} Product`)
    //     }
    // }
    // Use Strategy Pattern
    static productRegistry = {} //key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static createProduct = async (type, payload) => {
        const ProductClass = ProductFactory.productRegistry[type];
        if (!ProductClass) throw new BadRequestError(`Invalid ${type} Product`);
        return new ProductClass(payload).createProduct();
    }

    static updateProduct = async (type, payload) => {
        const ProductClass = ProductFactory.productRegistry[type];
        if (!ProductClass) throw new BadRequestError(`Invalid ${type} Product`);
        return new ProductClass(payload).createProduct();
    }

    static publishedProductByShop = async ({ product_shop, product_id }) => {
        await publishedProductByShop({ product_shop, product_id })
    }

    static unPublishedProductByShop = async ({ product_shop, product_id }) => {
        await unPublishedProductByShop({ product_shop, product_id })
    }

    //query
    static findAllDraftForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, isDraft: true }
        await findAllDraftForShop({ query, limit, skip })
    }

    static findAllPublishedForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, isPublished: true }
        await findAllPublishedForShop({ query, limit, skip })
    }

    static searchProducts = async ({ keySearch }) => {
        await searchProductsForUser({ keySearch })
    }

    static findAllProducts = async ({ limit = 50, sort = 'citme', page = 1, filter = { isPublished: true } }) => {
        await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_thumb', 'product_price'] })
    }

    static findProduct = async ({ product_id }) => {
        await findProduct({ product_id, unSelect: ['__v'] })
    }
}

//define base product class
class Product {

    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

//define sub-class for different proudct type clothing

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) throw new BadRequestError("Create new Clothing error");
        const newProduct = await super.createProduct(newClothing._id); //super cach goi lay class ma no extends
        if (!newProduct) throw new BadRequestError("Create new Product error");
        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError("Create new Electronic error");
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("Create new Product error");
        return newProduct
    }
}


//register productTye
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)

module.exports = ProductFactory;