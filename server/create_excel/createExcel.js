var Excel = require('exceljs');
module.exports.generateExcel = function(){        
let workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 32 },
            { header: 'D.O.B.', key: 'DOB', width: 10 }
        ];
        worksheet.addRow({id: 1, name: 'John Doe', DOB: new Date(1970,1,1)});
        worksheet.addRow({id: 2, name: 'Jane Doe', DOB: new Date(1965,1,7)});
        //workbook.commit();        
        workbook.xlsx.writeFile('G:\\digitalGas\\downloads\\temp.xlsx').then(function() {
                // done
                console.log('file is written');
            });
        }