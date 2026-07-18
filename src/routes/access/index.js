const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();
//signUp

router.post(`/shop/signup`, asyncHandleError(accessController.signUp));
router.post(`/shop/login`, asyncHandleError(accessController.login));

//authentication
router.use(authentication);
////////////////
router.post(`/shop/logout`, asyncHandleError(accessController.logout));
router.post(`/shop/handlerRefreshToken`, asyncHandleError(accessController.handleRefreshToken));

module.exports = router;