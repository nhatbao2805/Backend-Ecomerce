const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandleError = require('../../helpers/asyncHandleError');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

router.get('/search/:keySearch', asyncHandleError(productController.getListSearchProduct));
router.get('', asyncHandleError(productController.getAllProduct));
router.post('/:product_id', asyncHandleError(productController.getOneProduct));
//authentication
router.use(authentication);
////////////////
router.post('', asyncHandleError(productController.createProduct));
//put thì sẽ cần update hết và patch thì chỉ cần update lại các thuộc tính cần thay đổi để tối ưu hóa băng thông
router.patch('/:productId', asyncHandleError(productController.updateProduct));
router.post('/publish/:id', asyncHandleError(productController.publishProductByShop));
router.post('/unPublish/:id', asyncHandleError(productController.unPublishProductByShop));


router.get('/drafts/all', asyncHandleError(productController.getAllDraftForShop));
router.get('/published/all', asyncHandleError(productController.getAllPublishedForShop));


module.exports = router;