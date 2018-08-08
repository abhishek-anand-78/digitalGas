var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var json = bodyParser.json();
var http = require('http');
var fs = require('fs');

//mongodb configurations
var HOST = 'localhost';
var PORT = '27017';
var DB_NAME = 'customerDetails';
var MongoQuery = require('../src/app/Mongo/MongoQuery.js');
var ConnectionFactory = require('../src/app/Mongo/ConnectionFactory.js');

var connectionFactory = new ConnectionFactory('localhost', '27017', 'customerDetails');
connectionFactory.createPool().then(function () {
    console.log("Connection established to Database ==========>>>>>>>");
});


//nodejs sever configurations
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
    // wordcreator().then(function (response) {
    //     console.log("file created successfully");
    // });
    MongoQuery.inserUserRecord(DB_NAME, req.body, 'CustomerData').then(function (response) {
        console.log('Details inserted successfully...');
        res.status(200).send({ "success": 'Y', "data": response });
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })
});

app.post('/search', json, function (req, res) {
    console.log("Got a POST request for the search transaction page");
    console.log("req body >>>>>>>", req.body);
    MongoQuery.getAllUserData(DB_NAME, req.body, 'CustomerData').then(function (response) {
        console.log('Details found .....');
        res.status(200).send({ "success": 'Y', "data": response });
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })

});

wordcreator = function () {
    return new Promise(function (resolve, reject) {
        fs.writeFile('C:/Users/sinha_ab/Desktop/dg/downloads/out.docx', 'Hello', function (err) {
            if (err) throw err;
            console.log('Saved!');
            resolve();
        }),function(err){
            console.log("error while saving...");
        }
    })
}

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


app.get('/getSettings', json, function (req, res) {
    console.log(req.body);
    getSettings().then(function (resp) {
        res.status(200).send({ "success": 'Y', "data": resp });
    }, function (err) {
        res.status(500).send({ "success": 'N', msg: err });
    })
});

getSettings = function () {
    return new Promise(function (resolve, reject) {
        MongoQuery.getUserWithID(DB_NAME, 'user_settings', SETTINGS_TABLE_NAME).then(function (response) {
            if (response && response.length > 0) {
                response = response[0];
                if (response.hasOwnProperty('_id')) {
                    delete response['_id'];
                }
                resolve(response.settings)
            } else {
                resolve({})
            }

        }, function (msg) {
            reject({ "success": 'N', msg: msg });
        })
    })

}



app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})