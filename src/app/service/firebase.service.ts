// Use Injectable decorator to make this service available and later on can inject it into another class
import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth as FirebaseAuth, getAuth } from 'firebase/auth';
import { environment } from '@environments/environment';
import { Firestore, getFirestore } from 'firebase/firestore';

@Injectable({
  // Create 1 shared instance for the whole app
  providedIn: 'root',
})
export class FirebaseService {
  // Hold the initialized Firebase app and auth instances as readonly(set it once and dont change it later) properties
  readonly app: FirebaseApp;
  // Hold the firebase auth instance
  readonly auth: FirebaseAuth;
  // Hold the firebase firestore instance
  readonly db: Firestore;

  constructor() {
    // If app exists use getApp() otherwise use initializeApp()
    this.app = getApps().length ? getApp() : initializeApp(environment.firebase);
    // Create firebase auth for this app
    this.auth = getAuth(this.app);
    // Create firebase firestore for this app
    this.db = getFirestore(this.app);
  }
}
