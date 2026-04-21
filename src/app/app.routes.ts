import { Routes } from '@angular/router';
// PAGES
import { Onboarding } from './pages/onboarding/onboarding';
import { Login } from './pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Onboarding
  },
  {
    path: 'login/:role',
    component: Login
  }
];
