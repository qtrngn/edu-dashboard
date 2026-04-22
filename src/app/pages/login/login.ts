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

    if (roleParam === 'teacher' || roleParam === 'student') {
      this.role = roleParam;
    } else {
      this.role = 'student';
    }
  }

  // Navigate depends on roles
  private async navigateByRole(): Promise<void> {
    if (this.role === 'teacher') {
      await this.router.navigate(['/dashboard/teacher']);
      return;
    }

    await this.router.navigate(['/dashboard/student']);
  }

  // Handle form submission and navigate users
  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, {
      action: async () => {
        const { email, password } = this.loginModel();
        const user = await this.authService.login(email, password);
        const profile = await this.userProfileService.getUserProfile(user.uid);

        if (!profile) {
          throw new Error('User profile not found.');
        }

        if (profile.role === 'teacher') {
          await this.router.navigate(['/dashboard/teacher']);
          return;
        }

        await this.router.navigate(['/dashboard/student']);
      },
    });
  }
}
