import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardShell } from '@shared/layout/dashboard-shell/dashboard-shell';
import { UserManagementDashboard } from '@features/user-management-dashboard/user-management-dashboard';
import { AuthService } from '@service/auth.service';
import { EManagedUserType } from '@enums/user-management.enum';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardShell, UserManagementDashboard],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  readonly managedUserType = EManagedUserType.Teacher;
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  async onLogoutClick(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login/admin'], { replaceUrl: true });
  }
}
