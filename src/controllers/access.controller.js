const AccessService = require("../services/access.service");

class AccessController {

    signUp = async (req, res, next) => {
        try {
            console.log(`[P]:::signUp:::`, req.body);
            const body = req.body;
            return res.status(201).json(await AccessService.signUp({
                name: body.name,
                email: body.email,
                password: body.password
            }))
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new AccessController();