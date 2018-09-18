import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';


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
  transactionDetails = {};
  constructor(private formBuilder: FormBuilder, public http: HttpClient) { }

  ngOnInit() {
    this.search_loading = false;
    this.download_loading = false;
    this.transactionForm = this.formBuilder.group({
      months: ['', Validators.required],
      year: ['', Validators.required],
      flag: ['', Validators.required]
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
      year: this.transactionForm.controls.year.value,
      flag: this.transactionForm.controls.flag.value
    }
    return this.transData;
  }

  search(): void {
    this.search_loading = true;    
    this.tempData = this.initialize();
    let url = "http://localhost:8081/fetchbill";
    var me = this;
    this.http.post(url, this.transData)
      .subscribe(res => {
        console.log(res);
        this.search_loading = false;
        this.show_table = true;
        this.transactionDetails = res;
      }, err => {
        console.log("error occurred", err);
        this.search_loading = false;
      });
    // me.transactionDetails = res;
  }

  update_customer(data){
    let url = "http://localhost:8081/update";
    console.log(data);
    
    this.http.post(url, data)
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
        a.download = 'export.xlsx';
        a.click();
      }, err => {
        console.log("error occurred", err);
      });        
  }
}
