import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  email,
  form,
  FormField,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { LucideEye, LucideEyeOff } from '@lucide/angular';
import { Auth } from '@shared/layout/auth/auth';
import { AuthService } from '@service/auth.service';
import type { Role } from '@pages/onboarding/onboarding';
import { UserProfileService } from '@service/user-profile.service';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  imports: [Auth, FormField, RouterLink, LucideEye, LucideEyeOff],
  templateUrl: './register.html',
  styleUrl: '../../shared/layout/auth/auth.css',
})
export class Register implements OnInit {
  role!: Role;

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

  // Build the form and attach validation rules
  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' });

    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, {
      message: 'Password must be at least 8 characters',
    });

    required(schemaPath.confirmPassword, {
      message: 'Please confirm your password',
    });

    validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
      if (!value()) {
        return null;
      }

      if (value() !== valueOf(schemaPath.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }

      return null;
    });
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
    submit(this.registerForm, {
      action: async () => {
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
      },
    });
  }
}
