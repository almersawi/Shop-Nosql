const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/products');
const isAuth = require('../middleware/is-auth');

router.get('/products', productsControllers.getProducts);
router.get('/products/:productId', productsControllers.getProduct);
router.get('/cart', isAuth, productsControllers.cartPage);
router.post('/add-to-card', isAuth, productsControllers.postCart);
router.post('/delete-from-cart', isAuth, productsControllers.deleteFromCart)
router.get('/orders', isAuth, productsControllers.ordersPage);
router.get('/', productsControllers.indexPage);
router.post('/create-order', isAuth, productsControllers.createOrder);

module.exports = router;