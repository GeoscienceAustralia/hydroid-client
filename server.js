var express = require('express');
var app = express();

var http = require('http');
var request = require('request');

app.use('/', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/api', function (req, response) {

    var stanbolUrl = req.originalUrl.replace('/api/','http://admin:admin@localhost:8080/');
    var proxy = http.request({
        headers: {

        },
        uri: stanbolUrl,
        method: 'GET'
    },function (res) {
        res.pipe(response, {
            end: true
        })
    }).on('error', function (err) {
        return(err);
    });

    proxy.setTimeout(10000);

    proxy.on('timeout', function (socket) {
        response.statusCode = 408;
        response.end();
    });

    req.pipe(proxy, {
        end: true
    });
});
app.listen(process.env.PORT || 3000);