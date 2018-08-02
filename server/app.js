var express = require('express');
var cors = require('cors');
var app = express();
//app.use(cors());
var bodyParser = require('body-parser');
var json = bodyParser.json();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, authorization, Content-Length, X-Requested-With');
    next();
});


app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
})

app.post('/myaction', json, function (req, res) {
    console.log("Got a POST request for the homepage");
    console.log("req body >>>>>>>", req.body);
    res.send('Hello POST');
})


app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})