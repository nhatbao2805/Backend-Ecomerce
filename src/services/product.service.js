const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic } = require('../models/product.model')

//define factory pattern class to create product

class ProductFactory {

    typeProduct = Clothing;

    /*
        type: 'clothing',
        payload
    */
    static createProduct = async (type, payload) => {
        // switch (type) {
        //     case 'Electronics':
        //         return new Electronic(payload).createProduct();
        //     case 'Clothing':
        //         return new Clothing(payload).createProduct();
        //     default:
        //         throw new BadRequestError(`Invalid ${type} Product`)
        // }
        return this.typeProduct(payload).createProduct();
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
    async createProduct() {
        return await product.create(this)
    }
}

//define sub-class for different proudct type clothing

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError("Create new Clothing error");
        const newProduct = await super.createProduct(); //super cach goi lay class ma no extends
        if (!newProduct) throw new BadRequestError("Create new Product error");
        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes);
        if (!newElectronic) throw new BadRequestError("Create new Electronic  error");
        const newProduct = await super.createProduct(); //super cach goi lay class ma no extends
        if (!newProduct) throw new BadRequestError("Create new Product error");
        return newProduct
    }
}



module.exports = ProductFactory;