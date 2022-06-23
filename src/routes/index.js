const express = require('express');
const router = express.Router();
const authRoutes = require('./userRoute')
const productRoutes = require('./productRoute')
const orderRoute = require('./orderRoute')

router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoute);


module.exports = router;