// src/utils/auth.js
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};

export const logoutUser = async () => {
    await signOut(auth);
};
