import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Auth } from '@shared/layout/auth/auth';
import { AuthService } from '@service/auth.service';
import { UserProfileService } from '@service/user-profile.service';
import type { Role } from '@pages/onboarding/onboarding';

interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [Auth, FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../../shared/layout/auth/auth.css',
})
export class Login implements OnInit {
  // Store the current role from the URL
  role!: Role;

  // Hold the raw login form values
  loginModel = signal<LoginForm>({
    email: '',
    password: '',
  });
  loginError = signal('');

  // Build the form and attach validation rules
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });
  // Give this page access to the current route
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router,
  ) {}

  // Read the role parameter when the page loads
  ngOnInit(): void {
    const roleParam = this.route.snapshot.paramMap.get('role');

    if (roleParam === 'admin' || roleParam === 'teacher') {
      this.role = roleParam;
    } else {
      this.role = 'teacher';
    }
  }

  // Navigate depends on roles
  private async navigateByRole(): Promise<void> {
    if (this.role === 'admin') {
      await this.router.navigate(['/dashboard/admin'], { replaceUrl: true });
      return;
    }

    await this.router.navigate(['/dashboard/teacher'], { replaceUrl: true });
  }

  // Login failure helper
  private async failLogin(message: string): Promise<void> {
    await this.authService.logout();
    this.loginError.set(message);
  }

  // Handle form submission and navigate users
  onSubmit(event: Event) {
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
            const correctPage = profile.role === 'admin' ? 'Admin' : 'Teacher';
            await this.failLogin(`This account must sign in through the ${correctPage} login page.`);
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
