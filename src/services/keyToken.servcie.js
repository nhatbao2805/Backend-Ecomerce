const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const token = await keyTokenModel.create({
            //     userId: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey,
            // })
            //return token ? token.publicKey : ''

            // refreshTokensUsed có nghĩa là danh sách các refreshToken đã sử dụng
            // options = { upsert: true, new: true }
            const filter = { user: userId }, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }, options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

        } catch (error) {
            return error
        }
    }

}

module.exports = KeyTokenService;