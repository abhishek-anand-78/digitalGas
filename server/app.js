var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var json = bodyParser.json();
var http = require('http');
var fs = require('fs');
const pdfInvoice = require('./pdf-invoice');
const generateExcel = require('./create_excel/createExcel');

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
    console.log("req body >>>>>>>", req.body);
    wordcreator(req.body).then(function (data) {

        res.sendFile('G:\\digitalGas\\downloads\\file_4.pdf');
        console.log("file created successfully");        
    });
        
    MongoQuery.inserUserRecord(DB_NAME, req.body, 'CustomerData').then(function (response) {
        console.log('Details inserted successfully...');
        // res.status(200).send({ "success": 'Y', "data": response });               
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
        // res.status(200).sendFile("C:\\Users\\Vivek\\Desktop\\new\\out.doc");        
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })
});

// handle download excel file
app.post('/downloadexcel', json, function (req, res) {            
    MongoQuery.getAllUserData(DB_NAME, req.body, 'CustomerData').then( function (response) {
         generateExcel(response).then(function (){
            res.sendFile('G:\\digitalGas\\downloads\\temp.xlsx');
            console.log('Details found .....');
         }, function(error){
             console.log('error while sending response');
         });        
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })
});


wordcreator = function (data) {    
    const document = pdfInvoice({
        company: {
          phone: '(99) 9 9999-9999',
          email: 'company@evilcorp.com',
          address: '106 New Pimpri, Wakad, Pune',
          name: 'Gas Agency Name',
        },
        customer: {
          name: data.customerName,
          email: ' , Address :- '+ data.address,
        },
        items: [
          {amount: data.totalAmount, name: data.rate, description: data.description, quantity: data.quantity},
          {amount: (data.totalAmount * Number(data.sgst/100)).toFixed(2), name: data.sgst + '%', description: 'SGST %', quantity: '-'},
          {amount: (data.totalAmount * Number(data.cgst/100)).toFixed(2), name: data.cgst + '%', description: 'CGST %', quantity: '-'},
          {amount: data.netAmountPayable, name: 'SUM Total', description: '-', quantity: '-'},
          {amount: data.amountPaid, name: 'Amount paid', description: '-', quantity: '-'},
          {amount: data.amountDue, name: 'Amount due', description: '-', quantity: '-'}          
        ],
      })
    return new Promise(function (resolve, reject) {
        document.generate() // triggers rendering        
        document.pdfkitDoc.pipe(fs.createWriteStream('G:\\digitalGas\\downloads\\file_4.pdf'));
        setTimeout(function(){
            resolve();
        },1000)        
    })
}


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
})