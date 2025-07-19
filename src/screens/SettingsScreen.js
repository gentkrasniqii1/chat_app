import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  Alert, // Using Alert for simple feedback, can be replaced by CustomModal
} from 'react-native';

// Import custom components
import Header from '../components/Header'; // Adjust path as per your folder structure
import CustomModal from '../components/CustomModal'; // Adjust path

/**
 * SettingsScreen Component
 * Provides various app settings, such as theme preferences, notification settings,
 * or account management options.
 *
 * Props:
 * - userId: The ID of the currently authenticated user (for display in header/account section).
 * - onSignOut: Function to call when the user initiates a sign-out action.
 */
const SettingsScreen = ({ userId, onSignOut }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Example: State for theme preference
  const [receiveNotifications, setReceiveNotifications] = useState(true); // Example: State for notifications
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false); // State for sign out confirmation modal

  // Placeholder for future theme context or global state management
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    // In a real app, this would update a global theme context
    Alert.alert('Theme Changed', `Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode (UI not fully implemented yet)`);
  };

  const toggleNotifications = () => {
    setReceiveNotifications((prev) => !prev);
    Alert.alert('Notifications', `Notifications are now ${receiveNotifications ? 'OFF' : 'ON'}`);
  };

  const handleChangePassword = () => {
    Alert.alert('Feature', 'Change Password functionality coming soon!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Feature', 'Account deletion logic here!') },
      ]
    );
  };

  const handleConfirmSignOut = () => {
    setShowSignOutConfirm(false);
    if (onSignOut) {
      onSignOut(); // Call the sign out function passed from App.js
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header Component */}
      <Header title="Settings" userId={userId} />

      <View style={styles.content}>
        {/* General Settings Section */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#6200EE' }}
            thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Receive Notifications</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#6200EE' }}
            thumbColor={receiveNotifications ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={receiveNotifications}
          />
        </View>

        {/* Account Settings Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItemButton} onPress={handleChangePassword}>
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItemButton} onPress={() => setShowSignOutConfirm(true)}>
          <Text style={styles.settingText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItemButton, styles.deleteAccountButton]} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
        </TouchableOpacity>

        {/* About Section (Optional) */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Version</Text>
          <Text style={styles.settingText}>1.0.0</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy Policy</Text>
          <TouchableOpacity onPress={() => Alert.alert('Info', 'Link to Privacy Policy')}>
            <Text style={styles.linkText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out Confirmation Modal */}
      <CustomModal
        visible={showSignOutConfirm}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out of your account?"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setShowSignOutConfirm(false)}
        confirmText="Sign Out"
        cancelText="Cancel"
        showCancelButton={true}
        showConfirmButton={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34', // Dark background
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: '#bbb', // Lighter grey for section titles
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
    paddingBottom: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e', // Darker background for each setting row
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
  },
  settingItemButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteAccountButton: {
    backgroundColor: '#ff6347', // Red background for delete button
  },
  deleteAccountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkText: {
    color: '#6200EE', // Primary color for links
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;
