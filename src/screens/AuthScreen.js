import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Get Firebase Auth instance (assuming Firebase app is already initialized in App.js or a service)
// In a real app, you might pass 'auth' as a prop or use a context/hook.
// For this standalone component, we'll get it directly.
const auth = getAuth();

/**
 * AuthScreen Component
 * Handles user registration and login functionality.
 * This screen provides a full account management experience,
 * moving beyond anonymous authentication.
 *
 * Props:
 * - onAuthSuccess: Function to call when a user successfully logs in or registers.
 * Typically, this would navigate the user to the main chat screen.
 */
const AuthScreen = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // True for register, false for login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles the authentication process (login or registration) based on `isRegistering` state.
   * Interacts with Firebase Authentication.
   */
  const handleAuthentication = async () => {
    setError(null); // Clear previous errors
    setLoading(true); // Start loading indicator

    try {
      if (isRegistering) {
        // Attempt to create a new user with email and password
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User registered successfully!');
      } else {
        // Attempt to sign in an existing user
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully!');
      }
      // If successful, call the onAuthSuccess callback
      onAuthSuccess();
    } catch (e) {
      // Handle Firebase authentication errors
      let errorMessage = 'An unknown error occurred.';
      if (e.code) {
        switch (e.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use. Try logging in.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = `Authentication failed: ${e.message}`;
        }
      }
      setError(errorMessage);
      console.error('Authentication error:', e);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.authBox}>
          <Text style={styles.title}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </Text>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading} // Disable input during loading
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry // Hide password characters
            value={password}
            onChangeText={setPassword}
            editable={!loading} // Disable input during loading
          />

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Action Button (Login/Register) */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleAuthentication}
            disabled={loading || email.trim() === '' || password.trim() === ''} // Disable if loading or inputs are empty
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegistering ? 'Register' : 'Login'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle between Login and Register */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsRegistering(!isRegistering);
              setError(null); // Clear errors on toggle
              setEmail(''); // Clear inputs on toggle
              setPassword('');
            }}
            disabled={loading}
          >
            <Text style={styles.toggleButtonText}>
              {isRegistering
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34', // Dark background
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authBox: {
    backgroundColor: '#1a1a2e', // Darker box background
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400, // Max width for larger screens
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#3a3a4e', // Input field background
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  errorText: {
    color: '#ff6347', // Tomato red for errors
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#6200EE', // Primary button color
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 10,
  },
  toggleButtonText: {
    color: '#8c8c8c', // Lighter grey for toggle text
    fontSize: 14,
  },
});

export default AuthScreen;
