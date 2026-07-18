const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require('../core/success.response')
class AccessController {

    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Token success !",
            metaData: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res);
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout success !",
            metaData: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    login = async (req, res, next) => {
        const body = req.body;
        // return res.status(200).json(await AccessService.signUp({
        //     name: body.name,
        //     email: body.email,
        //     password: body.password
        // }))
        new SuccessResponse({
            metaData: await AccessService.logIn({
                email: body.email,
                password: body.password
            })
        }).send(res);
    }

    signUp = async (req, res, next) => {
        const body = req.body;
        // return res.status(200).json(await AccessService.signUp({
        //     name: body.name,
        //     email: body.email,
        //     password: body.password
        // }))
        new CREATED({
            message: 'Registred OK!',
            metaData: await AccessService.signUp({
                name: body.name,
                email: body.email,
                password: body.password
            })
        }).send(res);
    }

}

module.exports = new AccessController();