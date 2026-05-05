import { EAuthRole, EManagedUserType } from '@enums/user-management.enum';

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  username: string;
  confirmPassword: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  role: EAuthRole;
  createdAt: string;
}

export interface AuthRoleConfig {
  role: EAuthRole;
  label: string;
  loginPath: string;
  registerPath: string;
  dashboardPath: string;
  dashboardTitle: string;
  managedUserType: EManagedUserType;
  authPanelTitle: string;
  registerPanelTitle: string;
  authPanelBgClass: string;
  onboardingImage: string;
  onboardingBorderHoverClass: string;
  onboardingTextClass: string;
}