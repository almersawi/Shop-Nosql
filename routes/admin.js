const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// admin/add-product => get
router.get('/add-product', isAuth, adminController.getAddProduct);

// admin/products => get
router.get('/products', isAuth, adminController.adminProducts);

// admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

 //get edit products
router.get('/edit-product/:prodId', isAuth, adminController.adminEditProducts);

// post edit product
router.post('/edit-product', isAuth, adminController.editProduct);

// Delete product
router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;