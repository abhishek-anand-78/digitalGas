var Excel = require('exceljs');
var fs = require('fs');
var rawdata = fs.readFileSync("mock.json");
this.response = JSON.parse(rawdata);
console.log("this.response", this.response);
// generateExcel = function(){  
var generateExcel = function (response) {

    return new Promise(function (Resolve, Reject) {
        let workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');
        console.log('i am in xls file');
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: ' Customer Name', key: 'custName', width: 32 },
            { header: 'Customer Address', key: 'custAddress', width: 10 },
            { header: 'Bill Number', key: 'billNum', width: 10 },
            { header: 'Party GSTIN', key: 'partyGST', width: 32 },
            { header: 'Date', key: 'date', width: 10 },
            { header: 'Description', key: 'description', width: 10 },
            { header: 'Quantity', key: 'quantity', width: 32 },
            { header: 'Rate', key: 'rate', width: 10 },
            { header: 'Total Amount', key: 'totalAmount', width: 10 },
            { header: 'CGST', key: 'cgst', width: 32 },
            { header: 'SGST', key: 'sgst', width: 10 },
            { header: 'Net Amount', key: 'netAmount', width: 10 },
            { header: 'Amount Paid', key: 'amountPaid', width: 32 },
            { header: 'Amount Due', key: 'amountDue', width: 10 }
        ];
        for (let i = 0; i < response.length; i++) {
            worksheet.addRow({
                id: i + 1, custName: response[i].customerName, custAddress: response[i].customerAddress,
                billNum: response[i].billNumber, partyGST: response[i].partyGstNumber, date: response[i].date,
                quantity: response[i].quantity, rate: response[i].rate, totalAmount: response[i].totalAmount,
                cgst: response[i].cgst, sgst: response[i].sgst, netAmount: response[i].netAmountPayable,
                amountPaid: response[i].amountPaid, amountDue: response[i].amountDue
            });
        }
        //console.log('no error in for loop');
        //worksheet.addRow({id: 1, name: 'John Doe', DOB: new Date(1970,1,1)});
        //worksheet.addRow({id: 2, name: 'Jane Doe', DOB: new Date(1965,1,7)});
        worksheet.getRow(1).font = { name: 'Comic Sans MS', family: 4, size: 12, underline: 'double', bold: true };
        //workbook.commit();     
        //let data_file = new Date().getTime();   
        workbook.xlsx.writeFile('G:\\digitalGas\\downloads\\temp.xlsx').then(function () {
            // done
            console.log('file is written');
            Resolve();
        })
    }, function (error) {
        console.log('file not created');
        Reject();
    })
}
module.exports = generateExcel;