var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
const config = require('./config/database');
const mongoose = require('mongoose');
const passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');

// connect mongo db
mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});
// check error
db.on('error', function(err){
    console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'wosdwswdwdwdwqdwqddqwdwdqdqwot',
    resave: false, 
    saveUninitialized: false}));
// express-messages middleware for flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.errors = req.flash("error");
  res.locals.successes = req.flash("success");
  next();
});
// passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);

// passport config
require('./config/passport')(passport);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
