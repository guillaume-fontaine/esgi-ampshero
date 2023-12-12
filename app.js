var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const passportMiddleware = require("./middlewares/passport")();
const User = require("./models/User");

const authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const brandsRouter = require('./routes/brands');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passportMiddleware.initialize());
passport.use(User.createStrategy());

app.use('/', indexRouter /* #swagger.ignore = true */);
app.use('/', authRouter /* #swagger.ignore = true */);
app.use('/users', usersRouter /* #swagger.tags = ['Users'] */);
app.use('/brands', brandsRouter /* #swagger.tags = ['Brands'] */);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
