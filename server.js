var express = require('express');
var app = express();

var http = require('http');
var url = require('url');

app.use('/', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/api', function (request, response) {

    var endPoint = url.parse(request.query.endpoint);

    var proxy = http.request(endPoint, function (res) {
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

    request.pipe(proxy, {
        end: true
    });
});
app.listen(process.env.PORT || 3000);