import { email as emailValidator, minLength, required, validate } from '@angular/forms/signals';
import type { LoginForm, RegisterForm } from '@app/types/auth.types';

type AuthStringFieldPath = Parameters<typeof emailValidator>[0];

type AuthValidationSchema<TForm> = {
  [FieldName in keyof TForm]: AuthStringFieldPath;
};

type LoginValidationSchema = AuthValidationSchema<LoginForm>;
type RegisterValidationSchema = AuthValidationSchema<RegisterForm>;

export const AUTH_PASSWORD_MIN_LENGTH = 8;

export const AUTH_VALIDATION_MESSAGES = {
  usernameRequired: 'Username is required',
  emailRequired: 'Email is required',
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordMinLength: `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters`,
  confirmPasswordRequired: 'Please confirm your password',
  passwordMismatch: 'Passwords do not match',
} as const;

// Login validation
export function applyLoginValidation(schemaPath: LoginValidationSchema): void {
  required(schemaPath.email, {
    message: AUTH_VALIDATION_MESSAGES.emailRequired,
  });

  emailValidator(schemaPath.email, {
    message: AUTH_VALIDATION_MESSAGES.emailInvalid,
  });
 
  required(schemaPath.password, {
    message: AUTH_VALIDATION_MESSAGES.passwordRequired,
  });
}

// Register validation
export function applyRegisterValidation(schemaPath: RegisterValidationSchema): void {
  required(schemaPath.username, {
    message: AUTH_VALIDATION_MESSAGES.usernameRequired,
  });

  applyLoginValidation(schemaPath);

  minLength(schemaPath.password, AUTH_PASSWORD_MIN_LENGTH, {
    message: AUTH_VALIDATION_MESSAGES.passwordMinLength,
  });

  required(schemaPath.confirmPassword, {
    message: AUTH_VALIDATION_MESSAGES.confirmPasswordRequired,
  });

  validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
    if (!value()) {
      return null;
    }

    if (value() !== valueOf(schemaPath.password)) {
      return {
        kind: 'passwordMismatch',
        message: AUTH_VALIDATION_MESSAGES.passwordMismatch,
      };
    }

    return null;
  });
}
