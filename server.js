var express = require('express');
var app = express();

var http = require('http');
var fs = require('fs');
var config = null;
if(fs.existsSync('./local-config.json')) {
    config = require('./local-config.json');
} else {
    config = {
        useProxy: false
    }
}

config.solrUrl = config.solrUrl || 'http://localhost:8983/solr/';
config.apiUrl = config.apiUrl || 'http://localhost:9090/api/';

app.use('/', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
//app.use('/api', function (request, response) {

app.use('/solr', function (request, response) {

    var solrUrl = request.originalUrl.replace('/solr/', config.solrUrl);
    var proxy;
    if (config.useProxy) {
        var options = {
            host: config.proxy.host,
            port: config.proxy.port,
            path: solrUrl
        };
        proxy = http.request(options, function (res) {
            res.pipe(response, {
                end: true
            })
        });
    } else {
        proxy = http.request(solrUrl, function (res) {
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

app.use('/api', function (request, response) {

    var apiUrl = request.originalUrl.replace('/api/', config.apiUrl);
    var proxy;
    if (config.useProxy) {
        var options = {
            host: config.proxy.host,
            port: config.proxy.port,
            path: apiUrl,
            method: request.method
        };
        proxy = http.request(options, function (res) {
            res.pipe(response, {
                end: true
            })
        });
    } else {
        var options = {
            port: 9090,
            path: apiUrl,
            method: request.method
        };
        proxy = http.request(options, function (res) {
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