import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AboutComponent } from './about/about.component';
import { BillComponent } from './bill/bill.component';
import { TransactionComponent } from './transaction/transaction.component';
//import { AuthGuard } from './_guards';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: '', component: BillComponent },
      { path: 'billing', component: BillComponent },
      { path: 'transactions', component: TransactionComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);

