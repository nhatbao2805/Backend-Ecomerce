const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            // publicKey tại vì sinh ra từ thuật toán bất đối xứng là buffer nên đẩy về string để lưu vào database
            const publicKeyString = publicKey.toString();
            const token = await keyTokenModel.create({
                userId: userId,
                pubicKey: publicKeyString,
            })
            return token ? token.pubicKey : ''
        } catch (error) {
            return error
        }
    }

}

module.exports = KeyTokenService;