const { getUnselectData, getSelectData } = require('../../utils');
const discountModel = require('../discount.model')

const findDiscount = async ({ filter, model }) => {
    return await model.findOne(filter).lean();
}

const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {

    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
        .select(getUnselectData(unSelect))
        .lean();

    return discounts
}

const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {

    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
        .select(getSelectData(select))
        .lean();

    return discounts
}

const updateDiscountById = async ({ code, shopId, bodyUpdate, model, isNew = true }) => {
    return await model.findOneAndUpdate({ discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId) }, bodyUpdate, { new: isNew });
}

module.exports = {
    findDiscount,
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    updateDiscountById
}