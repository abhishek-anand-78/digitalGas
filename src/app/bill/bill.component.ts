import { Component, OnInit } from '@angular/core';
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
  billForm: FormGroup;
  category : string;
  closeResult: string;
  submitted = false;
  test = 'asgdhjs';
  customer : boolean = true;  
  billData = {};
  dealersList = [];
  model = {
    email: '',
    address: '',
    phone: ''
    };

  constructor(private formBuilder: FormBuilder, public http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.dealersList = ['Pann', 'Mann'];

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
    let netAmountPayable = totalAmount +  ( totalAmount * ( Number( (cgst + sgst)/100 ) ) );
    let amountPaid = Number(this.billForm.controls.amountPaid.value);
    let amountDue = (Number(netAmountPayable) - Number(amountPaid));

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
      date: new Date(this.billForm.controls.date.value).toISOString(),
      cylinderSize: this.billForm.controls.cylinderSize.value,
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
    this.loadData();
    this.http.post(url, this.billData).subscribe(data => {
      console.log(data);
    }, err => {
      console.log();
      this.dealersList = ['Pann', 'Mann','wolring'];
    })
  }

  addNewDealer(result){
    this.http.post('http://localhost:8081/adddealer',{}).subscribe(data => {

    }, err => {
      console.log();
      this.dealersList = ['Pann', 'Mann','wolring'];
    })
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.addNewDealer(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  generateBill() {
    this.loadData();
    let url = "http://localhost:8081/myaction";
    var a = document.createElement("a");
    document.body.appendChild(a);
    this.http.post(url, this.billData, {
      responseType: 'arraybuffer'
      // headers: new HttpHeaders().append('Content-Type','application/pdf')
    })
      .subscribe(res => {
        console.log(res);
        var file = new Blob([res], {type: 'application/pdf'});
        var fileURL = window.URL.createObjectURL(file);
        a.href = fileURL;
        a.download = 'filename.pdf';
        a.click();                               
      }, err => {
        console.log("error occurred", err);
      });    
  }
}
