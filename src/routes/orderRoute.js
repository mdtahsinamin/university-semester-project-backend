const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const {isAuthenticatedUser, verifyAdmin} = require('../middleware/verifyAuth');


router.post('/new-order',isAuthenticatedUser,orderController.createNewOrder);
router.get('/:id',isAuthenticatedUser,orderController.getSingleOrder);

router.get('/orders/my',isAuthenticatedUser,orderController.myOrders);

router.get('/admin/orders',isAuthenticatedUser,verifyAdmin("admin"),orderController.getAllOrders)

router.put('/admin/:id',isAuthenticatedUser,verifyAdmin("admin"),orderController.updateOrderStatus);

router.delete('/admin/delete/:id',isAuthenticatedUser,verifyAdmin("admin"),orderController.deleteOrder)

module.exports = router