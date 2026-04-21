import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Auth } from '../../shared/layout/auth/auth';

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
  role = '';

  // Hold the raw login form values
  loginModel = signal<LoginForm>({
    email: '',
    password: '',
  });

  // Build the signal form and attach validation rules
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });
  // Give this page access to the current route
  constructor(private route: ActivatedRoute) {}

  // Read the role parameter when the page loads
  ngOnInit(): void {
    this.role = this.route.snapshot.paramMap.get('role') ?? '';
  }

  // Handle form submission
  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, {
      action: async () => {
        const credentials = this.loginModel();
        console.log('Logging in with:', credentials);
      },
    });
  }
}
