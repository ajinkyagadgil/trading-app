const User = require('../models/user');
const {tradeModel} = require('../models/item');
const {itemModel} = require('../models/item');
const watchModel = require('../models/watch');
const ObjectId = require('mongodb').ObjectId;

exports.index = (req, res) => {
    res.render('index');
}

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = ((req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then(() => {
            res.redirect('./users/login');
        })
        .catch(err => {
            if(err.name === 'ValidationError') {
                req.flash('error', err.message);
                res.redirect('/users/new');
            }

            if(err.code == 11000) {
                req.flash('error', "Email address already been used");
                res.redirect('/users/new');
            }
            next(err)
        });
});

exports.login = (req, res) => {
    res.render('./user/login');
};

exports.authenticateLogin = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.flash('success','You have sucessfully logged in');
                            res.redirect('/users/profile')
                        } else {
                            req.flash('error','Wrong password');
                            res.redirect('/users/login')
                        }
                    });
            } else {
                req.flash('error','Wrong email address');
                res.redirect('/users/login');
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;

    Promise.all([User.findById(id), tradeModel.aggregate([ { $unwind : "$items" }, { $match : { "items.user" : ObjectId(id) } } ]),  watchModel.findOne({user: req.session.user}), tradeModel.aggregate([ { $unwind : "$items" }, { $match : { "items.trade.itemTradedAgainstUser" : ObjectId(id) } } ])])
        .then(result => {
            const [user, categoryItems, watchList, loggedInUserStartedTrades] = result;
            res.render('./user/profile', {user, categoryItems, watchList, loggedInUserStartedTrades});
            
        })
        .catch(err => {next(err)});
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            return next(err)
        } else {
            res.redirect('/users/login');
        }
    });
}

