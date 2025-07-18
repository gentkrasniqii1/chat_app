import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * LoadingOverlay Component
 * Displays a full-screen overlay with a loading indicator and a message.
 * This is useful for showing progress during asynchronous operations,
 * enhancing user experience by providing feedback.
 *
 * Props:
 * - message: The text message to display below the loading indicator (e.g., "Loading...", "Sending message...").
 * - visible: A boolean to control the visibility of the overlay.
 */
const LoadingOverlay = ({ message = 'Loading...', visible = false }) => {
  if (!visible) {
    return null; // Don't render anything if not visible
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Position absolutely to cover the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's on top of other content
  },
  container: {
    backgroundColor: '#3a3a4e', // Darker background for the loading box
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 150, // Minimum width for the loading box
  },
  messageText: {
    marginTop: 10,
    color: '#fff', // White text
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
