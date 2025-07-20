// useAuth.js
// Purpose: A custom hook that provides authentication status (isAuthenticated, userId, loadingAuth)
// and authentication functions (e.g., signIn, signOut) to any component.
// Contribution: Clean state management, code reusability, and simplified access to authentication context.

import { useState, useEffect } from 'react';
import {
  registerUser,
  loginUser,
  signOutUser,
  signInAnonymouslyUser, // Include anonymous sign-in if still used in App.js initial setup
  onAuthStateChange,
} from '../services/authService'; // Adjust path to your authService.js

/**
 * useAuth Custom Hook
 * Provides authentication status and functions to any React component.
 * It manages the user's authentication state, loading indicators, and errors.
 *
 * @returns {object} An object containing:
 * - user: The Firebase User object (or null if not authenticated).
 * - userId: The user's unique ID (string | null).
 * - isAuthenticated: Boolean indicating if a user is logged in.
 * - loading: Boolean indicating if authentication operations are in progress.
 * - error: Any error message from authentication operations (string | null).
 * - register: Function to register a new user.
 * - login: Function to log in an existing user.
 * - logout: Function to log out the current user.
 * - signInAnonymously: Function to sign in anonymously.
 */
const useAuth = () => {
  const [user, setUser] = useState(null); // Firebase User object
  const [userId, setUserId] = useState(null); // User's UID
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
  const [loading, setLoading] = useState(true); // Loading state for auth operations
  const [error, setError] = useState(null); // Error message

  /**
   * Effect hook to listen for Firebase authentication state changes.
   * This keeps the hook's state synchronized with Firebase Auth's actual state.
   */
  useEffect(() => {
    // Subscribe to auth state changes using the service function
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      setUserId(firebaseUser ? firebaseUser.uid : null);
      setIsAuthenticated(!!firebaseUser); // Set isAuthenticated based on user presence
      setLoading(false); // Auth state check is complete
      setError(null); // Clear any previous errors on auth state change
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Handles user registration.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   */
  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(email, password);
      // onAuthStateChange listener will update user/userId/isAuthenticated
    } catch (e) {
      console.error('Registration failed:', e);
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user login.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      // onAuthStateChange listener will update user/userId/isAuthenticated
    } catch (e) {
      console.error('Login failed:', e);
      setError(e.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user logout.
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOutUser();
      // onAuthStateChange listener will update user/userId/isAuthenticated to null/false
    } catch (e) {
      console.error('Logout failed:', e);
      setError(e.message || 'Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles anonymous sign-in.
   */
  const signInAnonymously = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymouslyUser();
      // onAuthStateChange listener will update user/userId/isAuthenticated
    } catch (e) {
      console.error('Anonymous sign-in failed:', e);
      setError(e.message || 'Anonymous sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userId,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    signInAnonymously,
  };
};

export default useAuth;
