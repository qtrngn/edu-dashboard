import { Injectable, signal, OnDestroy } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  readonly user = signal<User | null>(null);
  readonly isAuthReady = signal(false);

  private readonly unsubscribeAuthState: () => void;

  // Start listening to Firebase auth state and sync it into local signals.

  constructor(private readonly firebaseService: FirebaseService) {
    this.unsubscribeAuthState = onAuthStateChanged(this.firebaseService.auth, (user) => {
      this.user.set(user);
      this.isAuthReady.set(true);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAuthState();
  }

  // Register new user
  async register(email: string, password: string, username: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(
      this.firebaseService.auth,
      email,
      password,
    );

    const trimmedUsername = username.trim();

    if (trimmedUsername) {
      await updateProfile(credential.user, {
        displayName: trimmedUsername,
      });
    }

    this.user.set(credential.user);
    return credential.user;
  }

  // Sign in existing user
  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.firebaseService.auth, email, password);

    this.user.set(credential.user);
    return credential.user;
  }

  // Log out current user
  async logout(): Promise<void> {
    await signOut(this.firebaseService.auth);
    this.user.set(null);
  }

  // Get the current user value
  getCurrentUser(): User | null {
    return this.user();
  }
}
