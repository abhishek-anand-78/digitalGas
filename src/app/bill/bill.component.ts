import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  billForm: FormGroup;
  submitted = false;
  billData = {};

  constructor(private formBuilder: FormBuilder, public http: Http) { }

  ngOnInit() {
    this.billForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      address: ['', Validators.required],
      billNumber: ['', Validators.required],
      partyGstNumber: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      rate: ['', Validators.required],
      totalAmount: ['', Validators.required],
      cgst: ['', Validators.required],
      sgst: ['', Validators.required],
      netAmountPayable: [''],
      amountPaid: [''],
      amountDue: ['']
    });
  }

  get f() {
    return this.billForm.controls;
  }


  loadData() {
    this.billData = {
      customerName: this.billForm.controls.customerName.value,
      address: this.billForm.controls.address.value,
      billNumber: this.billForm.controls.billNumber.value,
      partyGstNumber: this.billForm.controls.partyGstNumber.value,
      date: this.billForm.controls.date.value,
      description: this.billForm.controls.description.value,
      quantity: this.billForm.controls.quantity.value,
      rate: this.billForm.controls.rate.value,
      totalAmount: this.billForm.controls.customerName.value,
      cgst: this.billForm.controls.cgst.value,
      sgst: this.billForm.controls.sgst.value,
      netAmountPayable: this.billForm.controls.netAmountPayable.value,
      amountPaid: this.billForm.controls.amountPaid.value,
      amountDue: this.billForm.controls.amountDue.value
    }
    return this.billData;
  }

  onSubmit() {
    //this.billForm.controls.netAmountPayable.value
    console.log(this.billForm.controls);
  }

  generateBill() {
    this.loadData();
    let url = "http://localhost:8081/myaction";

    this.http.post(url, this.billData)
      .subscribe(res =>
        console.log(res)
      );

    var a = document.createElement("a");
    document.body.appendChild(a);
    let location = "http://localhost:4200/";
    let l ='C:/Users/sinha_ab/Desktop/dg/'
    a.href = location + 'downloads/' + 'out' + '.docx';
    a.download = 'out' + '.docx';
    a.click();
  }



}
