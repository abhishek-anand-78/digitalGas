import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'app';
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    //public authenticationService: AuthenticationService,
    public alertService: AlertService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.f.username.value == 'admin' && this.f.password.value == 'admin') {
      console.log("logged in")
      this.router.navigate(['home']);
    } else {
      alert("Username or password is incorrect");
    }
    // this.authenticationService.login(this.f.username.value, this.f.password.value)
    //   .pipe(first())
    //   .subscribe(
    //   data => {
    //     this.router.navigate([this.returnUrl]);
    //   }
    //   ,
    //   error => {
    //     this.alertService.error(error);
    //     this.loading = false;
    //   });
  }

} 
