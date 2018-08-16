var Revoice = require('revoice');

function gen(){
const data = {
  "id": "yvjhn76b87808",
  "date": "2017-02-02",
  "issuer": {
    "name": "Brew Creative Limited",
    "address": [
      "1905, Nan Fung Centre",
      "264-298 Castle Peak Road",
      "Tsuen Wan",
      "New Territories",
      "Hong Kong"
    ],
    "contact": {
      "name": "Daniel Li",
      "tel": "+852 1234 5678",
      "email": "dan@brew.com.hk"
    }
  },
  "invoicee": {
    "name": "Cerc Lannister"
  },
  "items": [{
    "id": "7A73YHAS",
    "title": "Amazon Echo Dot (2nd Generation)",
    "date": "2017-02-02",
    "amount": 39.99,
    "tax": 10.00,
    "quantity": 12
  }]
}

const options = {
  template: 'default',
  destination: '../../../downloads/pdfRevoice/',
  name: 'index'
}
return Revoice.generateHTMLInvoice(data, options)
}
gen()
.then(data=>{
    console.log(data);
})