const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require('../core/success.response');

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Create discount success !",
            metaData: await DiscountService.createDiscountCode({ ...req.body, shopId: req.userId })
        }).send(res);
    }

    updateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Update discount success !",
            metaData: await DiscountService.updateDiscountCode({ ...req.body, shopId: req.userId })
        }).send(res);
    }

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all discount codes success !",
            metaData: await DiscountService.getAllDiscountCodesByShop({ ...req.query, shopId: req.userId })
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discount amount success !",
            metaData: await DiscountService.getDiscountAmount({
                ...req.body,
                userId: req.userId
            })
        }).send(res);
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discount code products success !",
            metaData: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res);
    }

    deleteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete discount success !",
            metaData: await DiscountService.deleteDiscountCode({
                shopId: req.userId,
                codeId: req.params.codeId
            })
        }).send(res);
    }

    cancelDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Cancel discount success !",
            metaData: await DiscountService.cancelDiscountCode({
                ...req.body,
                userId: req.userId
            })
        }).send(res);
    }
}

module.exports = new DiscountController();