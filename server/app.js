var express = require('express');
var cors = require('cors');
var app = express();
var download = require('download-file')
//app.use(cors());
var bodyParser = require('body-parser');
var json = bodyParser.json();
var http = require('http');
var fs = require('fs');

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

// var url = "http://localhost:4200/";
// var dest = 'C:/Users/sinha_ab/Desktop/dg/downloads/out.docx'
//  download(url, dest, function () {
//         console.log("executed");
//     });
// var download = function (url, dest, cb) {
//     var file = fs.createWriteStream(dest);
//     var request = http.get(url, function (response) {
//         response.pipe(file);
//         file.on('finish', function () {
//             file.close(cb);  // close() is async, call cb after close completes.
//         });
//     }).on('error', function (err) { // Handle errors
//         fs.unlink(dest); // Delete the file async. (But we don't check the result)
//         if (cb) cb(err.message);
//     });
// };






app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})