/*jslint node: true, todo: true*/

/**
  Requires
**/
var express = require('express');
var cors = require('cors');
var path = require('path');
var app = express();

/**
  Middlewares
**/
app.use(cors());

/**
  Settings
**/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/**
  Routes
**/

/**
  Error handlers
**/
/*jslint unparam: true*/
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/**
  Production
**/
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
/*jslint unparam: false*/

/**
  Listening
**/
app.listen(3000, function () {
  console.log('Listening in localhost:3000');
});