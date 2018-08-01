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
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  get f() {
    return this.billForm.controls;
  }

}
