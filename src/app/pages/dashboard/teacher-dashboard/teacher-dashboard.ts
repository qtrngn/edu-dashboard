import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardShell } from '@shared/layout/dashboard-shell/dashboard-shell';
import { UserManagementDashboard } from '@shared/features/user-management-dashboard/user-management-dashboard';
import { AuthService } from '@service/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [DashboardShell, UserManagementDashboard],
  templateUrl: './teacher-dashboard.html',
})
export class TeacherDashboard {
   constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}
   async onLogoutClick(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login/teacher'], { replaceUrl: true });
  }
}
