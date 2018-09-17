import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stockForm: FormGroup;
  miscForm: FormGroup;
  category : string;
  submitted = false;
  billData = {};  
  modal = {
    date: '',
    description: '',
    netAmountPayable: ''
  };

  constructor(private formBuilder: FormBuilder, public http: HttpClient) { }

  ngOnInit() {
    this.stockForm = this.formBuilder.group({      
      date: ['', Validators.required],
      cylinderType: ['', Validators.required ],
      cylinderSize: ['', Validators.required ],      
      quantity: ['1', Validators.required],
      rate: ['0', Validators.required],
      totalAmount: ['0', Validators.required],      
      netAmountPayable: ['0']
    });
    
    this.onChanges();
  }

  onChanges(): void {

    this.stockForm.get('quantity').valueChanges.subscribe(val => {      
      this.calculateAllChanges();
    });

    this.stockForm.get('rate').valueChanges.subscribe(val => { 
      this.calculateAllChanges();
    });

    // this.stockForm.get('amountPaid').valueChanges.subscribe(val => {      
    //   this.calculateAllChanges()
    // });
  }

  get f() {
    return this.stockForm.controls;
  }

  // update all fields(quantity, cgst,sgst, total, due amount etc) based on any value change
  calculateAllChanges(){
    let quantity = Number(this.stockForm.controls.quantity.value);
    let rate = Number(this.stockForm.controls.rate.value);
    let totalAmount = Number(quantity * rate);        
    let netAmountPayable = totalAmount ;    

    this.stockForm.controls['totalAmount'].setValue(totalAmount);
    this.stockForm.controls['netAmountPayable'].setValue(netAmountPayable);        
  }

  loadData() {
    this.billData = {
      customerName: '',
      address: '',
      billNumber: '',
      partyGstNumber: '',      
      date: this.stockForm.controls.date.value,
      description: this.stockForm.controls.cylinderType.value,
      cylinderType: this.stockForm.controls.cylinderType.value,
      cylinderSize: this.stockForm.controls.cylinderSize.value,
      quantity: this.stockForm.controls.quantity.value,
      rate: this.stockForm.controls.rate.value,
      totalAmount: this.stockForm.controls.totalAmount.value,
      cgst: '0',
      sgst: '0',
      netAmountPayable: this.stockForm.controls.netAmountPayable.value,
      amountPaid: '0',
      amountDue: '0',
      dealer: '',
      flag: 'stock'
    }
    return this.billData;
  }

  

  saveStockBill(){
    let url = "http://localhost:8081/savebill";
    this.loadData();
    this.http.post(url, this.billData).subscribe(data => {
      console.log(data);
    }, err => {
      console.log();      
    })
  }

  saveMisc(){
    let url = "http://localhost:8081/savebill";
    let miscData = {
      customerName: '',
      address: '',
      billNumber: '',
      partyGstNumber: '',      
      date: this.modal.date,
      description: this.modal.description,
      cylinderType: '',
      cylinderSize: '',
      quantity: '0',
      rate: '0',
      totalAmount: '0',
      cgst: '0',
      sgst: '0',
      netAmountPayable:this.modal.netAmountPayable,
      amountPaid: '0',
      amountDue: '0',
      dealer: '',
      flag: 'miscellaneous'
    }
    this.http.post(url, miscData).subscribe(data => {
      console.log(data);
    }, err => {
      console.log();      
    })
  }


//   generateBill() {
//     this.loadData();
//     let url = "http://localhost:8081/myaction";
//     var a = document.createElement("a");
//     document.body.appendChild(a);
//     this.http.post(url, this.billData, {
//       responseType: 'arraybuffer'
//       // headers: new HttpHeaders().append('Content-Type','application/pdf')
//     })
//       .subscribe(res => {
//         console.log(res);
//         var file = new Blob([res], {type: 'application/pdf'});
//         var fileURL = window.URL.createObjectURL(file);
//         a.href = fileURL;
//         a.download = 'filename.pdf';
//         a.click();                               
//       }, err => {
//         console.log("error occurred", err);
//       });    
//   }


}
