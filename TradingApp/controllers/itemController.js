const model = require('../models/item');

exports.index = (req, res) => {
    let tradeItems = model.getAllTradeItems();
    res.render('./item/index', { tradeItems });
}

exports.findItemById = (req, res) => {
    let tradeItem = model.findItemById(req.query.category, req.params.id);
    res.render('./item/show', { tradeItem });
}