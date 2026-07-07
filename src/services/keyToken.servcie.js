const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const token = await keyTokenModel.create({
                userId: userId,
                publicKey: publicKey,
                privateKey: privateKey,
            })
            return token ? token.publicKey : ''
        } catch (error) {
            return error
        }
    }

}

module.exports = KeyTokenService;