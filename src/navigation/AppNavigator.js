import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens & Navigators
import AuthScreen from '../screens/AuthScreen';
import MainTabNavigator from './MainTabNavigator';

// Create stack
const Stack = createStackNavigator();

const AppNavigator = ({ userId, onAuthSuccess, onSignOut, onStartChat }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userId ? (
          <Stack.Screen name="MainTabs">
            {(props) => (
              <MainTabNavigator
                {...props}
                userId={userId}
                onSignOut={onSignOut}
                onStartChat={onStartChat}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => (
              <AuthScreen {...props} onAuthSuccess={onAuthSuccess} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
