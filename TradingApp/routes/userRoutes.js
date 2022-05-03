const express = require('express');
const controller = require('../controllers/userController');
const { logInLimiter } = require('../middlewares/rateLimiters');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const { validateSignUp, validateLogin, validateResult } = require('../middlewares/validator');

const router = express.Router();

router.get('/', controller.index);

router.get('/new', isGuest, controller.new);

router.post('/', isGuest, validateSignUp, validateResult, controller.create);

router.get('/login', isGuest, controller.login);

router.post('/login',logInLimiter, isGuest, validateLogin, validateResult, controller.authenticateLogin);

router.get('/profile', isLoggedIn, controller.profile);

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;