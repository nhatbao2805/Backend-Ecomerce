const { BadRequestError, NotFoundError } = require('../core/error.response');
const { discountModel } = require('../models/discount.model');
const { findDiscount, findAllDiscountCodesSelect, findAllDiscountCodesUnSelect, updateDiscountById } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');
const DiscountBuilder = require('../builders/discount.builder');

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

        const { error, valueBuilder } = new DiscountBuilder()
            .setStartDate(start_date)
            .setEndDate(end_date)
            .build();

        if (error) {
            throw new BadRequestError(error);
        }

        //create index for discount model
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId)
            }, discountModel
        });

        if (foundDiscount && foundDiscount.discount_is_active) throw new BadRequestError("Discount exits!");

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: valueBuilder.start_date,
            discount_end_date: valueBuilder.end_date,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count || 0,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        });

        return newDiscount;
    }

    static updateDiscountCode = async (payload) => {

        const {
            code, start_date, end_date, is_active, shopId, min_order_value, product_ids,
            applies_to, name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload;

        const { error, valueBuilder } = new DiscountBuilder()
            .setStartDate(start_date)
            .setEndDate(end_date)
            .build();

        if (error) {
            throw new BadRequestError(error);
        }

        //create index for discount model
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId)
            }, discountModel
        });

        if (!foundDiscount) throw new NotFoundError("Discount not exists!");

        // Map payload fields to Mongoose schema properties with discount_ prefix
        const bodyUpdate = {};
        if (name !== undefined) bodyUpdate.discount_name = name;
        if (description !== undefined) bodyUpdate.discount_description = description;
        if (type !== undefined) bodyUpdate.discount_type = type;
        if (value !== undefined) bodyUpdate.discount_value = value;
        if (code !== undefined) bodyUpdate.discount_code = code;
        if (valueBuilder) {
            bodyUpdate.discount_start_date = valueBuilder.start_date;
            bodyUpdate.discount_end_date = valueBuilder.end_date;
        }
        if (max_uses !== undefined) bodyUpdate.discount_max_uses = max_uses;
        if (uses_count !== undefined) bodyUpdate.discount_uses_count = uses_count;
        if (max_uses_per_user !== undefined) bodyUpdate.discount_max_uses_per_user = max_uses_per_user;
        if (min_order_value !== undefined) bodyUpdate.discount_min_order_value = min_order_value;
        if (is_active !== undefined) bodyUpdate.discount_is_active = is_active;
        if (applies_to !== undefined) {
            bodyUpdate.discount_applies_to = applies_to;
            bodyUpdate.discount_product_ids = applies_to === 'all' ? [] : product_ids;
        } else if (product_ids !== undefined) {
            bodyUpdate.discount_product_ids = product_ids;
        }

        return await updateDiscountById({ code, shopId, bodyUpdate, discountModel });
    }

    static getAllDiscountCodeWithProduct = async ({ code, shopId, userId, limit, page }) => {
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId)
            }, discountModel
        });

        if (!foundDiscount || !foundDiscount.discount_is_active) throw new NotFoundError("Discount not exits!");

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;

        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }

        return products;
    }

    static getAllDiscountCodesByShop = async ({ limit, page, shopId }) => {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        });
        return discounts;
    }

    static getDiscountAmount = async ({ codeId, userId, shopId, products }) => {
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: codeId, discount_shopId: convertToObjectIdMongodb(shopId)
            }, discountModel
        });

        if (!foundDiscount) throw new NotFoundError("Discount not exists!");

        const {
            discount_is_active,
            discount_max_uses,
            discount_uses_count,
            discount_max_uses_per_user,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_users_used,
            discount_type,
            discount_value
        } = foundDiscount;

        if (!discount_is_active) throw new BadRequestError("Discount expired!");
        if (discount_max_uses > 0 && discount_uses_count >= discount_max_uses) {
            throw new BadRequestError("Discount codes are out!");
        }

        const now = new Date();
        if (now < new Date(discount_start_date) || now > new Date(discount_end_date)) {
            throw new BadRequestError("Discount code has expired!");
        }

        let totalOrder = products.reduce((acc, v) => {
            return acc + (v.quantity * v.price);
        }, 0);

        if (discount_min_order_value > 0) {
            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError(`Discount requires a minimum order value of ${discount_min_order_value}!`);
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUses = discount_users_used.filter(id => id.toString() === userId.toString()).length;
            if (userUses >= discount_max_uses_per_user) {
                throw new BadRequestError("User has reached the limit for this discount!");
            }
        }

        // Check if discount is fixed_amount or percentage, capped at totalOrder
        const amount = discount_type === "fixed_amount" 
            ? Math.min(discount_value, totalOrder) 
            : +(totalOrder * (discount_value / 100)).toFixed(2);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        };
    }

    static deleteDiscountCode = async ({ shopId, codeId }) => {
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: codeId, discount_shopId: convertToObjectIdMongodb(shopId)
            }, discountModel
        });

        if (!foundDiscount) throw new NotFoundError("Discount not exists!");

        const deleted = await discountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        });

        return deleted;
    }

    static cancelDiscountCode = async ({ shopId, codeId, userId }) => {
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: codeId, discount_shopId: convertToObjectIdMongodb(shopId)
            }, discountModel
        });

        if (!foundDiscount) throw new NotFoundError("Discount not exists!");

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_uses_count: -1,
            }
        }, { new: true });

        return result;
    }

}


module.exports = DiscountService;