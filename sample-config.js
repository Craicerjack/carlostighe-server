// THIS FILE SHOULD BE IN A CONFIG FOLDER ALONG WITH A CONFIG.JSON FILE
// THIS IS JUST AN EXAMPLE FILE

var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var multer          = require('multer');


module.exports = function(app, config) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        next();
    });
    // view engine setup - USE JADE
    app.set('views', path.join(config.rootPath, 'views'));
    app.set('view engine', 'pug');
    app.use(favicon(path.join(config.rootPath, 'public', 'favicon.ico')));
    //use body parser for file uploads
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(multer({ dest: "../images/" }));

    //COOKIES
    app.use(cookieParser());

    app.use(require('flash')());
    app.use(express.static(path.join(config.rootPath, 'public')));
}
