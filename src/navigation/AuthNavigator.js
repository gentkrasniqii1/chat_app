import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import authentication-related screens
import AuthScreen from '../screens/AuthScreen'; // Adjust path as per your folder structure

// Create a Stack Navigator instance
const Stack = createStackNavigator();

/**
 * AuthNavigator Component
 * This is a dedicated stack navigator for authentication-related screens.
 * It currently includes the AuthScreen (for login and registration).
 *
 * Props:
 * - onAuthSuccess: Function to call when a user successfully logs in or registers.
 * This prop is passed down from AppNavigator to AuthScreen.
 */
const AuthNavigator = ({ onAuthSuccess }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the default header for all screens in this stack
      }}
    >
      {/* AuthScreen for handling both login and registration */}
      <Stack.Screen name="AuthScreen">
        {/* Render AuthScreen and pass the onAuthSuccess callback */}
        {props => (
          <AuthScreen {...props} onAuthSuccess={onAuthSuccess} />
        )}
      </Stack.Screen>

      {/*
        // Future expansion: You could add more authentication-related screens here, e.g.:
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="RegistrationDetailsScreen" component={RegistrationDetailsScreen} />
      */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
