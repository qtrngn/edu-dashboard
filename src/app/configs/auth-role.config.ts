import { EAuthRole, EManagedUserType } from '@enums/user-management.enum';
import type { AuthRoleConfig } from '@app/types/auth.types';


export const AUTH_ROLE_CONFIG: Record<EAuthRole, AuthRoleConfig> = {
  [EAuthRole.Admin]: {
    role: EAuthRole.Admin,
    label: 'Admin',
    loginPath: '/login/admin',
    registerPath: '/register/admin',
    dashboardPath: '/dashboard/admin',
    managedUserType: EManagedUserType.Teacher,
    dashboardTitle: 'Teacher Management',
    authPanelTitle: 'Manage teachers',
    registerPanelTitle: 'Create account',
    authPanelBgClass: 'bg-sky-50',
    onboardingImage: 'assets/images/onboarding/onboarding-admin.gif',
    onboardingBorderHoverClass: 'hover:border-teal-300',
    onboardingTextClass: 'text-teal-300',
  },
  [EAuthRole.Teacher]: {
    role: EAuthRole.Teacher,
    label: 'Teacher',
    loginPath: '/login/teacher',
    registerPath: '/register/teacher',
    dashboardPath: '/dashboard/teacher',
    managedUserType: EManagedUserType.Student,
    dashboardTitle: 'Student Management',
    authPanelTitle: 'Manage students',
    registerPanelTitle: 'Create account',
    authPanelBgClass: 'bg-emerald-50',
    onboardingImage: 'assets/images/onboarding/onboarding-teacher.gif',
    onboardingBorderHoverClass: 'hover:border-pink-400',
    onboardingTextClass: 'text-pink-400',
  },
};

export function isAuthRole(value: string | null): value is EAuthRole {
  return !!value && value in AUTH_ROLE_CONFIG;
}
export function getAuthRoleConfig(role: EAuthRole): AuthRoleConfig {
  return AUTH_ROLE_CONFIG[role];
}