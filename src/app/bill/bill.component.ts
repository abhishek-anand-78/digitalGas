import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  billForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, ) { }

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

  onSubmit() {
    //this.billForm.controls.netAmountPayable.value
    console.log(this.billForm.controls.netAmountPayable.value);
  }


}
