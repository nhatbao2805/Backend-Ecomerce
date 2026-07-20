const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

router.get('/search/:keySearch', asyncHandleError(productController.getListSearchProduct));
//authentication
router.use(authentication);
////////////////
router.post('', asyncHandleError(productController.createProduct));
router.post('/publish/:id', asyncHandleError(productController.publishProductByShop));
router.post('/unPublish/:id', asyncHandleError(productController.unPublishProductByShop));


router.get('/drafts/all', asyncHandleError(productController.getAllDraftForShop));
router.get('/published/all', asyncHandleError(productController.getAllPublishedForShop));


module.exports = router;