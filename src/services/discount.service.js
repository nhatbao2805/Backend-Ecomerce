const { BadRequestError, NotFoundError } = require('../core/error.response');
const { discountModel } = require('../models/discount.model');
const { findDiscount, findAllDiscountCodesSelect, findAllDiscountCodesUnSelect } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');
/* 
    1 - Generator Discount Code [Shop | Admin]
    2 - Get all discount codes [User | Shop]
    3 - Get all product by discount code [User]
    4 - Get discount amount [User]
    5 - Delete discount Code [Admin | Shop]
    6 - Cancel discount Code [User]
*/

class DiscountService {

    static createDiscountCode = async (payload) => {
        const {
            code, start_date, end_date, is_active, shopId, min_order_value, product_ids,
            applies_to, name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload;

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError("Discount code has expried!")
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date!")
        }

        //create index for discount model
        const foundDiscount = await findDiscount({ code, shopId });

        if (foundDiscount && foundDiscount.discount_is_active) throw new BadRequestError("Discount exits!");

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count || 0,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static updateDiscountCode = async (payload) => {
    }

    static getAllDiscountCodeWithProduct = async ({ code, shopId, userId, limit, page }) => {
        const foundDiscount = await findDiscount({ code, shopId })

        if (!foundDiscount || !foundDiscount.discount_is_active) throw new NotFoundError("Discount not exits!")

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;

        if (discount_applies_to = 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to = 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

    }

    static getAllDiscountCodesByShop = async ({ limit, page, shopId }) => {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', discount_shopId],
            model: discountModel
        })
        return discounts
    }
}

module.exports = DiscountService