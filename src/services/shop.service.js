const shopModel = require("../models/shop.model")

//tham só 1 và 0 sẽ đại diện cho việc field đó có được lấy và trả về hay không
const findByEmail = async ({ email, select = {
    email: 1, password: 1, name: 1, status: 1, roles: 1
} }) => {
    return await shopModel.findOne({ email }).select(select).lean();
}

module.exports = {
    findByEmail
}