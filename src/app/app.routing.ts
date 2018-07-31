import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
//import { AuthGuard } from './_guards';

const appRoutes: Routes = [
      { path: 'home', component: HomeComponent },
    { path: '', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);