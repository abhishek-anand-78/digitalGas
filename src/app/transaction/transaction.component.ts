import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  submitted = false;
  transData = {};
  loading = false;
  transactionDetails = {};
  constructor(private formBuilder: FormBuilder, public http: Http) { }

  ngOnInit() {
    this.loading = false;
    this.transactionForm = this.formBuilder.group({
      months: ['', Validators.required],
      year: ['', Validators.required]
    });
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
      year: this.transactionForm.controls.year.value
    }
    return this.transData;
  }

  search(): void {
    this.loading = true;
    this.initialize();
    let url = "http://localhost:8081/search";
    var me = this;
    this.http.post(url, this.transData)
      .subscribe(res => {
        console.log(res);
        this.transactionDetails = res;
      }, err => {
        console.log("error occurred", err);
      });
    // me.transactionDetails = res;

  }
}
