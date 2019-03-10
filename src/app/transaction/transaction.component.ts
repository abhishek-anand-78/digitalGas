import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  submitted = false;
  transData = {};
  tempData = {};
  search_loading = false;
  download_loading = false;
  show_table = false;
  show_dealer_list = false;
  show_customer_list = false;
  customer_list = [];
  dealer_list = [];
  transactionDetails = {};

  misc_modal = {
    date: new Date('2018-09-19'),
    description: 'value',
    totalAmount: 0,
    netAmountPayable: 0
  }
  stock_modal = {
    date: new Date('2018-09-19'),
    cylinderType: 'domestic',
    cylinderSize: 21,
    quantity: 1,
    rate: 0,
    totalAmount: 0,
    netAmountPayable: 0,
  } 

  dealer_modal = {
    dealer: 'mann',
    date: new Date('2018-09-19'),    
    cylinderSize: 21,
    quantity: 1,
    rate: 0,
    totalAmount: 0,
    netAmountPayable: 0,
    amountPaid: 0,
    amountDue: 0
  } 

  customer_modal = {    
    customerName: 'customerName',
    address: 'address',
    billNumber: 'billNumber',
    partyGstNumber: 'partyGstNumber',
    date: new Date('2018-09-19'),    
    cylinderSize: 21,
    description: 'msnafkja',
    quantity: 1,
    rate: 0,
    totalAmount: 0,
    cgst: 0,
    sgst:0,
    netAmountPayable: 0,
    amountPaid: 0,
    amountDue: 0
  } 
  constructor(private formBuilder: FormBuilder, public http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.search_loading = false;
    this.download_loading = false;
    this.transactionForm = this.formBuilder.group({
      months: ['', Validators.required],
      year: ['', Validators.required],
      flag: ['', Validators.required],
      cust_dealer: ''
    });
    this.http.get('http://localhost:8081/dealerList').subscribe((data: any) => {
      this.dealer_list = data.data;    
    })
    this.http.get('http://localhost:8081/customerList').subscribe((data: any) => {
      this.customer_list = data.data;    
	  })
  }

  get f() {
    return this.transactionForm.controls;
  }
  onSubmit() {
    console.log("Trasaction form submitted");
  }

  initialize() {
    this.transData = {
      month: this.transactionForm.controls.months.value,
      year: this.transactionForm.controls.year.value,
      flag: this.transactionForm.controls.flag.value,
      cust_dealer: this.transactionForm.controls.cust_dealer.value
    }
    return this.transData;
  }

  showOption(){
    if(this.transactionForm.controls.flag.value == 'customer'){
      console.log('it is customer');
      this.show_customer_list = true;
      this.show_dealer_list = false;

    }
    else if(this.transactionForm.controls.flag.value == 'dealer'){
      console.log('it is dealer');
      this.show_dealer_list = true;
      this.show_customer_list = false;
    }else{
      this.show_dealer_list = false;
      this.show_customer_list = false;
    }
  }

  search(): void {
    this.search_loading = true;    
    this.tempData = this.initialize();
    let url = "http://localhost:8081/fetchbill";
    var me = this;
    console.log(this.tempData);
    this.http.post(url, this.transData)
      .subscribe(res => {        
        this.search_loading = false;
        this.show_table = true;
        this.transactionDetails = res;
      }, err => {
        console.log("error occurred", err);
        this.search_loading = false;
      });
    // me.transactionDetails = res;
  }

  update_customer(userID, result){
    let url = "http://localhost:8081/update";

    this.http.post(url, {userID: userID, data: result})
      .subscribe(res => {
        console.log(res);
      }, err =>{
        console.log(err);
      });
  }

  download_excel() {
    this.download_loading = true;
    
    let a = document.createElement("a");
    document.body.appendChild(a);
    let binaryData = [];
    let url = "http://localhost:8081/downloadexcel";
        
    this.http.post(url, this.tempData, {
      responseType: 'arraybuffer'      
    })
      .subscribe(res => {
        console.log(res);
        this.download_loading = false;
        binaryData.push(res);
        let file = new Blob(binaryData, {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
        let fileURL = window.URL.createObjectURL(file);
        a.href = fileURL;
        a.download = this.tempData['flag'] + '_' + this.tempData['month'] + '_' + this.tempData['year'] + '.xlsx';
        a.click();
      }, err => {
        console.log("error occurred", err);
      });        
  }
  
  open(content, x) { 
    if(x.flag == 'miscellaneous' ){
      this.misc_modal = {
        date: x.date,
        description: x.description,
        totalAmount: 0,
        netAmountPayable: Number(x.netAmountPayable)
        
      };
    }       
    else if(x.flag == 'stock' ){
      this.stock_modal = {
        date: x.date,
        cylinderType: x.cylinderType,
        cylinderSize: x.cylinderSize,
        quantity: x.quantity,
        rate: x.rate,
        totalAmount: x.totalAmount,
        netAmountPayable: x.totalAmount,
      } 
    }else if(x.flag == 'dealer'){
      this.dealer_modal = {
        dealer: x.dealer,
        date: x.date, 
        cylinderSize: x.cylinderSize,
        quantity: x.quantity,
        rate: x.rate,
        totalAmount: x.totalAmount,
        netAmountPayable: x.netAmountPayable,
        amountPaid: x.amountPaid,
        amountDue: x.amountDue
      } 
    }else{  
      this.customer_modal = {    
        customerName: x.customerName,
        address: x.address,
        billNumber: x.billNumber,
        partyGstNumber: x.partyGstNumber,
        date: x.date,    
        cylinderSize: x.cylinderSize,
        description: x.description,
        quantity: x.quantity,
        rate: x.rate,
        totalAmount: x.totalAmount,
        cgst: x.cgst,
        sgst:x.sgst,
        netAmountPayable: x.netAmountPayable,
        amountPaid: x.amountPaid,
        amountDue: x.amountDue
      } 
  }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {      
      this.update_customer(x._id, result);            
    }, (reason) => {
      console.log(reason);
    });
  }

  calculateTotal(flag){
    if(flag == 'dealer'){
      this.dealer_modal.totalAmount = Number(this.dealer_modal.quantity * this.dealer_modal.rate);
      this.dealer_modal.netAmountPayable = this.dealer_modal.totalAmount;
      this.dealer_modal.amountDue = Number(this.dealer_modal.netAmountPayable - this.dealer_modal.amountPaid);
    }else if(flag == 'stock'){
      this.stock_modal.totalAmount = Number(this.stock_modal.quantity * this.stock_modal.rate);
      this.stock_modal.netAmountPayable = this.stock_modal.totalAmount;
    }else {
      this.customer_modal.totalAmount = Number(this.customer_modal.quantity * this.customer_modal.rate);
      this.customer_modal.netAmountPayable = Math.round(this.customer_modal.totalAmount) + Math.round(((this.customer_modal.totalAmount * this.customer_modal.sgst)/100) + ((this.customer_modal.totalAmount * this.customer_modal.cgst)/100));
      this.customer_modal.amountDue = Number(this.customer_modal.netAmountPayable - this.customer_modal.amountPaid);
    }
   
  }

}

