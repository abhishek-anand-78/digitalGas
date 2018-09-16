var Excel = require('exceljs');
var fs = require('fs');
// _________exceute if no mongodb connection________________
//var rawdata = fs.readFileSync("mock.json");
//response = JSON.parse(rawdata);
//console.log("this.response", response);
// generateExcel = function(){  
var generateExcel = function (response) {

    return new Promise(function (Resolve, Reject) {
        let workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');
        worksheet.getRow(1).font = { name: 'Calibri', family: 4, size: 12, bold: true };

        worksheet.columns = [
            { header: 'Id', key: 'id', width: 7 },
            { header: ' Customer Name', key: 'custName', width: 29 },
            { header: 'Customer Address', key: 'custAddress', width: 29 },
            { header: 'Bill Number', key: 'billNum', width: 18 },
            { header: 'Party GSTIN', key: 'partyGST', width: 18 },
            { header: 'Date', key: 'date', width: 13 },
            { header: 'Description', key: 'description', width: 17 },
            { header: 'Quantity', key: 'quantity', width: 15 },
            { header: 'Rate', key: 'rate', width: 10 },
            { header: 'Total Amount', key: 'totalAmount', width: 23 },
            { header: 'CGST', key: 'cgst', width: 10 },
            { header: 'SGST', key: 'sgst', width: 10 },
            { header: 'Net Amount', key: 'netAmount', width: 23 },
            { header: 'Amount Paid', key: 'amountPaid', width: 23 },
            { header: 'Amount Due', key: 'amountDue', width: 23 }
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

        //change file location according to system 
        // workbook.xlsx.writeFile('C:\\Users\\sinha_ab\\Desktop\\dg\\server\\create_excel\\temp.xlsx').then(function () {
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
// _________exceute if no mongodb connection________________

// generateExcel(response).then(function (response) {
//     console.log("file generated....");
// });
module.exports = generateExcel;