const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const { findById } = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error",
            })
        }
        //check objKey co ton tai trong he thong chua
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error",
            })
        }

        req.objKey = objKey;
        return next();
    } catch (error) {

    }
}

const permission = (permission) => {

    // sẽ sử dụng hàm closesure là trả về một cái hàm và cái hàm đó có thể sử dụng các biến của hàm cha
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Denied",
            })
        }
        const validPermissions = req.objKey.permissions.includes(permission)
        if (!validPermissions) {
            return res.status(403).json({
                message: "Permission Denied",
            })
        }
        return next();
    }

}

module.exports = {
    apiKey,
    permission
}