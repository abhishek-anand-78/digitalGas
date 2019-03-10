var Excel = require('exceljs');
var fs = require('fs');
// const file_path = 'E:\\github\\digitalGas\\downloads\\temp.xlsx';
const file_path = 'C:\\Users\\Yogi Tarun\\Desktop\\digitalGas\\downloads\\temp.xlsx'

// _________exceute if no mongodb connection________________
//var rawdata = fs.readFileSync("mock.json");
//response = JSON.parse(rawdata);
//console.log("this.response", response);
// generateExcel = function(){  
var generateExcel = function (response, header_excel) {
    let temp = response[0];
    console.log(response);
    let flag = 'none';
    for(i in temp){
        if(i == 'flag'){
            flag = response[0].flag;
        }
    }
    console.log(flag);
    let workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet('My Sheet');
    worksheet.getRow(1).font = { name: 'Calibri', family: 4, size: 12, bold: true };

    if(flag == 'customer'){
        worksheet.mergeCells('C1', 'E2');
        worksheet.getCell('C1').value = 'Customer - '+ header_excel.month +' - '+ header_excel.year;
        worksheet.getRow(3).font = { name: 'Calibri', family: 4, size: 12, bold: true };
        worksheet.getRow(3).values = ['Id', 'Customer Name', 'Customer Address', 'Bill Number', 'Party GSTIN', 'Date', 'Description',
            'Cylinder Size', 'Quantity', 'Rate', 'Total Amount', 'CGST', 'SGST', 'Net Amount', 'Amount Paid', 'Amount Due'
        ];

        worksheet.columns = [
            { key: 'id', width: 7 },
            { key: 'custName', width: 29 },
            { key: 'custAddress', width: 29 },
            { key: 'billNum', width: 18 },
            { key: 'partyGST', width: 18 },
            { key: 'date', width: 13 },
            { key: 'description', width: 17 },
            { key: 'cylinderSize', width: 17 },
            { key: 'quantity', width: 15 },
            { key: 'rate', width: 10 },
            { key: 'totalAmount', width: 23 },
            { key: 'cgst', width: 10 },
            { key: 'sgst', width: 10 },
            { key: 'netAmount', width: 23 },
            { key: 'amountPaid', width: 23 },
            { key: 'amountDue', width: 23 }
        ];

        for (let i = 0; i < response.length; i++) {
            worksheet.addRow({
                id: i + 1, 
                custName: response[i].customerName, 
                custAddress: response[i].address,
                billNum: response[i].billNumber, 
                partyGST: response[i].partyGstNumber, 
                date: response[i].date,
                description: response[i].description,
                cylinderSize: response[i].cylinderSize,
                quantity: response[i].quantity, 
                rate: response[i].rate, 
                totalAmount: response[i].totalAmount,
                cgst: response[i].cgst, 
                sgst: response[i].sgst, 
                netAmount: response[i].netAmountPayable,
                amountPaid: response[i].amountPaid, 
                amountDue: response[i].amountDue
            });
        }
    }else if(flag == 'stock'){
        
        worksheet.mergeCells('C1', 'E2');
        worksheet.getCell('C1').value = 'Stock - '+ header_excel.month +' - '+ header_excel.year;
        worksheet.getRow(3).font = { name: 'Calibri', family: 4, size: 12, bold: true };
        worksheet.getRow(3).values = ['Id', 'Date', 'Cylinder Type', 'Cylinder Size', 'Quantity', 'Rate', 'Net Amount' ];

        worksheet.columns = [
            { key: 'id', width: 7 },            
            { key: 'date', width: 13 },
            { key: 'cylinderType', width: 17 },
            { key: 'cylinderSize', width: 17 },
            { key: 'quantity', width: 15 },
            { key: 'rate', width: 10 },                        
            { key: 'netAmount', width: 23 }
        ];

        for (let i = 0; i < response.length; i++) {
            worksheet.addRow({
                id: i + 1,                 
                date: response[i].date,
                cylinderType: response[i].cylinderType,
                cylinderSize: response[i].cylinderSize,
                quantity: response[i].quantity, 
                rate: response[i].rate,                 
                netAmount: response[i].netAmountPayable                
            });
        }
    }
    else if(flag == 'dealer'){

        worksheet.mergeCells('C1', 'E2');
        worksheet.getCell('C1').value = 'Dealer - '+ header_excel.month +' - '+ header_excel.year;
        worksheet.getRow(3).font = { name: 'Calibri', family: 4, size: 12, bold: true };
        worksheet.getRow(3).values = ['Id', 'Date', 'Dealer', 'Cylinder Size', 'Quantity', 'Rate', 'Net Amount', 'Amount Paid','Amount Due'];

        worksheet.columns = [
            { key: 'id', width: 7 },            
            { key: 'date', width: 13 },
            { key: 'dealer', width: 13 },            
            { key: 'cylinderSize', width: 17 },
            { key: 'quantity', width: 15 },
            { key: 'rate', width: 10 },                        
            { key: 'netAmount', width: 23 },
            { key: 'amountPaid', width: 23 },
            { key: 'amountDue', width: 23 }
        ];

        for (let i = 0; i < response.length; i++) {
            worksheet.addRow({
                id: i + 1,                 
                date: response[i].date,          
                dealer: response[i].dealer,                
                cylinderSize: response[i].cylinderSize,
                quantity: response[i].quantity, 
                rate: response[i].rate,                 
                netAmount: response[i].netAmountPayable,
                amountPaid: response[i].amountPaid, 
                amountDue: response[i].amountDue                
            });
        }
    }else if(flag == 'miscellaneous'){
        worksheet.mergeCells('C1', 'E2');
        worksheet.getCell('C1').value = 'Miscellaneous - '+ header_excel.month +' - '+ header_excel.year;
        worksheet.getRow(3).font = { name: 'Calibri', family: 4, size: 12, bold: true };
        worksheet.getRow(3).values = ['Id', 'Date', 'Description', 'Net Amount'];
        worksheet.columns = [
            // { header: 'Id', key: 'id', width: 7 },            
            // { header: 'Date', key: 'date', width: 13 },    
            // { header: 'Description', key: 'description', width: 17 },                          
            // { header: 'Net Amount', key: 'netAmount', width: 23 }
            { key: 'id', width: 7 },            
            { key: 'date', width: 13 },    
            { key: 'description', width: 17 },                          
            { key: 'netAmount', width: 23 }
        ];
        
        for (let i = 0; i < response.length; i++) {
            worksheet.addRow({
                id: i + 1,                 
                date: response[i].date,   
                description: response[i].description,                                       
                netAmount: response[i].netAmountPayable         
            });            
        }
    }else{
        let profitObject ={
            stock: 0,
            dealer : 0,
            customer: 0,
            miscellaneous: 0,
            amountDue : 0,
            profit: 0
        };
        
        for(let j =0; j< response.length; j++){
            if(response[j]._id == "miscellaneous"){
                profitObject.miscellaneous = response[j].totalPrice
            }else if(response[j]._id == "customer"){
                profitObject.customer = response[j].totalPrice
            }else if(response[j]._id == "dealer"){
                profitObject.dealer = response[j].totalPrice
            }else{
                profitObject.stock = response[j].totalPrice
            }
            profitObject.amountDue += response[j].amountDueTotal;
        }
        profitObject.profit = profitObject.stock - (profitObject.miscellaneous + profitObject.customer + profitObject.dealer) ;
        
        worksheet.mergeCells('C1', 'E2');
        worksheet.getCell('C1').value = 'Profit - '+ header_excel.month +' - '+ header_excel.year;
        worksheet.getRow(3).font = { name: 'Calibri', family: 4, size: 12, bold: true };
        worksheet.getRow(3).values = ['Id', 'Stock', 'Dealer', 'Customer', 'Miscellaneous', 'Amount Pending', 'Profit'];

        worksheet.columns = [
            { key: 'id', width: 7 },            
            { key: 'stock', width: 23 },    
            { key: 'dealer', width: 23 },                          
            { key: 'customer', width: 23 },
            { key: 'miscellaneous', width: 23 },
            { key: 'amountPending', width: 23 },
            { key: 'profit', width: 23 }            
        ];

        
        worksheet.addRow({
            id: 1,                 
            stock: profitObject.stock,   
            dealer: profitObject.dealer,                                       
            customer: profitObject.customer,
            miscellaneous: profitObject.miscellaneous,                                       
            amountPending: profitObject.amountDue, 
            profit: profitObject.profit         
        });
        
    }


    return new Promise(function (Resolve, Reject) {
        workbook.xlsx.writeFile(file_path).then(function () {            
        console.log('file is written');
        Resolve();
        })
    }, function (error) {
        console.log('file not created');
        Reject();
    })
}

module.exports = generateExcel;