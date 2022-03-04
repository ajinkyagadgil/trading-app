const { render } = require('ejs');
const model = require('../models/item');

exports.index = (req, res) => {
    let tradeItems = model.getAllTradeItems();
    res.render('./item/index', { tradeItems });
}

exports.findItemById = (req, res) => {
    let itemId = req.params.id;
    let tradeItem = model.findItemById(req.query.category, itemId);
    if (tradeItem) {
        res.render('./item/show', { tradeItem });
    } else {
        let err = new Error('Cannot find item with id ' + itemId + "in the category");
        err.status = 404;
        next(err);
    }
}

exports.new = (req, res) => {
    res.render('./item/new');
}

exports.create = (req, res) => {
    let item = req.body;
    model.createTrade(item);
    res.redirect('/trades');
}

exports.delete = (req, res, next) => {
    let itemId = req.params.id;
    let categoryId = req.query.category;
    if (model.deleteById(categoryId, itemId)) {
        res.redirect('/trades');
    } else {
        let err = new Error('Cannot find item with id ' + itemId + "in the category");
        err.status = 404;
        next(err);
    }
}

exports.edit = (req, res, next) => {
    let itemId = req.params.id;
    let categoryId = req.query.category;
    let tradeItem = model.findItemById(categoryId, itemId);
    if (tradeItem) {
        res.render('./item/edit', { tradeItem });
    } else {
        let err = new Error('Cannot find item with id ' + itemId + "in the category");
        err.status = 404;
        next(err);
    }
};

exports.update = (req, res) => {
    //
    let tradeItem = req.body;
    let itemId = req.params.id;
    let categoryId = req.query.category;
    if (model.updateById(itemId, categoryId, tradeItem)) {
        // res.redirect('/trades/' + itemId + "?category=" + categoryId)
        res.redirect('/trades');
    } else {
        let err = new Error('Cannot find item with id ' + itemId + "in the category");
        err.status = 404;
        next(err);
    }
}