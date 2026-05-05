import { Component } from '@angular/core';
import { DashboardShell } from '@shared/layout/dashboard-shell/dashboard-shell';
import { UserManagementDashboard } from '@features/user-management-dashboard/user-management-dashboard';
import { AuthService } from '@service/auth.service';
import { AuthNavigationService } from '@service/auth-navigation.service';
import { EAuthRole } from '@enums/user-management.enum';
import { getAuthRoleConfig } from '@configs/auth-role.config';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardShell, UserManagementDashboard],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  private readonly roleConfig = getAuthRoleConfig(EAuthRole.Admin);

  readonly managedUserType = this.roleConfig.managedUserType;
  readonly dashboardTitle = this.roleConfig.dashboardTitle;

  constructor(
    private readonly authService: AuthService,
    private readonly authNavigationService: AuthNavigationService,
  ) {}

  async onLogoutClick(): Promise<void> {
    await this.authService.logout();
    await this.authNavigationService.navigateToLogin(EAuthRole.Admin);
  }
}
