const ProductService = require("../services/product.service");
const { CREATED, SuccessResponse } = require('../core/success.response')


class ProductController {

    static createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create product success !",
            metaData: await ProductService.createProduct(req.body.product_type, req.body)
        }).send(res);
    }

}

module.exports = ProductController