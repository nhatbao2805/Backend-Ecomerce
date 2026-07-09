const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandleError } = require('../..//auth/checkAuth');

const router = express.Router();
//signUp

router.post(`/shop/signup`, asyncHandleError(accessController.signUp))

module.exports = router;