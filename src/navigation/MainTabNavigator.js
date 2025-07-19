import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native'; // For custom tab bar labels/icons
import { Feather } from '@expo/vector-icons'; // For icons, assuming Expo icons are available

// Import screens
import ChatScreen from '../screens/ChatScreen'; // Adjust path
import ContactsScreen from '../screens/ContactsScreen'; // Adjust path
import ProfileScreen from '../screens/ProfileScreen'; // Adjust path
import SettingsScreen from '../screens/SettingsScreen'; // Adjust path
import NewChatScreen from '../screens/NewChatScreen'; // Adjust path, used within ChatScreen or its stack

// Create a Bottom Tab Navigator
const Tab = createBottomTabNavigator();

/**
 * MainTabNavigator Component
 * Defines the tab-based navigation for authenticated users.
 * It includes tabs for Chat, Contacts, Profile, and Settings.
 *
 * Props:
 * - userId: The ID of the currently authenticated user.
 * - onSignOut: Function to call when the user signs out (passed to SettingsScreen).
 * - onStartChat: Function to handle starting a new chat (passed to ChatScreen or NewChatScreen).
 * (Note: onStartChat will be used to navigate to NewChatScreen from ChatScreen,
 * so it's passed down to the ChatScreen's stack if it were to have one, or directly to ChatScreen if it manages navigation to NewChatScreen internally).
 */
const MainTabNavigator = ({ userId, onSignOut, onStartChat }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide default header for all tab screens
        tabBarActiveTintColor: '#6200EE', // Primary color for active tab icon/label
        tabBarInactiveTintColor: '#bbb', // Grey for inactive tab icon/label
        tabBarStyle: styles.tabBar, // Custom style for the tab bar container
        tabBarLabelStyle: styles.tabBarLabel, // Custom style for tab labels
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Determine icon based on route name
          if (route.name === 'Chat') {
            iconName = 'message-circle';
          } else if (route.name === 'Contacts') {
            iconName = 'users';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          // Return the Feather icon component
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Chat Tab */}
      <Tab.Screen name="Chat">
        {props => <ChatScreen {...props} userId={userId} onStartChat={onStartChat} />}
      </Tab.Screen>

      {/* Contacts Tab */}
      <Tab.Screen name="Contacts">
        {props => <ContactsScreen {...props} userId={userId} onSelectContact={onStartChat} />}
      </Tab.Screen>

      {/* Profile Tab */}
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} userId={userId} />}
      </Tab.Screen>

      {/* Settings Tab */}
      <Tab.Screen name="Settings">
        {props => <SettingsScreen {...props} userId={userId} onSignOut={onSignOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1a2e', // Dark background for the tab bar
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e', // Separator line
    height: Platform.OS === 'ios' ? 90 : 60, // Adjust height for iOS safe area
    paddingBottom: Platform.OS === 'ios' ? 30 : 0, // Padding for iOS home indicator
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MainTabNavigator;
