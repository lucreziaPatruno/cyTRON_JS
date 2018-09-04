var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var MemoryStore = require('memorystore')(session)

var indexRouter = require('./routes/index');
var troncoRouter = require('./routes/tronco');
var welcomeRouter = require('./routes/welcome');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// The following tells express/node that the public directory should act as your web root.
// By using the command multiple times, Express looks up the files in the order in which you set 
// the static directories with the express.static middleware function.
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/node_modules')))
app.use(session({ store: new MemoryStore({
                  checkPeriod: 86400000 // prune expired entries every 24h
                }),
                secret : 'First secret',
                name : "id",
                }))

app.use('/', indexRouter);
app.use('/tronco', troncoRouter);
app.use('/welcome', welcomeRouter);

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
