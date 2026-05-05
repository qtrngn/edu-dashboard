import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { form, FormField, submit } from '@angular/forms/signals';
import { Auth } from '@shared/layout/auth/auth';
import { AuthFormShell } from '@shared/layout/auth-form-shell/auth-form-shell';
import { AuthService } from '@service/auth.service';
import { AuthNavigationService } from '@service/auth-navigation.service';
import { UserProfileService } from '@service/user-profile.service';
import { EAuthRole } from '@enums/user-management.enum';
import { getAuthRoleConfig, isAuthRole } from '@configs/auth-role.config';
import { applyLoginValidation } from '@configs/auth-validation.config';
import { getAuthFormConfig, type AuthFormConfig } from '@configs/auth-form.config';
import type { AuthRoleConfig, LoginForm } from '@app/types/auth.types';

@Component({
  selector: 'app-login',
  imports: [Auth, AuthFormShell, FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../../shared/layout/auth/auth.css',
})
export class Login implements OnInit {
  // Store the current role from the URL
  role!: EAuthRole;

  // Hold the raw login form values
  loginModel = signal<LoginForm>({
    email: '',
    password: '',
  });
  loginError = signal('');

  // Build the form and attach validation rules
  loginForm = form(this.loginModel, (schemaPath) => {
    applyLoginValidation(schemaPath);
  });

  // Give this page access to the current route
  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly userProfileService: UserProfileService,
    private readonly authNavigationService: AuthNavigationService,
  ) {}

  get roleConfig(): AuthRoleConfig {
    return getAuthRoleConfig(this.role);
  }

  get formConfig(): AuthFormConfig {
    return getAuthFormConfig('login');
  }

  // Read the role parameter when the page loads
  ngOnInit(): void {
    const role = this.authNavigationService.getRoleFromRoute(this.route);
    if (role) {
      this.role = role;
      return;
    }

    void this.authNavigationService.redirectToOnboarding();
  }

  // Navigate depends on roles
  private async navigateByRole(): Promise<void> {
    await this.authNavigationService.navigateToDashboard(this.role);
  }

  // Login failure helper
  private async failLogin(message: string): Promise<void> {
    await this.authService.logout();
    this.loginError.set(message);
  }

  // Handle form submission and navigate users
  onSubmit(event: Event): void {
    event.preventDefault();

    this.loginError.set('');

    submit(this.loginForm, {
      action: async () => {
        try {
          const { email, password } = this.loginModel();
          const user = await this.authService.login(email, password);
          const profile = await this.userProfileService.getUserProfile(user.uid);

          // Reject if profile is missing
          if (!profile) {
            await this.failLogin('User profile not found.');
            return;
          }

          // Reject login on the wrong page
          if (profile.role !== this.role) {
            if (!isAuthRole(profile.role)) {
              await this.failLogin('This account has an unsupported role.');
              return;
            }

            const correctPage = getAuthRoleConfig(profile.role).label;

            await this.failLogin(
              `This account must sign in through the ${correctPage} login page.`,
            );
            return;
          }
          await this.navigateByRole();
        } catch (error) {
          await this.failLogin('Login failed. Please check your credentials and try again.');
        }
      },
    });
  }
}
