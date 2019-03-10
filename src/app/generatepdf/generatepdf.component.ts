import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-generatepdf',
  templateUrl: './generatepdf.component.html',
  styleUrls: ['./generatepdf.component.css']
})
export class GeneratepdfComponent implements OnInit {
  selected_customer_id = '';
  customer_list = [];
  transactionDetails: any;
  transData : any;
  billData : any;
  customer_pdfForm: FormGroup;
  constructor(public http: HttpClient, private formBuilder: FormBuilder) {
    this.customer_pdfForm = this.formBuilder.group({
      cust_dealer: ['', Validators.required],
      months: ['', Validators.required],
      year: ['', Validators.required],
      flag: 'customer'     
    });
   }

  ngOnInit() {
    this.http.get('http://localhost:8081/customerList').subscribe((data: any) => {
      this.customer_list = data.data;    
      console.log(data);
	  })
  }
  
  initialize() {
    this.transData = {      
      month: this.customer_pdfForm.controls.months.value,
      year: this.customer_pdfForm.controls.year.value,
      flag: 'customer', 
      cust_dealer: this.customer_pdfForm.controls.cust_dealer.value     
    }
    return this.transData;
  }

  search(): void {           
    this.initialize();
    let url = "http://localhost:8081/fetchbill";        
    this.http.post(url, this.transData)
      .subscribe((res: any) => {
            console.log(res);
            this.transactionDetails = res.data;
      }, err => {
        console.log("error occurred", err);

      });    
  }

  test(x){
    console.table(x);
  }

  downloadFile(x){      
  let url = "http://localhost:8081/generatepdf_customer";  
  var a = document.createElement("a");
  document.body.appendChild(a);
  let billData = {
    customerName: x.customerName,
    address: x.address,
    billNumber: x.billNumber,
    partyGstNumber: x.partyGstNumber,
    date: x.date,
    cylinderSize: x.cylinderSize,
    cylinderType: '',
    description: x.description,
    quantity: x.quantity,
    rate: x.rate,
    totalAmount: x.totalAmount,
    cgst: x.cgst,
    sgst: x.sgst,
    netAmountPayable: x.netAmountPayable,
    amountPaid: x.amountPaid,
    amountDue: x.amountDue,
    dealer: x.dealer,
    flag: 'customer'
  }
  console.table(x);
  this.http.post(url, x, {
    responseType: 'arraybuffer'
    // headers: new HttpHeaders().append('Content-Type','application/pdf')
  })
    .subscribe(res => {
      console.log(res);      
      var file = new Blob([res], {type: 'application/pdf'});
      var fileURL = window.URL.createObjectURL(file);        
      a.href = fileURL;
      a.download = x.customerName + '_' +x.date + '.pdf';
      a.click();                                
    }, err => {
      console.log("error occurred", err);
    });    
}
}