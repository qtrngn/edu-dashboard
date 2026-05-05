import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import type { UserProfile } from '@app/types/auth.types';


@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private readonly firebaseService: FirebaseService) {}

  //   Write user profile to firestore
  async createUserProfile(profile: UserProfile): Promise<void> {
    const userRef = doc(this.firebaseService.db, 'users', profile.uid);
    await setDoc(userRef, profile);
  }

  // Check if user profile exists in firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(this.firebaseService.db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as UserProfile;
  }

  // Get all user profiles
  async getAllUserProfiles(): Promise<UserProfile[]> {
    const usersRef = collection(this.firebaseService.db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((docSnapshot) => docSnapshot.data() as UserProfile);
  }
}
