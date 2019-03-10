var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var json = bodyParser.json();
var http = require('http');
var fs = require('fs');
const pdfInvoice = require('./pdf-invoice');
const generateExcel = require('./create_excel/createExcel');
// const file_path = 'E:\\github\\digitalGas\\downloads';
const file_path = 'C:\\Users\\Yogi Tarun\\Desktop\\digitalGas\\downloads';
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

app.post('/generatePDF', json, function (req, res) {    
    console.log("req body >>>>>>>", req.body);
    wordcreator(req.body).then(function (data) {
        res.sendFile(file_path+ '\\'+ req.body.customerName + "_" + req.body.date + ".pdf");  
    });
        
    MongoQuery.inserUserRecord(DB_NAME, req.body, 'CustomerData').then(function (response) {
        console.log('Details inserted successfully...');
        // res.status(200).send({ "success": 'Y', "data": response });               
    }, function (msg) {
        console.log("DB error occurred...", msg);        
        res.status(500).send({ "success": 'N', msg: msg });
    })
});

app.post('/generatepdf_customer', json, function (req, res) {
    console.log("Got a POST request for the search transaction page");
    console.log("req body >>>>>>>", req.body);
    wordcreator(req.body).then(function (data) {
        res.sendFile(file_path+ '\\'+ req.body.customerName + "_" + req.body.date + ".pdf");  
    });    
});

app.post('/savebill', json, function (req, res) {    
    console.log("req body >>>>>>>", req.body);
            
    MongoQuery.inserUserRecord(DB_NAME, req.body, 'CustomerData').then(function (response) {
        // console.log('Details inserted successfully...');
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
        // res.status(200).sendFile("C:\\Users\\Vivek\\Desktop\\new\\out.doc");        
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    }).catch(function(e){
        console.log(e);
    })
});

// handle download excel file
app.post('/downloadexcel', json, function (req, res) {                
    if(req.body.month == "whole"){
        MongoQuery.getYearlyBillData(DB_NAME, req.body, 'CustomerData').then( function (response) {        
            generateExcel(response, req.body).then(function (){
                res.sendFile(file_path + '\\temp.xlsx');
                console.log('Details found .....');
            }, function(error){
                console.log('error while sending response');
            });        
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        })
    }else{
        MongoQuery.getMonthlyBillData(DB_NAME, req.body, 'CustomerData').then( function (response) {        
            generateExcel(response, req.body).then(function (){
                res.sendFile(file_path +'\\temp.xlsx');
                console.log('Details found .....');
            }, function(error){
                console.log('error while sending response');
            });        
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        })
    }
});


wordcreator = function (data) {    
    const document = pdfInvoice({
        company: {
          phone: 'pH: 9623961009',
          email: 'spgasagency@gmail.com',
          address1: 'Near Canal, Karad Vita Road,',
          address2: 'Karad, Dist. Satara',
          name: 'SP Gas Agency,',
        },
        date: data.date,
        customer: {
          name: data.customerName,
          address: 'Address :- '+ data.address,
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
        // triggers rendering        
        document.generate(); 
        document.pdfkitDoc.pipe(fs.createWriteStream(file_path+ '\\' + data.customerName + "_" + data.date + ".pdf"));
        setTimeout(function(){
            resolve();
        },1000)                
    }, function(err) {
        reject(err);
        console.log();
    })
}

app.post('/update', json, function(req, res){
    console.log(DB_NAME, req.body.userID, req.body.data, 'CustomerData');
    MongoQuery.updateUserRecord(DB_NAME, req.body.userID, req.body.data, 'CustomerData').then(function (response) {
        console.log('Details updated successfully...');
        res.status(200).send({ "success": 'Y', "data": response });               
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })
});

app.post('/fetchbill', json, function (req, res) {  
    console.log("req body >>>>>>>", req.body);
    if(req.body.month == "whole"){
        MongoQuery.getYearlyBillData(DB_NAME, req.body, 'CustomerData').then(function (response) {
            console.log('Details found .....');
            res.status(200).send({ "success": 'Y', "data": response });
            // res.status(200).sendFile("C:\\Users\\Vivek\\Desktop\\new\\out.doc");        
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        })
    }else{
        MongoQuery.getMonthlyBillData(DB_NAME, req.body, 'CustomerData').then(function (response) {
            console.log('Details found .....');
            res.status(200).send({ "success": 'Y', "data": response });
            // res.status(200).sendFile("C:\\Users\\Vivek\\Desktop\\new\\out.doc");        
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        });
    }
    
});

app.post('/getprofit', json, function (req, res) {  
    console.log("req body >>>>>>>", req.body);
    if(req.body.month == "whole"){
        MongoQuery.getYearlyProfit(DB_NAME, req.body, 'CustomerData').then(function (response) {
            console.log('Details found .....');
            res.status(200).send({ "success": 'Y', "data": response });            
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        })
    }else{
        MongoQuery.getMonthlyProfit(DB_NAME, req.body, 'CustomerData').then(function (response) {
            console.log(req.body);
            res.status(200).send({ "success": 'Y', "data": response });            
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        })
    }
});

app.post('/downloadexcelProfit', json, function (req, res) {                
    if(req.body.month == "whole"){
        MongoQuery.getYearlyProfit(DB_NAME, req.body, 'CustomerData').then( function (response) {        
            generateExcel(response, req.body).then(function (){
                res.sendFile(file_path+ '\\temp.xlsx');
                // 'G:\\digitalGas\\downloads\\' + data.billNumber + "_" + data.date + ".pdf"'
                console.log('Details found .....');
            }, function(error){
                console.log('error while sending response');
            });        
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        })
    }else{
        MongoQuery.getMonthlyProfit(DB_NAME, req.body, 'CustomerData').then( function (response) {        
            generateExcel(response, req.body).then(function (){
                res.sendFile(file_path + '\\temp.xlsx');
                console.log('Details found .....');
            }, function(error){
                console.log('error while sending response');
            });        
        }, function (msg) {
            console.log("DB error occurred...", msg);
            res.status(500).send({ "success": 'N', msg: msg });
        })
    }
});

app.post('/adddealer', json, function (req, res) {    
    console.log("req body >>>>>>>", req.body);
    
    MongoQuery.inserUserRecord(DB_NAME, req.body, 'DealerData').then(function (response) {
        console.log('Details inserted successfully...');
        res.status(200).send({ "success": 'Y', "data": response });               
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })
});

app.get('/dealerList', json, function (req, res) {    
    console.log("req body >>>>>>>", req.body);
    MongoQuery.getDealerList(DB_NAME, req.body, 'DealerData').then(function (response) {    
        console.log('Details found successfully...');
        res.status(200).send({ "success": 'Y', "data": response });               
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })
});

app.get('/customerList', json, function (req, res) {    
    console.log("req body >>>>>>>", req.body);
    MongoQuery.getCustomerList(DB_NAME, req.body, 'CustomerData').then(function (response) {    
        console.log('Details found successfully...');
        res.status(200).send({ "success": 'Y', "data": response });               
    }, function (msg) {
        console.log("DB error occurred...", msg);
        res.status(500).send({ "success": 'N', msg: msg });
    })
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
})
