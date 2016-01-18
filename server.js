var express = require('express');
var app = express();

var http = require('http');

app.use('/', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/api', function (request, response) {

    var stanbolUrl = request.originalUrl.replace('/api/','http://localhost:8080/');
    var proxy = http.request(stanbolUrl, function (res) {
        res.pipe(response, {
            end: true
        })
    }).on('error', function (err) {
        return(err);
    });

    // Use default auth for using local instance of stanbol
    proxy.setHeader('Authorization', 'Basic YWRtaW46YWRtaW4=');
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