const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemController');

router.get('/', controller.index);

router.get('/new', controller.new);

router.post('/', controller.create);

router.get('/:id', controller.findItemById);

router.delete('/:id', controller.delete);

module.exports = router;