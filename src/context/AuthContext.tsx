import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsGuest: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'sutardeepa470@gmail.com';

/**
 * Transforms Firebase Auth error codes into helpful user-facing error messages
 * with clear troubleshooting advice for CORS, authorized domains, and enabled sign-in methods.
 */
export function formatAuthError(err: unknown): Error {
  const code = (err as { code?: string })?.code || '';
  const rawMsg = err instanceof Error ? err.message : String(err);

  if (code === 'auth/unauthorized-domain' || rawMsg.includes('auth/unauthorized-domain')) {
    return new Error(
      'This domain is not authorized in the Firebase Console. ' +
      'Please add this domain to Firebase Console > Authentication > Settings > Authorized domains. ' +
      'Alternatively, you can click "Continue as Guest".'
    );
  }

  if (code === 'auth/operation-not-allowed' || rawMsg.includes('auth/operation-not-allowed')) {
    return new Error(
      'Email/Password sign-in is not enabled in your Firebase project. ' +
      'Please enable "Email/Password" in Firebase Console > Authentication > Sign-in method, ' +
      'or sign in using Google or "Continue as Guest".'
    );
  }

  if (code === 'auth/email-already-in-use' || rawMsg.includes('auth/email-already-in-use')) {
    return new Error('An account with this email address already exists. Please sign in instead.');
  }

  if (code === 'auth/invalid-email' || rawMsg.includes('auth/invalid-email')) {
    return new Error('The email address is invalid. Please check the spelling and try again.');
  }

  if (code === 'auth/weak-password' || rawMsg.includes('auth/weak-password')) {
    return new Error('Password must be at least 6 characters long.');
  }

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    rawMsg.includes('auth/invalid-credential') ||
    rawMsg.includes('auth/wrong-password')
  ) {
    return new Error('Incorrect email or password. Please verify your details or reset your password.');
  }

  if (code === 'auth/too-many-requests' || rawMsg.includes('auth/too-many-requests')) {
    return new Error('Too many unsuccessful attempts. Access is temporarily restricted. Please reset your password or try again later.');
  }

  if (code === 'auth/popup-closed-by-user' || rawMsg.includes('auth/popup-closed-by-user')) {
    return new Error('Google Sign-In popup was closed before completion. Please try again.');
  }

  if (code === 'auth/network-request-failed' || rawMsg.includes('auth/network-request-failed')) {
    return new Error('Network connection failed. Please check your internet connection and ensure CORS is allowed.');
  }

  return new Error(rawMsg.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, '').trim());
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to fetch or create a user profile document in Firestore
  const fetchProfile = async (firebaseUser: User, customName?: string) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const isUserAdmin = firebaseUser.email === ADMIN_EMAIL;

      let docSnap;
      try {
        docSnap = await getDoc(userDocRef);
      } catch (getErr) {
        console.warn('Could not read user profile from Firestore:', getErr);
      }

      if (docSnap && docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile({
          ...data,
          role: isUserAdmin ? 'admin' : (data.role || 'student')
        });
      } else {
        // Construct default profile
        const initialName =
          customName ||
          firebaseUser.displayName ||
          (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Code Explorer');

        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: initialName,
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || '',
          experienceLevel: 'beginner',
          preferredLanguage: 'JavaScript',
          learningGoals: 'Master full-stack programming and ace coding interviews',
          role: isUserAdmin ? 'admin' : 'student',
          createdAt: new Date().toISOString(),
          streakDays: 1,
          totalHoursLearned: 0.5
        };

        // Set local state immediately so UI is always responsive
        setProfile(newProfile);

        // Attempt persistence to Firestore
        try {
          await setDoc(userDocRef, newProfile);
        } catch (setErr) {
          console.warn('Could not persist initial profile to Firestore:', setErr);
          // Non-fatal: user can still use the app with local state
        }
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await fetchProfile(res.user);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw formatAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail) {
      throw new Error('Please enter a valid email address.');
    }
    if (!cleanName) {
      throw new Error('Please provide your full name.');
    }
    if (!pass || pass.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      // 1. Create account in Firebase Authentication
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);

      // 2. Update display name in Firebase Auth
      try {
        await updateProfile(cred.user, { displayName: cleanName });
      } catch (updErr) {
        console.warn('Could not update Firebase displayName:', updErr);
      }

      // 3. Populate initial profile with custom name
      await fetchProfile(cred.user, cleanName);
    } catch (error) {
      console.error('Sign-up failed:', error);
      throw formatAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!pass) {
      throw new Error('Please enter your password.');
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      await fetchProfile(cred.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw formatAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = () => {
    const guestUid = 'guest-' + Math.random().toString(36).substring(2, 9);
    const guestUser = {
      uid: guestUid,
      displayName: 'Guest Student',
      email: 'student@codebuddy.guest',
      emailVerified: true,
      isAnonymous: true,
      providerData: []
    } as unknown as User;

    const guestProfile: UserProfile = {
      uid: guestUid,
      name: 'Guest Student',
      email: 'student@codebuddy.guest',
      photoURL: '',
      experienceLevel: 'beginner',
      preferredLanguage: 'JavaScript',
      learningGoals: 'Master full-stack programming with CodeBuddy AI',
      role: 'student',
      createdAt: new Date().toISOString(),
      streakDays: 1,
      totalHoursLearned: 1.0
    };

    setUser(guestUser);
    setProfile(guestProfile);
    setLoading(false);
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setProfile(null);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    if (user.isAnonymous || user.uid.startsWith('guest-')) {
      setProfile(prev => (prev ? { ...prev, ...data } : null));
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      setProfile(prev => (prev ? { ...prev, ...data } : null));
    } catch (err) {
      setProfile(prev => (prev ? { ...prev, ...data } : null));
      console.warn('Could not persist profile to Firestore:', err);
    }
  };

  const sendPasswordReset = async (email: string) => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      throw new Error('Please enter your email address to receive a reset link.');
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw formatAuthError(error);
    }
  };

  const refreshProfile = async () => {
    if (user && !user.uid.startsWith('guest-')) {
      await fetchProfile(user);
    }
  };

  const isAdmin = user?.email === ADMIN_EMAIL || profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signInAsGuest,
        logout,
        updateUserProfile,
        sendPasswordReset,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
