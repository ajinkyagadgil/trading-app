const { render } = require('ejs');
const model = require('../models/item');

exports.index = (req, res) => {
    let tradeItems = model.getAllTradeItems();
    res.render('./item/index', { tradeItems });
}

exports.findItemById = (req, res) => {
    let tradeItem = model.findItemById(req.query.category, req.params.id);
    res.render('./item/show', { tradeItem });
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
    let id = req.params.id;
    if (model.deleteById(id)) {
        res.redirect('/trades');
    } else {
        // let err = new Error('Cannot find story with id ' + id);
        // err.status = 404;
        // next(err);
    }
}