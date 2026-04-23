import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
// PAGES
import { Onboarding } from '@pages/onboarding/onboarding';
import { Login } from '@pages/login/login';
import { Register } from '@pages/register/register';
import { AdminDashboard  } from '@pages/dashboard/admin-dashboard/admin-dashboard';
import { TeacherDashboard } from '@pages/dashboard/teacher-dashboard/teacher-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Onboarding,
  },
  {
    path: 'login/:role',
    component: Login,
  },
  {
    path: 'register/:role',
    component: Register,
  },
  {
    path: 'dashboard/admin',
    component: AdminDashboard,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard/teacher',
    component: TeacherDashboard,
    canActivate: [authGuard],
  },
];
