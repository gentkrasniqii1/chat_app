import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut, // Import signOut for the logout functionality
} from 'firebase/auth';

// Import the AppNavigator
import AppNavigator from './src/navigation/AppNavigator'; // Adjust path as per your folder structure

// Global variables provided by the Canvas environment
// These are mandatory and will be available at runtime.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(
  typeof __firebase_config !== 'undefined'
    ? __firebase_config
    : '{}'
);
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App
// This should only be called once in your application's lifecycle.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the Firebase Auth instance

// Main App Component
export default function App() {
  const [userId, setUserId] = useState(null); // Stores the authenticated user's ID
  const [loadingAuth, setLoadingAuth] = useState(true); // Loading state for initial authentication check
  const [authError, setAuthError] = useState(null); // Error state for authentication issues

  /**
   * Effect hook for Firebase Authentication.
   * This runs once on component mount to initialize Firebase Auth and
   * set up a listener for authentication state changes.
   * It attempts to sign in the user using a custom token or anonymously.
   */
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Attempt to sign in with custom token if provided by the environment.
        // Otherwise, sign in anonymously to ensure a user ID is always available
        // for Firestore interactions (e.g., storing messages).
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }

        // Set up an authentication state change listener.
        // This listener will be triggered whenever the user's sign-in state changes
        // (e.g., after successful login/registration, or sign-out).
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            // If a user object exists, they are authenticated.
            setUserId(user.uid); // Store the user's unique ID.
            console.log('User authenticated:', user.uid);
          } else {
            // If no user object, they are not authenticated.
            setUserId(null);
            console.log('No user authenticated.');
          }
          setLoadingAuth(false); // Authentication check is complete, stop loading.
          setAuthError(null); // Clear any previous authentication errors.
        });

        // Return a cleanup function to unsubscribe from the auth listener
        // when the component unmounts, preventing memory leaks.
        return () => unsubscribeAuth();
      } catch (e) {
        // Catch any errors during the initial sign-in process.
        console.error('Firebase Auth Error during setup:', e);
        setAuthError('Failed to initialize authentication. Please try again.');
        setLoadingAuth(false); // Stop loading even if there's an error.
      }
    };

    setupAuth(); // Call the setup function when the component mounts.
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  /**
   * Handles user sign-out.
   * This function is passed down to the SettingsScreen via the navigators.
   */
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Call Firebase signOut method.
      setUserId(null); // Clear the user ID from state.
      console.log('User signed out successfully.');
    } catch (e) {
      console.error('Error signing out:', e);
      // In a real app, you might use a CustomModal here instead of a native alert.
      alert('Failed to sign out. Please try again.');
    }
  };

  /**
   * Callback function passed to AuthScreen.
   * This is called when a user successfully logs in or registers via AuthScreen.
   * The `onAuthStateChanged` listener in this `App.js` will then detect the
   * authentication state change and update the `userId` accordingly.
   */
  const handleAuthSuccess = () => {
    console.log('Authentication successful in AuthScreen. App.js onAuthStateChanged will update userId.');
    // No direct state update of userId needed here, as the onAuthStateChanged listener
    // above will handle it automatically when Firebase updates the auth state.
  };

  /**
   * Placeholder function for handling the initiation of a new chat.
   * This function would typically be called from NewChatScreen (via MainTabNavigator).
   * In a full implementation, this would involve navigating to a specific chat screen
   * with the selected users, potentially creating a new chat room in Firestore.
   *
   * @param {Array} selectedUsers - An array of user objects selected for the new chat.
   * Each user object is expected to have at least `id` and `displayName`.
   */
  const handleStartChat = (selectedUsers) => {
    console.log('Initiating chat with:', selectedUsers.map(u => u.displayName).join(', '));
    // Example: You might navigate to a dedicated chat conversation screen here.
    // For now, a simple alert demonstrates the functionality.
    alert(`Starting chat with: ${selectedUsers.map(u => u.displayName).join(', ')}`);
    // If you have a navigation stack for chat, you'd do something like:
    // navigation.navigate('ChatStack', { screen: 'ConversationScreen', params: { participants: selectedUsers } });
  };

  // --- Conditional Rendering for App Initialization State ---

  // Display a full-screen loading indicator while Firebase Authentication is being set up.
  if (loadingAuth) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Initializing App...</Text>
      </SafeAreaView>
    );
  }

  // Display a full-screen error message if authentication failed during setup.
  if (authError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#ff6347" />
        <Text style={styles.errorText}>Error: {authError}</Text>
        <Text style={styles.errorSubText}>Please restart the app or check your internet connection.</Text>
      </SafeAreaView>
    );
  }

  // If authentication is complete and no errors, render the AppNavigator.
  // The AppNavigator will then decide whether to show AuthScreen or MainTabNavigator
  // based on the `userId` prop.
  return (
    <AppNavigator
      userId={userId} // Pass the current user's ID to the navigator.
      onAuthSuccess={handleAuthSuccess} // Pass the callback for successful authentication.
      onSignOut={handleSignOut} // Pass the callback for signing out.
      onStartChat={handleStartChat} // Pass the callback for starting new chats.
    />
  );
}

// StyleSheet for the main App component's loading and error states.
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34', // Dark background for loading screen
  },
  loadingText: {
    marginTop: 10,
    color: '#fff', // White text
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6347', // Tomato red background for errors
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorSubText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
