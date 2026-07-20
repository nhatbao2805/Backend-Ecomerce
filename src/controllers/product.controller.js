const ProductService = require("../services/product.service");
const { CREATED, SuccessResponse } = require('../core/success.response')


class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create product success !",
            metaData: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.userId
            })
        }).send(res);
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish product success !",
            metaData: await ProductService.publishedProductByShop({
                product_shop: req.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Unpublish product success !",
            metaData: await ProductService.unPublishedProductByShop({
                product_shop: req.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    //QUERY

    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list product draft success !",
            metaData: await ProductService.findAllDraftForShop({
                product_shop: req.userId
            })
        }).send(res);
    }

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list product published success !",
            metaData: await ProductService.findAllPublishedForShop({
                product_shop: req.userId
            })
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list prodcuct for user success !",
            metaData: await ProductService.searchProducts({
                keySearch: req.params
            })
        }).send(res);
    }
}

module.exports = new ProductController()