const JWT = require('jsonwebtoken')
const asyncHandleError = require('../helpers/asyncHandleError')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.servcie')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        return { accessToken, refreshToken }
    } catch (error) {

    }
}

const authentication = asyncHandleError(async (req, rest, next) => {
    /* 
      1. check userId missing
      2. get accessToken
      3. Verify token
      4. check user in bds
      5. check keysotre with this userId
      6. OK all => return next()
  */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request");

    //2
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not Found KeyStore");

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!keyStore) throw new AuthFailureError("Invalid Request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid User");
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }

})

module.exports = {
    createTokenPair,
    authentication
}