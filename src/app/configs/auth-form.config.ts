export type AuthFormMode = 'login' | 'register';

export interface AuthFormConfig {
  title: string;
  description: string;
  badgeLabel: string;
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
}

export const AUTH_FORM_CONFIG: Record<AuthFormMode, AuthFormConfig> = {
  login: {
    title: 'Welcome back',
    badgeLabel: 'Login',
    description: 'Sign in to continue',
    submitLabel: 'Login',
    footerText: "Don't have an account?",
    footerLinkLabel: 'Register',
  },
  register: {
    title: 'Create your account',
    badgeLabel: 'Register',
    description: 'Register to get started',
    submitLabel: 'Create account',
    footerText: 'Already have an account?',
    footerLinkLabel: 'Login',
  },
};

export function getAuthFormConfig(mode: AuthFormMode): AuthFormConfig {
  return AUTH_FORM_CONFIG[mode];
}