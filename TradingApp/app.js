//require
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const mainRoutes = require('./routes/mainRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');

//create app
const app = express();

//config app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/tradesdb', {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => {
        //start the server
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        })
    })
    .catch(err => console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret:'snksdskndk98khsd0likj',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl:'mongodb://localhost:27017/tradesdb'})
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    console.log(req.session);
    next();
});


//routes
app.use('/trades', itemRoutes);
app.use('/', mainRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate '+req.url);
    err.status = 404;
    next(err);
})
// app.use((err, req, res, next) => {
//     if(!err.status) {
//         err.status = 500;
//         err.message = ("Internal Server Error");
//     }
//     res.status(err.status);
//     res.render('error', {error: err});
// });
