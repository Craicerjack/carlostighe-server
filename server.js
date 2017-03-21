var http = require('http');
var express = require('express');
var app = express();

http.createServer(app).listen(60315, '0.0.0.0', function() {
    console.log(" - app started");
});

app.get('/', function(req, res) {
    res.send("Hello World!");
});
