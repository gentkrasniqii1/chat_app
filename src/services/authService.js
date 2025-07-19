// authService.js
// Purpose: Contains all functions related to user authentication (e.g., loginUser, registerUser, signOutUser, getCurrentUser).
// Contribution: Security (handling authentication securely), integrity (consistent user state), and clean separation of auth logic.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';

// Import the 'auth' instance from your centralized Firebase configuration.
// This ensures all authentication operations use the same Firebase app instance.
import { auth } from './firebase'; // Adjust path as per your folder structure

/**
 * Registers a new user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential.
 * @throws {FirebaseError} If registration fails.
 */
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered successfully:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Logs in an existing user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential.
 * @throws {FirebaseError} If login fails.
 */
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in successfully:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Error logging in user:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<void>} A promise that resolves when the user is signed out.
 * @throws {FirebaseError} If sign-out fails.
 */
const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully.');
  } catch (error) {
    console.error('Error signing out user:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Signs in a user anonymously.
 * Useful for initial access before full registration.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential.
 * @throws {FirebaseError} If anonymous sign-in fails.
 */
const signInAnonymouslyUser = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log('Signed in anonymously:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Error signing in anonymously:', error.code, error.message);
    throw error;
  }
};

/**
 * Gets the currently authenticated user object.
 * @returns {User | null} The current Firebase User object, or null if no user is signed in.
 */
const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Provides a listener for authentication state changes.
 * @param {function(User | null): void} callback - The callback function to run on auth state change.
 * @returns {function(): void} An unsubscribe function to detach the listener.
 */
const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Export all authentication-related functions for use in other parts of the application.
export {
  registerUser,
  loginUser,
  signOutUser,
  signInAnonymouslyUser,
  getCurrentUser,
  onAuthStateChange,
};
