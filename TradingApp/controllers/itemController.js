const { render } = require('ejs');
const { itemModel } = require('../models/item');
const { tradeModel } = require('../models/item');

exports.index = (req, res, next) => {
    tradeModel.find()
        .then(tradeItems => {
            res.render('./item/index', { tradeItems });
        })
        .catch(err => {
            console.log(err);
            next(err)
        });
    // let tradeItems = model.getAllTradeItems();
    // res.render('./item/index', { tradeItems });
}

exports.findItemById = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}/)) {
        let err = new Error('Invalid Story id');
        err.status = 400;
        return next(err);
    }
    //tradeModel.findOne({_id:req.query.category}, {items:{$elemMatch:{_id:id}}})
    tradeModel.findById(req.query.category)
        .then(category => {
            if (category) {
                tradeModel.findOne({ _id: req.query.category }, { items: { $elemMatch: { _id: id } } })
                    .then(item => {
                        if (item) {
                            console.log('Item is', item)
                            let tradeItem = {
                                _id: category._id,
                                categoryName: category.categoryName,
                                item: item.items[0]
                            }
                            res.render('./item/show', { tradeItem });
                        }
                        else {
                            let err = new Error('Cannot find a story with id ' + id);
                            err.status = 404;
                            next(err);
                        }
                    })
                    .catch(err => next(err));
            }
            else {
                let err = new Error('Cannot find a story with category ' + req.query.category);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err))


    // tradeModel.findById(req.query.category)
    //     .then(category => {
    //         if (category) {
    //             tradeModel.findOne({_id:req.query.category}, {items:{$elemMatch:{_id:id}}})
    //                 .then(tradeItem => {
    //                     console.log("Trade item new is", tradeItem)
    //                     if (tradeItem) {
    //                         res.render('./item/show', { tradeItem });
    //                     }
    //                     else {
    //                         let err = new Error('Cannot find a story with id ' + id);
    //                         err.status = 404;
    //                         next(err);
    //                     }
    //                 })
    //                 .catch(
    //                     err => {
    //                         console.log(err.message);
    //                         next(err)
    //                     }
    //                 );
    //         }
    //         else {
    //             let err = new Error('Cannot find a story with category ' + req.query.category);
    //             err.status = 404;
    //             next(err);
    //         }
    //     })
    //     .catch(err => next(err));

    // let itemId = req.params.id;
    // let tradeItem = model.findItemById(req.query.category, itemId);
    // if (tradeItem) {
    //     res.render('./item/show', { tradeItem });
    // } else {
    //     let err = new Error('Cannot find item with id ' + itemId + "in the category");
    //     err.status = 404;
    //     next(err);
    // }
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
    //tradeModel.save()
    tradeModel.findOneAndUpdate({ categoryName: itemBody.categoryName }, { $push: { items: item } }, { upsert: true })
        .then(trade => res.redirect('/trades'))
        .catch(err => {
            console.log(err);
            next(err);
        })
    tradeModel.save(trade);
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
        res.redirect('/trades');
    } else {
        let err = new Error('Cannot find item with id ' + itemId + "in the category");
        err.status = 404;
        next(err);
    }
}