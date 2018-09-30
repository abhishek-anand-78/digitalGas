import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import {saveAs} from 'file-saver';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  billForm: FormGroup;
  confirm: boolean = false;
  category : string;
  closeResult: string;
  submitted = false;
  test = 'asgdhjs';
  customer : boolean = true;  
  billData = {};
  dealersList = [];
  modal = {
    name: '',
    address: '',
    phone: ''
  };

  constructor(private formBuilder: FormBuilder, public http: HttpClient, private modalService: NgbModal) { 
    this.fetchDealerList();    
  }

  ngOnInit() {
        
    this.billForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      address: ['', Validators.required],
      dealer: '',
      billNumber: ['', Validators.required],
      partyGstNumber: ['', Validators.required],
      date: ['', Validators.required],
      cylinderSize: ['', Validators.required ],
      description: ['', Validators.required],
      quantity: ['1', Validators.required],
      rate: ['0', Validators.required],
      totalAmount: ['0' , Validators.required],      
      cgst: ['0', Validators.required],
      sgst: ['0', Validators.required],
      netAmountPayable: ['0'],
      amountPaid: ['0'],
      amountDue: ['0'],
      flag: ""
    });
    this.onChanges();
  }

  onChanges(): void {

    this.billForm.get('quantity').valueChanges.subscribe(val => {      
      this.calculateAllChanges();
    });

    this.billForm.get('rate').valueChanges.subscribe(val => { 
      this.calculateAllChanges();
    });

    this.billForm.get('cgst').valueChanges.subscribe(val => {     
      this.calculateAllChanges()
    });

    this.billForm.get('sgst').valueChanges.subscribe(val => {            
      this.calculateAllChanges()
    });

    this.billForm.get('amountPaid').valueChanges.subscribe(val => {      
      this.calculateAllChanges()
    });
  }

  get f() {
    return this.billForm.controls;
  }

  // update all fields(quantity, cgst,sgst, total, due amount etc) based on any value change
  calculateAllChanges(){
    let quantity = Number(this.billForm.controls.quantity.value);
    let rate = Number(this.billForm.controls.rate.value);
    let totalAmount = Number(quantity * rate);    
    let cgst = Number(this.billForm.controls.cgst.value);
    let sgst = Number(this.billForm.controls.sgst.value);
    let netAmountPayable = Math.round(totalAmount +  ( totalAmount * ( Number( (cgst + sgst)/100 ) ) ));
    let amountPaid = Number(this.billForm.controls.amountPaid.value);
    let amountDue = (Number(netAmountPayable) - Number(amountPaid));
    // let cylinderSize = this.billForm.controls.cylinderSize.value + 'kg cylinder';
    // this.billForm.controls['cylinderSize'].setValue(cylinderSize);
    this.billForm.controls['totalAmount'].setValue(totalAmount);
    this.billForm.controls['netAmountPayable'].setValue(netAmountPayable);
    this.billForm.controls['amountDue'].setValue(amountDue);    
  }

  loadData() {
    this.billData = {
      customerName: this.billForm.controls.customerName.value,
      address: this.billForm.controls.address.value,
      billNumber: this.billForm.controls.billNumber.value,
      partyGstNumber: this.billForm.controls.partyGstNumber.value,
      date: this.billForm.controls.date.value,
      cylinderSize: this.billForm.controls.cylinderSize.value,
      cylinderType: '',
      description: this.billForm.controls.description.value,
      quantity: this.billForm.controls.quantity.value,
      rate: this.billForm.controls.rate.value,
      totalAmount: this.billForm.controls.totalAmount.value,
      cgst: this.billForm.controls.cgst.value,
      sgst: this.billForm.controls.sgst.value,
      netAmountPayable: this.billForm.controls.netAmountPayable.value,
      amountPaid: this.billForm.controls.amountPaid.value,
      amountDue: this.billForm.controls.amountDue.value,
      dealer: this.billForm.controls.dealer.value,
      flag: this.billForm.controls.flag.value ? this.billForm.controls.flag.value : 'customer'
    }
    return this.billData;
  }

  fetchDealerList(){
    this.http.get('http://localhost:8081/dealerList').subscribe((result : any) =>{
      result.data.forEach(element => {
        this.dealersList.push(element.name);
      });
      console.log(this.dealersList);
    });    
  }

  onSubmit() {
    //this.billForm.controls.netAmountPayable.value
    console.log(this.billForm.controls);
    // action="/myaction" method="post" (ngSubmit)="onSubmit()"
  }

  toggleBill(flag){
    this.customer = !this.customer;
    this.ngOnInit();
    this.billForm.controls['flag'].setValue(flag);
    // console.log(this.loadData());
  };

  saveBill(){
    let url = "http://localhost:8081/savebill";
    this.http.post(url, this.billData).subscribe(data => {
      console.log(data);      
      this.ngOnInit();      
    }, err => {
      console.log();
      this.dealersList = ['Pann', 'Mann','wolring'];
    })
  }

  addNewDealer(result){
    this.http.post('http://localhost:8081/adddealer', result).subscribe(data => {
      console.log(data);
    }, err => {
      console.log();
      // this.dealersList = ['Pann', 'Mann','wolring'];
    })
  }

  open(content) {
    this.confirm = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {      
      this.addNewDealer(result);            
    }, (reason) => {
      console.log(reason);
    });
  }

  generateBill() {
    // this.loadData();
    let url = "http://localhost:8081/generatePDF";
    var a = document.createElement("a");
    document.body.appendChild(a);
    this.http.post(url, this.billData, {
      responseType: 'arraybuffer'
      // headers: new HttpHeaders().append('Content-Type','application/pdf')
    })
      .subscribe(res => {
        console.log(res);
        this.ngOnInit();
        var file = new Blob([res], {type: 'application/pdf'});
        var fileURL = window.URL.createObjectURL(file);        
        a.href = fileURL;
        a.download = this.billData['customerName'] + '_' +this.billData['date'] + '.pdf';
        a.click();                               
      }, err => {
        console.log("error occurred", err);
      });    
  }
 openPdfModal(content){
   this.confirm = true;
   this.loadData();
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {      
      this.generateBill();
  }, (reason) => {
    console.log(reason);
  });
 }

 openSaveModal(content){
  this.confirm = true;
  this.loadData();
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {      
      this.saveBill();  
  }, (reason) => {
    console.log(reason);
  });
 }
}
