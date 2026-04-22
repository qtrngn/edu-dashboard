import { Injectable } from "@angular/core";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseService } from "./firebase.service";
import type { Role } from "../pages/onboarding/onboarding";

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  role: Role;
  createdAt: string;
}

@Injectable({
  providedIn: "root",
})
export class UserProfileService {
  constructor(private readonly firebaseService: FirebaseService) {}

//   Write user to firestore
  async createUserProfile(profile: UserProfile): Promise<void> {
    const userRef = doc(this.firebaseService.db, "users", profile.uid);
    await setDoc(userRef, profile);
  }

// Check if user profile exists in firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(this.firebaseService.db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}
}

