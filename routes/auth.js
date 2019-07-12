const express = require('express');
const router = express.Router();
const authContoller = require('../controllers/authController');

router.get('/login', authContoller.getLogin);
router.post('/login', authContoller.postLogin);

router.get('/signup', authContoller.getSignup);
router.post('/signup', authContoller.postSignup);

router.get('/logout', authContoller.getLogout);

module.exports = router;