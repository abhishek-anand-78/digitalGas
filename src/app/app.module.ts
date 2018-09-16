import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import { ProfitComponent } from './profit/profit.component';
import { StockComponent } from './stock/stock.component';
import { NgbdModalBasic } from './new-dealer-modal/dealer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrationComponent,
    BillComponent,
    TransactionComponent,
    AboutComponent,
    ProfitComponent,
    StockComponent,
    NgbdModalBasic
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    HttpModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [AlertService
    // AuthenticationService, fakeBackendProvider,
    //   { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
