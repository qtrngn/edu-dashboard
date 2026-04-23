import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@service/auth.service';

// Wait for AuthService to finish initializing and checking the user's auth state
async function waitForAuthReady(authService: AuthService): Promise<void> {
  while (!authService.isAuthReady()) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await waitForAuthReady(authService);
    // Ask AuthService if the user is currently login 
    const user = authService.getCurrentUser();
    // If yes => allow access to the dashboard
    if (user) {
        return true;
    }
    // If not => fall back to onboarding page
    return router.createUrlTree(['/onboarding']);
}