'use strict';

var pdfKit = require('pdfkit');
var moment = require('moment');
var numeral = require('numeral');
var i18n = require('./i18n');

var TEXT_SIZE = 8;
var CONTENT_LEFT_PADDING = 50;

function PDFInvoice(_ref) {
  var company = _ref.company;
  var customer = _ref.customer;
  var items = _ref.items;
  var date = _ref.date;
  // var date = new Date();
  var charge = {
    // createdAt: date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear(),
    amount: items.reduce(function (acc, item) {
      return acc + item.amount;
    }, 0)
  };
  var doc = new pdfKit({ size: 'A4', margin: 50 });

  doc.fillColor('#333333');

  var translate = i18n[PDFInvoice.lang];
  moment.locale(PDFInvoice.lang);

  var divMaxWidth = 550;
  var table = {
    x: CONTENT_LEFT_PADDING,
    y: 200,
    inc: 150
  };

  return {
    genHeader: function genHeader() {
      doc.fontSize(16).text(company.name, CONTENT_LEFT_PADDING, 50);

      var borderOffset = doc.currentLineHeight() + 70;

      doc.fontSize(16).fillColor('#cccccc').text(moment(date).format('MMMM DD, YYYY'), CONTENT_LEFT_PADDING, 50, {
        align: 'right'
      }).fillColor('#333333');

      doc.strokeColor('#cccccc').moveTo(CONTENT_LEFT_PADDING, borderOffset).lineTo(divMaxWidth, borderOffset);
    },
    genFooter: function genFooter() {
      // doc.fillColor('#cccccc');

      doc.fontSize(12).text(company.name, CONTENT_LEFT_PADDING, 450);

      doc.text(company.address1);
      doc.text(company.address2);
      doc.text(company.phone);
      doc.text(company.email);

      doc.fillColor('#333333');
    },
    genCustomerInfos: function genCustomerInfos() {
      doc.fontSize(12).text(translate.chargeFor, CONTENT_LEFT_PADDING, 100);

      doc.text( customer.name );
      // doc.text( customer.email );
      // doc.text( 'customer.email' );
      doc.text( customer.address );
    },
    genTableHeaders: function genTableHeaders() {
      ['description', 'quantity','name', 'amount'].forEach(function (text, i) {
        doc.fontSize(TEXT_SIZE).text(translate[text], table.x + i * table.inc, table.y);
      });
    },
    genTableRow: function genTableRow() {
      items.map(function (item) {
        return Object.assign({}, item, {
          amount: numeral(item.amount).format('')
        });
      }).forEach(function (item, itemIndex) {
        ['description', 'quantity','name', 'amount'].forEach(function (field, i) {
          doc.fontSize(TEXT_SIZE).text(item[field], table.x + i * table.inc, table.y + TEXT_SIZE + 6 + itemIndex * 20);
        });
      });
    },
    genTableLines: function genTableLines() {
      var offset = doc.currentLineHeight() + 2;
      doc.moveTo(table.x, table.y + offset).lineTo(divMaxWidth, table.y + offset).stroke();
    },
    generate: function generate() {
      this.genHeader();      
      this.genTableHeaders();
      this.genTableLines();
      this.genTableRow();
      this.genCustomerInfos();
      this.genFooter();

      doc.end();
    },


    get pdfkitDoc() {
      return doc;
    }
  };
}

PDFInvoice.lang = 'en_US';

module.exports = PDFInvoice;