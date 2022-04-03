const { render } = require('ejs');
const { itemModel } = require('../models/item');
const { tradeModel } = require('../models/item');

exports.index = (req, res, next) => {
    tradeModel.find()
        .then(tradeItems => {
            res.render('./item/index', { tradeItems });
        })
        .catch(err => {
            next(err)
        });
}

exports.findItemById = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}/)) {
        let err = new Error('Invalid trade id');
        err.status = 400;
        return next(err);
    }
    tradeModel.findById(req.query.category)
        .then(category => {
            if (category) {
                tradeModel.findOne({ _id: req.query.category }, { items: { $elemMatch: { _id: id } } })
                    .then(item => {
                        if (item.items.length > 0) {
                            let tradeItem = {
                                _id: category._id,
                                categoryName: category.categoryName,
                                item: item.items[0]
                            }
                            res.render('./item/show', { tradeItem });
                        }
                        else {
                            let err = new Error('Cannot find a item with id ' + id);
                            err.status = 404;
                            next(err);
                        }
                    })
                    .catch(err => {
                        next(err)
                    });
            }
            else {
                let err = new Error('Cannot find a item with category ' + req.query.category);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            next(err)
        });
}

exports.new = (req, res) => {
    res.render('./item/new');
}

exports.create = (req, res, next) => {
    let itemBody = req.body;
    let item = new itemModel({
        itemName: itemBody.itemName,
        itemDescription: itemBody.itemDescription,
        itemImage: '/images/camping-table.jpeg'
    })

    let trade = new tradeModel({
        categoryName: itemBody.categoryName,
        items: [item]
    })
    tradeModel.findOneAndUpdate({ categoryName: itemBody.categoryName }, { $push: { items: item } }, { upsert: true })
        .then(trade => res.redirect('/trades'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        })
}

exports.delete = (req, res, next) => {
    let id = req.params.id;
    let categoryId = req.query.category;
    if (!id.match(/^[0-9a-fA-F]{24}/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }
    tradeModel.findOneAndUpdate({_id:categoryId, "items._id":id}, {$pull: {items:{_id:id}}})
    .then(tradeItem => {
        if(tradeItem) {
            res.redirect('/trades');
        } else {
                let err = new Error('Cannot find item with id ' + itemId + "in the category");
                err.status = 404;
                next(err);
            }
    })
    .catch(err => {
        console.log('error');
        console.log(err);
        next(err);
    });
}

exports.edit = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }
    tradeModel.findById(req.query.category)
        .then(category => {
            if (category) {
                tradeModel.findOne({ _id: req.query.category }, { items: { $elemMatch: { _id: id } } })
                    .then(item => {
                        if (item.items.length > 0) {
                            let tradeItem = {
                                _id: category._id,
                                categoryName: category.categoryName,
                                item: item.items[0]
                            }
                            res.render('./item/edit', { tradeItem });
                        }
                        else {
                            let err = new Error('Cannot find a item with id ' + id);
                            err.status = 404;
                            next(err);
                        }
                    })
                    .catch(err => next(err));
            }
            else {
                let err = new Error('Cannot find a item with category ' + req.query.category);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err))
};

exports.update = (req, res, next) => {
    let tradeItem = req.body;
    let id = req.params.id;
    let categoryId = req.query.category;
    if (!id.match(/^[0-9a-fA-F]{24}/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }
    tradeModel.findOneAndUpdate({_id:categoryId, "items._id":id}, {$set: {
        "items.$.itemName":tradeItem.itemName,
        "items.$.itemDescription":tradeItem.itemDescription,
        "categoryName":tradeItem.categoryName
    }})
    .then(tradeItem => {
        if(tradeItem) {
            res.redirect('/trades');
        } else {
                let err = new Error('Cannot find item with id ' + itemId + "in the category");
                err.status = 404;
                next(err);
            }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
}