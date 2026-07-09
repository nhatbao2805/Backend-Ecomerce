const AccessService = require("../services/access.service");
const { CREATED } = require('../core/success.response')
class AccessController {

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