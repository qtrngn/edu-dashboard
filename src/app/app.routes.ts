import { Routes } from '@angular/router';
// PAGES
import { Onboarding } from '@pages/onboarding/onboarding';
import { Login } from '@pages/login/login';
import { Register } from '@pages/register/register';
import { TeacherDashboard } from "@pages/dashboard/teacher-dashboard/teacher-dashboard";
import { StudentDashboard } from '@pages/dashboard/student-dashboard/student-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Onboarding
  },
  {
    path: 'login/:role',
    component: Login
  },
  {
    path: 'register/:role',
    component: Register
  },
  {
    path: "dashboard/teacher",
    component: TeacherDashboard,
  },
  {
    path: "dashboard/student",
    component: StudentDashboard,
  },
];
