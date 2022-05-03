const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowsMs: 60*1000, //1 min time windows
    max: 5,
    //message: 'Too Many login requests. Try again later'
    handler: (req, res, next) => {
        let err = Error('Too many login request. Try again later');
        err.status = 429;
        next(err);
    }
});