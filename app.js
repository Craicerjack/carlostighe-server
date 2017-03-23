'use strict';
//THRID PARTY MODULES
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var index = require('./routes/index');
var users = require('./routes/users');
var spotify = require('./routes/spotify');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

var configuration = { rootpath: __dirname };
require('./config/app')(app, configuration);


app.use(logger('dev'));

app.use('/', index);
app.use('/users', users);
app.use('/spotify', spotify);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
