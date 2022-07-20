const {tradeModel} = require('../models/item');

exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next()
    }
    else{
        req.flash('error','You are already logged in');
        return res.redirect('/users/profile');
    }
};

// check if the user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    }
    else{
        req.flash('error','You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    tradeModel.findById(req.query.category)
    .then(category => {
        if(category){
            tradeModel.findOne({ _id: req.query.category }, { items: { $elemMatch: { _id: id } } })
            .then(item => {
                if(item.items[0].user == req.session.user) {
                    return next();
                }
                else {
                    let err = new Error('Unauthorised to access the resources');
                    err.status = 401;
                    return next(err);
                }
            })
            .catch(err=>next(err))
        } else {
            let err = new Error('Unauthorised to access the resources');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err => next(err));
}

