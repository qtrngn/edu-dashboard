import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@service/auth.service';

// Wait for AuthService to finish checking the user's auth state.
async function waitForAuthReady(authService: AuthService): Promise<void> {
  while (!authService.isAuthReady()) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await waitForAuthReady(authService);

  // Allow dashboard access if a Firebase user is currently logged in.
  const user = authService.getCurrentUser();

  if (user) {
    return true;
  }

  // Redirect unauthenticated users to onboarding.
  return router.createUrlTree(['/']);
};