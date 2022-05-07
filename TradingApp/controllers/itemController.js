const { render } = require('ejs');
const { itemModel } = require('../models/item');
const { tradeModel } = require('../models/item');
const watchModel = require('../models/watch');
const ObjectId = require('mongodb').ObjectId;

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

    Promise.all([tradeModel.findById(req.query.category), watchModel.findOne({ user: req.session.user }, { watchedItems: { $elemMatch: { itemId: id } } })])
        .then(result => {
            const [category, watchList] = result
            if (category) {
                tradeModel.findOne({ _id: req.query.category }, { items: { $elemMatch: { _id: id } } })
                    .then(item => {
                        if (item.items.length > 0) {
                            let tradeItem = {
                                _id: category._id,
                                categoryName: category.categoryName,
                                item: item.items[0]
                            }
                            console.log("In show", watchList);
                            res.render('./item/show', { tradeItem, watchList });
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
        itemImage: '/images/camping-table.jpeg',
        status: "Available"
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
    let id = req.params.id;
    let itemName = req.body.itemName;
    console.log(itemName);
    let item = {
        itemId: id,
        itemName: itemName
    }

    watchModel.findOneAndUpdate({ "user": req.session.user }, { $push: { watchedItems: item } }, { upsert: true })
        .then(result => {
            res.redirect('/users/profile');
        })
        .catch(err => next(err));
}

exports.unwatch = (req, res, next) => {
    let id = req.params.id;

    watchModel.findOneAndUpdate({ "user": req.session.user, "watchedItems._id": id }, { $pull: { watchedItems: { _id: id } } })
        .then(watchItem => {
            if (watchItem) {
                req.flash('success', 'Item unwatched');
                res.redirect('/users/profile');
            } else {

                next(err);
            }
        })
        .catch(err => {

            next(err);
        });
}

//get the details of item of the other user I want to trade
exports.itemOffer = (req, res, next) => {
    let itemAginstId = req.params.id;
    Promise.all([tradeModel.aggregate([{ $unwind: "$items" }, { $match: { "items.user": ObjectId(req.session.user), "items.status": "Available" } }]), tradeModel.findOne({ "items._id": itemAginstId }, { items: { $elemMatch: { _id: itemAginstId } } })])
        .then(results => {
            const [categoryItems, itemAgainst] = results;
            console.log("Category is", categoryItems);
            console.log("itemAgainst is", itemAgainst);
            res.render('./item/tradeOffer', { categoryItems, itemAgainst })
        })
        .catch(err => next(err))
}

exports.completeTrade = (req, res, next) => {
    let itemAgainstId = req.body.itemAgainstId;
    let chosedItemId = req.params.id;
    let itemAgainstUser = req.body.itemAgainstUser;

    console.log("Item against id", itemAgainstId);
    console.log("Chosed item is ", chosedItemId);
    console.log("Item agaainst user ", itemAgainstUser);

    Promise.all([tradeModel.findOneAndUpdate({ "items._id": chosedItemId }, {
        $set: {
            "items.$.status": "Pending",
            "items.$.trade.itemTradedAgainstUser": itemAgainstUser,
            "items.$.trade.itemTradedAgainstId": itemAgainstId,
            "items.$.trade.itemToTradeId": chosedItemId,
            "items.$.trade.itemToTradeUser": req.session.user
        }
    }),
    tradeModel.findOneAndUpdate({ "items._id": itemAgainstId }, {
        $set: {
            "items.$.status": "Pending",
            "items.$.trade.itemTradedAgainstUser": req.session.user,
            "items.$.trade.itemTradedAgainstId": chosedItemId,
             "items.$.trade.itemToTradeId": itemAgainstId,
            "items.$.trade.itemToTradeUser": itemAgainstUser
        }
    })
    ]).then(result => {
        console.log(result)
    })
        .catch(err => next(err))

}