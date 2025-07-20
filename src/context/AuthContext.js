// AuthContext.js
// Purpose: Provides the authentication state and related functions globally to the entire application.
// Contribution: Efficient global state management for authentication, enhancing security and integrity by ensuring consistent user status.

import React, { createContext, useContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth'; // Adjust path to your useAuth.js hook

// Create the Auth Context
// This context will hold the authentication state and functions.
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * This component wraps your application (or parts of it) and provides
 * the authentication state and functions to all its children components
 * via the AuthContext.
 * It leverages the `useAuth` custom hook to manage the authentication logic.
 *
 * @param {object} { children } - React children to be rendered within the provider's scope.
 */
export const AuthProvider = ({ children }) => {
  // Use the custom useAuth hook to manage authentication logic and state.
  const {
    user,
    userId,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    signInAnonymously,
  } = useAuth();

  // The value that will be provided to consumers of AuthContext.
  // This includes the authentication status, user data, loading state, errors,
  // and functions to perform authentication actions.
  const authContextValue = {
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

  return (
    // Provide the authentication context value to all children.
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuthContext Custom Hook
 * A convenient hook to consume the AuthContext.
 * This hook makes it easier for components to access the authentication state
 * and functions without directly importing useContext and AuthContext.
 *
 * @returns {object} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
