import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { routing } from './app.routing';
import { AlertService } from './services/alert.service';
import { AuthenticationService } from './services/authentication.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './utility/jwt.interceptor';
import { ErrorInterceptor } from './utility/error.interceptor';
import { fakeBackendProvider } from './utility/server.service';
import { BillComponent } from './bill/bill.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AboutComponent } from './about/about.component';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrationComponent,
    BillComponent,
    TransactionComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    routing,
    HttpModule,
    HttpClientModule
  ],
  providers: [AlertService
    // AuthenticationService, fakeBackendProvider,
    //   { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
