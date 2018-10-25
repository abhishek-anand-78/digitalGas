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
  transData : any;
  customer_pdfForm: FormGroup;
  constructor(public http: HttpClient, private formBuilder: FormBuilder) {
    this.customer_pdfForm = this.formBuilder.group({
      id: ['', Validators.required],
      months: ['', Validators.required],
      year: ['', Validators.required]     
    });
   }

  ngOnInit() {
    this.http.get('http://localhost:8081/customerList').subscribe((data: any) => {
      this.customer_list = data.data;    
	  })
  }
  
  initialize() {
    this.transData = {
      id: this.customer_pdfForm.controls.id.value,
      month: this.customer_pdfForm.controls.months.value,
      year: this.customer_pdfForm.controls.year.value      
    }
    return this.transData;
  }

  search(): void {           
    this.initialize();
    let url = "http://localhost:8081/generatepdf_customer";        
    this.http.post(url, this.transData)
      .subscribe(res => {
            
      }, err => {
        console.log("error occurred", err);

      });    
  }

  downloadFile(){    
    var a = document.createElement("a");
    document.body.appendChild(a);
    let url = "http://localhost:8081/generatepdf_customer";        
    this.http.post(url, {},{
      responseType: 'arraybuffer'
    }).subscribe(res => {
                                      
      }, err => {
        console.log("error occurred", err);

      });
    var file = new Blob([res], {type: 'application/pdf'});
    var fileURL = window.URL.createObjectURL(file);        
    a.href = fileURL;
    a.download = this.billData['customerName'] + '_' +this.billData['date'] + '.pdf';
    a.click(); 
  }
}
