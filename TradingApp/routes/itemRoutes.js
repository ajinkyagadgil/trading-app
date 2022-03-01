const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemController');

router.get('/', controller.index);

router.get('/:id', controller.findItemById);

module.exports = router;