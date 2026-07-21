const { Types } = require("mongoose")
const { product } = require("../product.model")
const { BadRequestError } = require("../../core/error.response")
const { getSelectData, getUnselectData } = require("../../utils")


const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const product = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
        .select(getSelectData(select))
        .lean();

    return product;
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById({ _id: product_id }).select(getUnselectData(unSelect)).lean();
}

const updateProductById = async ({ product_id, bodyUpdate, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew });
}


const searchProductsForUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product.find(
        { isPublished: true, $text: { $search: regexSearch } },
        { $score: { $meta: 'textScore' } }
    )
        .sort({ $score: { $meta: 'textScore' } })
        .lean();
    return results
}

const publishedProductByShop = async ({ product_shop, product_id }) => {
    return updateStatusProductByShop({ product_shop, product_id, isDraft: false, isPublished: true })
}

const unPublishedProductByShop = async ({ product_shop, product_id }) => {
    return updateStatusProductByShop({ product_shop, product_id, isDraft: true, isPublished: false })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const updateStatusProductByShop = async ({ product_shop, product_id, isDraft, isPublished }) => {
    const filter = {
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    }
    const updateSet = { isDraft, isPublished }
    const updatedProduct = await product.findOneAndUpdate(filter, updateSet, { new: true })
    if (!updatedProduct) throw new BadRequestError("Product not found or you don't have permission to modify it!")
    return updatedProduct
}


module.exports = {
    findAllDraftForShop,
    publishedProductByShop,
    findAllPublishedForShop,
    unPublishedProductByShop,
    searchProductsForUser,
    findAllProducts,
    findProduct,
    updateProductById,

}
