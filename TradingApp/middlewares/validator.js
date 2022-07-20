const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid trade id');
        err.status = 400;
        return next(err);
    }
    else {
        next();
    }
}

exports.validateSignUp = [body('firstName','Firstname cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Lastname cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min:8, max:64})
];

exports.validateLogin = [body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min:8, max:64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateTrade = [body('categoryName','Category Name cannot be empty').notEmpty().trim().escape(),
body('itemName', 'Item name cannot be emoty').notEmpty().trim().escape(),
body('itemDescription','Item Description cannot be empty').notEmpty().trim().escape(),
];