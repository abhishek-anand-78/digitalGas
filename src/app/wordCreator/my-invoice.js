const pdfInvoice = require('pdf-invoice')

const document = pdfInvoice({
  company: {
    phone: '(99) 9 9999-9999',
    email: 'company@evilcorp.com',
    address: '106 New Pimpri, Wakad, Pune',
    name: 'Gas Agency Name',
  },
  customer: {
    name: 'Customer Name',
    email: 'customer@gmail.com',
  },
  items: [
    {amount: 50.0, name: 'Sum', description: '21 Kg for month July', quantity: 1},
    {amount: 9, name: 'SGST %', description: '-', quantity: '-'},
    {amount: 9, name: 'CGST %', description: '-', quantity: '-'},
    {amount: 127.72, name: 'SUM Total', description: '-', quantity: '-'}
  ],
})

// That's it! Do whatever you want now.
// Pipe it to a file for instance:

const fs = require('fs')
function generateInvoice(){
  console.log('main function has bedd called');
  //return new Promise((resolve, reject) => {
    document.generate() // triggers rendering
    console.log('generate function has bedd called');
    document.pdfkitDoc.pipe(fs.createWriteStream('G:\\digitalGas\\downloads\\file_1.pdf'));
    console.log('document created');
    //resolve(true);
    //reject(true);
  //})
}

// generateInvoice().then(data => {
//   console.log(data);
// })

module.exports = generateInvoice


