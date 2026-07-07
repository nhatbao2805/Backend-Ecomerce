const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.servcie");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            // step1: check email exists ??
            const hodelShop = await shopModel.findOne({ email: email }).lean(); //lean() trả về 1 object javascript thuần túy giúp tối ưu hóa thời gian hơn
            if (hodelShop) {
                return ({
                    code: "xxx",
                    messgae: "Shop already registered !"
                })
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })

            if (newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                    privateKey: privateKey
                })

                if (!keyStore) {
                    return ({
                        code: "xxx",
                        messgae: "keyStore error !"
                    })
                }

                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
                return {
                    code: 201,
                    metaData: {
                        shop: getInforData({ fields: ["_id", "email", "nanme"], object: newShop }),
                        tokens
                    }
                }
            }

        } catch (error) {
            return {
                code: "xxx",
                message: error,
                status: "xxx",
            }
        }
    }

}

module.exports = AccessService;