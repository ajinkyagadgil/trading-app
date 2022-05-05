const { render } = require('ejs');
const { itemModel } = require('../models/item');
const { tradeModel } = require('../models/item');
const watchModel = require('../models/watch');

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
        user: req.session.user,
        itemName: itemBody.itemName,
        itemDescription: itemBody.itemDescription,
        itemImage: '/images/camping-table.jpeg'
    })

    let trade = new tradeModel({
        categoryName: itemBody.categoryName,
        items: [item]
    })
    tradeModel.findOneAndUpdate({ categoryName: itemBody.categoryName }, { $push: { items: item } }, { upsert: true })
        .then(trade => {
            req.flash('success', 'Trade created successfully');
            res.redirect('/trades')
        })
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

    tradeModel.findOneAndUpdate({ _id: categoryId, "items._id": id }, { $pull: { items: { _id: id } } })
        .then(tradeItem => {
            if (tradeItem) {
                req.flash('success', 'Trade deleted successfully');
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

    tradeModel.findOneAndUpdate({ _id: categoryId, "items._id": id }, {
        $set: {
            "items.$.itemName": tradeItem.itemName,
            "items.$.itemDescription": tradeItem.itemDescription,
            "categoryName": tradeItem.categoryName
        }
    })
        .then(tradeItem => {
            if (tradeItem) {
                req.flash('success', 'Trade updated successfully');
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

exports.watch = (req, res, next) => {
    let itemId = req.params.id;
    console.log("User is", req.session.user);
    watchModel.findOneAndUpdate({ "user": req.session.user }, { $push: { watchedItems: itemId } }, { upsert: true })
        .then(result => {
            res.redirect('/users/profile');
        })
        .catch(err => next(err));
}