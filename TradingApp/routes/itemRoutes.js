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

router.post('/:id/watch', isLoggedIn, validateId, controller.watch);

router.post('/:id/unwatch', isLoggedIn, validateId, controller.unwatch);

router.get('/:id/itemOffer', isLoggedIn, validateId, controller.itemOffer);

router.post('/:id/itemOffer', isLoggedIn, validateId, controller.completeTrade);

router.post('/:id/itemOffer/cancel', isLoggedIn, validateId, controller.cancelTrade);

router.get('/:id/itemOffer/manage', isLoggedIn, validateId, controller.manageOffer);

router.post('/:id/itemOffer/accept', isLoggedIn, validateId, controller.acceptOffer);

module.exports = router;