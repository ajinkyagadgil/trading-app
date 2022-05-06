const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemController');
const { isLoggedIn, isAuthor } = require('../middlewares/auth');
const { validateId, validateResult, validateTrade } = require('../middlewares/validator');

router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);

router.post('/', isLoggedIn,validateTrade,validateResult, controller.create);

router.get('/:id', validateId, controller.findItemById);

router.delete('/:id', isLoggedIn, isAuthor, validateId, controller.delete);

router.get('/:id/edit', isLoggedIn, isAuthor, validateId, controller.edit);

router.put('/:id', isLoggedIn, isAuthor,validateTrade,validateResult, validateId, controller.update);

router.post('/:id/watch', isLoggedIn, validateId, controller.watch)

router.post('/:id/unwatch', isLoggedIn, validateId, controller.unwatch)

module.exports = router;