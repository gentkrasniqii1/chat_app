import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

/**
 * Header Component
 * Provides a consistent header for the chat application screens.
 * Displays the app title and the current user's ID.
 *
 * Props:
 * - title: The title to display in the header (e.g., "ChatApp").
 * - userId: The ID of the currently authenticated user to display.
 */
const Header = ({ title, userId }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        {userId && (
          <Text style={styles.userIdText}>Your ID: {userId}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1a1a2e', // Background color for the safe area
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#1a1a2e', // Darker header background
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e', // Separator line at the bottom
  },
  headerTitle: {
    color: '#fff', // White text for the title
    fontSize: 22,
    fontWeight: 'bold',
  },
  userIdText: {
    color: '#bbb', // Slightly faded color for the user ID
    fontSize: 12,
  },
});

export default Header;
