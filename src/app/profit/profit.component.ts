import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.css']
})
export class ProfitComponent implements OnInit {
  transactionForm: FormGroup;
  submitted = false;
  transData = {};
  tempData = {};
  download_loading = false;
  show_table = false;
  profitDetails : any = [];
  profitObject : any = {
    'miscellaneous' : 0,
    'dealer': 0,
    'stock' : 0,
    'customer' : 0,
    'profit' : 0,
    'amountDue' : 0
  };
  constructor(private formBuilder: FormBuilder, public http: HttpClient) { }

  ngOnInit() {

    this.transactionForm = this.formBuilder.group({
      months: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  get f() {
    return this.transactionForm.controls;
  }
 
  initialize() {
    this.transData = {
      month: this.transactionForm.controls.months.value,
      year: this.transactionForm.controls.year.value
    }
    return this.transData;
  }

  search(): void {     
    this.tempData = this.initialize();
    console.log(this.tempData);
    let url = "http://localhost:8081/getprofit";    
    this.http.post(url, this.tempData)
      .subscribe((res : any) => {                
        this.show_table = true;
        this.profitDetails = res;
        this.parseProfitDetail(res.data);
        console.log(res.data);
      }, err => {
        console.log("error occurred", err);        
      });    
  }

  parseProfitDetail(list){
    this.profitObject.amountDue = 0;
    for(let i =0; i< list.length; i++){
      if(list[i]._id == "miscellaneous"){
        this.profitObject.miscellaneous = list[i].totalPrice
      }else if(list[i]._id == "customer"){
        this.profitObject.customer = list[i].totalPrice
      }else if(list[i]._id == "dealer"){
        this.profitObject.dealer = list[i].totalPrice
      }else{
        this.profitObject.stock = list[i].totalPrice
      }
      this.profitObject.amountDue += list[i].amountDueTotal;
    }
    this.profitObject.profit = this.profitObject.stock - (this.profitObject.miscellaneous + this.profitObject.customer + this.profitObject.dealer) ;
  }

  download_excel() {
    this.download_loading = true;    
    let a = document.createElement("a");
    document.body.appendChild(a);
    let binaryData = [];
    let url = "http://localhost:8081/downloadexcelProfit";
        
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
