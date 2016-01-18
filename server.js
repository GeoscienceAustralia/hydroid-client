var express = require('express');
var app = express();

var http = require('http');
var fs = require('fs');
var config = null;
if(fs.existsSync('local-config.json')) {
    config = require('local-config.json');
} else {
    config = {
        useProxy: false,
        stanbolPath: 'http://hydroid-dev-web-lb-1763223935.ap-southeast-2.elb.amazonaws.com/stanbol'
        //stanbolPath: 'http://localhost:8080/'
    }
}

app.use('/', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/api', function (request, response) {

    var stanbolUrl = request.originalUrl.replace('/api/',config.stanbolPath);
    var proxy;
    if(config.useProxy) {
        var options = {
            host: config.proxy.host,
            port: config.proxy.port,
            path: stanbolUrl
        };
        proxy = http.request(options, function (res) {
            res.pipe(response, {
                end: true
            })
        });
    } else {
        proxy = http.request(stanbolUrl, function (res) {
            res.pipe(response, {
                end: true
            })
        });
    }

    proxy.on('error', function (err) {
        return(err);
    });

    // Use default auth for using local instance of stanbol
    proxy.setHeader('Content-Type', 'application/json');
    proxy.setHeader('Accept', 'application/json');

    proxy.setTimeout(10000);

    proxy.on('timeout', function (socket) {
        response.statusCode = 408;
        response.end();
    });

    request.pipe(proxy, {
        end: true
    });
});
app.listen(process.env.PORT || 3000);