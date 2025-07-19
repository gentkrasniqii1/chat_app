import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens and sub-navigators
import AuthScreen from '../screens/AuthScreen'; // Import the AuthScreen component
import MainTabNavigator from './MainTabNavigator'; // Import the MainTabNavigator (to be created next)

// Create a Stack Navigator
const Stack = createStackNavigator();

/**
 * AppNavigator Component
 * This is the root navigator of the application.
 * It determines whether to show the authentication flow (AuthScreen)
 * or the main application tabs (MainTabNavigator) based on the user's authentication status.
 *
 * Props:
 * - userId: The ID of the currently authenticated user. If null, AuthScreen is shown.
 * - onAuthSuccess: Function to call when authentication is successful (passed to AuthScreen).
 * - onSignOut: Function to call when the user signs out (passed to MainTabNavigator).
 * - onStartChat: Function to handle starting a new chat (passed to MainTabNavigator for NewChatScreen).
 */
const AppNavigator = ({ userId, onAuthSuccess, onSignOut, onStartChat }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userId ? (
          // User is authenticated, show the main application tabs
          <Stack.Screen name="MainTabs">
            {/* Render MainTabNavigator and pass necessary props */}
            {props => (
              <MainTabNavigator
                {...props}
                userId={userId}
                onSignOut={onSignOut}
                onStartChat={onStartChat} // Pass onStartChat down to MainTabNavigator
              />
            )}
          </Stack.Screen>
        ) : (
          // No user authenticated, show the authentication screen
          <Stack.Screen name="Auth">
            {/* Render AuthScreen and pass the onAuthSuccess callback */}
            {props => (
              <AuthScreen {...props} onAuthSuccess={onAuthSuccess} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
