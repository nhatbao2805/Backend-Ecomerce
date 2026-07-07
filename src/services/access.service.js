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
                // cái này chỉ dành cho những hệ thống lớn hiện nay ngta đang ứng dụng vào trong một cái usb để mở khóa
                // created privateKey publicKey => privateKey là trả cho ng dùng kh lưu trong hệ thống, còn puiblicKey ngược lại
                // publicKey dùng để verifyToken ( tại vì giả sử hacker có log vào đc database thì cx chỉ có thể lấy ra để sign token thôi)
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: "pem"
                //     },
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: "pem"
                //     }
                // })

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey
                })

                if (!publicKeyString) {
                    return ({
                        code: "xxx",
                        messgae: "publicKeyString error !"
                    })
                }

                const pubicKeyObject = crypto.createPublicKey(publicKeyString)

                const tokens = await createTokenPair({ userId: newShop._id, email }, pubicKeyObject, privateKey);
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