const express = require("express");
const router = express.Router();

const orderManagementController = require('../controllers/orderManagementController')

router.get('/order', orderManagementController.showOrder);
router.post('/confirm', orderManagementController.confirmOrder);
router.get('/food', orderManagementController.showFood);
router.get('/type', orderManagementController.showType);
// router.post('/searchAccount', revenueController.searchAccountId);
// router.post('/searchItem', revenueController.searchItemId);
// router.post('/searchProduct', revenueController.searchProductId);
module.exports = router;