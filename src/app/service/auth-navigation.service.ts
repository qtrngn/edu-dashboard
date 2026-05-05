import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuthRoleConfig, isAuthRole } from '@configs/auth-role.config';
import { EAuthRole } from '@enums/user-management.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthNavigationService {
  constructor(private readonly router: Router) {}

  getRoleFromRoute(route: ActivatedRoute): EAuthRole | null {
    const roleParam = route.snapshot.paramMap.get('role');

    if (!isAuthRole(roleParam)) {
      return null;
    };

    return roleParam;
  };

  async redirectToOnboarding(): Promise<void> {
    await this.router.navigate(['/'], { replaceUrl: true });
  };

  async navigateToDashboard(role: EAuthRole): Promise<void> {
    const roleConfig = getAuthRoleConfig(role);

    await this.router.navigate([roleConfig.dashboardPath], { replaceUrl: true });
  };

  async navigateToLogin(role: EAuthRole): Promise<void> {
    const roleConfig = getAuthRoleConfig(role);

    await this.router.navigate([roleConfig.loginPath], { replaceUrl: true });
  };
};