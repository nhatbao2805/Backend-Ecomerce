const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.servcie");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {

    /* 
        1. check email in dbs
        2. match password
        3. create AT and RT and save
        4. generate tokens
        5. get data return login
    */

    static logIn = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Error: Shop Not Registered !');
        }

        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Error: Authentication Error !');

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId: userId, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({ userId: userId, publicKey, privateKey, refreshToken: tokens.refreshToken })
        return {
            shop: getInforData({ fields: ["_id", "email", "name"], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // step1: check email exists ??
        const hodelShop = await shopModel.findOne({ email: email }).lean(); //lean() trả về 1 object javascript thuần túy giúp tối ưu hóa thời gian hơn
        if (hodelShop) {
            throw new BadRequestError('Error: Shop already registered')
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
                throw new BadRequestError('Error: KeyStore Invalid')
            }

            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            return {
                shop: getInforData({ fields: ["_id", "email", "name"], object: newShop }),
                tokens
            }
        }

    }

}

module.exports = AccessService;