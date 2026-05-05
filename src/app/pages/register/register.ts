import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { form, FormField, submit } from '@angular/forms/signals';
import { LucideEye, LucideEyeOff } from '@lucide/angular';
import { Auth } from '@shared/layout/auth/auth';
import { AuthFormShell } from '@shared/layout/auth-form-shell/auth-form-shell';
import { AuthService } from '@service/auth.service';
import { UserProfileService } from '@service/user-profile.service';
import { AuthNavigationService } from '@service/auth-navigation.service';
import { EAuthRole } from '@enums/user-management.enum';
import { getAuthRoleConfig } from '@configs/auth-role.config';
import { applyRegisterValidation } from '@configs/auth-validation.config';
import { getAuthFormConfig, type AuthFormConfig } from '@configs/auth-form.config';
import type { AuthRoleConfig, RegisterForm } from '@app/types/auth.types';

@Component({
  selector: 'app-register',
  imports: [Auth, AuthFormShell, FormField, RouterLink, LucideEye, LucideEyeOff],
  templateUrl: './register.html',
  styleUrl: '../../shared/layout/auth/auth.css',
})
export class Register implements OnInit {
  role!: EAuthRole;

  // Show/Hide password states
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // Hold the raw registration form values
  registerModel = signal<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  registerError = signal('');

  // Build the form and attach validation rules
  registerForm = form(this.registerModel, (schemaPath) => {
    applyRegisterValidation(schemaPath);
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
  return getAuthFormConfig('register');
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
  // Register failure helper
  private async failRegister(message: string): Promise<void> {
    await this.authService.logout();
    this.registerError.set(message);
  }
  // Password toggle
  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  // Handle form submission and navigate users
  onSubmit(event: Event): void {
    event.preventDefault();

    this.registerError.set('');

    submit(this.registerForm, {
      action: async () => {
        try {
          const { username, email, password } = this.registerModel();

          const user = await this.authService.register(email, password, username);

          await this.userProfileService.createUserProfile({
            uid: user.uid,
            email,
            username,
            role: this.role,
            createdAt: new Date().toISOString(),
          });

          await this.navigateByRole();
        } catch (error) {
          await this.failRegister('Registration failed. Please try again.');
        }
      },
    });
  }
}
