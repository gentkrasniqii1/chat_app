import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert, // Using Alert for simple feedback, could be replaced by CustomModal
} from 'react-native';

// Firebase Imports (assuming Firebase app is already initialized)
import {
  getFirestore,
  doc,
  getDoc,
  setDoc, // Use setDoc to create/overwrite, or updateDoc to just update fields
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import custom components
import Header from '../components/Header'; // Adjust path as per your folder structure
import UserAvatar from '../components/UserAvatar'; // Adjust path
import LoadingOverlay from '../components/LoadingOverlay'; // Adjust path

// Get Firebase instances (assuming they are initialized globally or accessible)
const app = typeof __firebase_config !== 'undefined' ? require('firebase/app').initializeApp(JSON.parse(__firebase_config)) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * ProfileScreen Component
 * Allows users to view and edit their profile information, such as display name and avatar.
 * It interacts with Firestore to fetch and update user-specific data.
 *
 * Props:
 * - userId: The ID of the currently authenticated user.
 * - onSignOut: (Optional) Function to call when the user wants to sign out (e.g., from a settings menu).
 */
const ProfileScreen = ({ userId, onSignOut }) => {
  const [displayName, setDisplayName] = useState('');
  const [avatarUri, setAvatarUri] = useState(null); // URI for the user's profile picture
  const [loadingProfile, setLoadingProfile] = useState(true); // Loading state for fetching profile
  const [savingProfile, setSavingProfile] = useState(false); // Loading state for saving profile
  const [error, setError] = useState(null); // Error state for profile operations

  /**
   * Effect hook to fetch user profile data from Firestore when the component mounts
   * or when the userId changes.
   */
  useEffect(() => {
    // Ensure Firebase instances and userId are available
    if (!db || !auth || !userId) {
      console.warn('Firebase DB, Auth, or userId not available. Cannot fetch profile.');
      setLoadingProfile(false);
      return;
    }

    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setDisplayName(userData.displayName || '');
          setAvatarUri(userData.avatarUri || null);
          console.log('User profile fetched:', userData);
        } else {
          // If user document doesn't exist, initialize with default display name (their ID)
          setDisplayName(userId);
          setAvatarUri(null);
          console.log('User profile not found, initializing with userId as display name.');
        }
      } catch (e) {
        console.error('Error fetching user profile:', e);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [userId, db, auth, appId]); // Re-run when userId or Firebase instances change

  /**
   * Handles saving the updated profile information to Firestore.
   */
  const handleSaveProfile = async () => {
    if (!userId || !db) {
      setError('User not authenticated or database not available.');
      return;
    }
    if (displayName.trim() === '') {
      setError('Display name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', userId);
      // Use setDoc with merge: true to update existing fields or create the document if it doesn't exist
      await setDoc(
        userDocRef,
        {
          displayName: displayName.trim(),
          avatarUri: avatarUri, // Save the current avatar URI
        },
        { merge: true }
      );
      console.log('Profile saved successfully!');
      Alert.alert('Success', 'Profile updated successfully!'); // Simple alert for feedback
    } catch (e) {
      console.error('Error saving profile:', e);
      setError('Failed to save profile. Please try again.');
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Function to generate initials for UserAvatar
  const getInitials = (name) => {
    if (!name) return userId ? userId.substring(0, 2).toUpperCase() : '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header Component */}
      <Header title="Profile" userId={userId} />

      {/* Loading state for fetching profile */}
      {loadingProfile ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <View style={styles.profileContent}>
          {/* User Avatar */}
          <View style={styles.avatarContainer}>
            <UserAvatar
              uri={avatarUri}
              initials={getInitials(displayName)}
              size={100} // Larger avatar for profile screen
              backgroundColor="#6200EE" // Consistent primary color for avatar background
            />
            {/* Placeholder for avatar change button */}
            <TouchableOpacity style={styles.changeAvatarButton} onPress={() => Alert.alert('Feature', 'Avatar change functionality coming soon!')}>
              <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
            </TouchableOpacity>
          </View>

          {/* Display Name Input */}
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your display name"
            placeholderTextColor="#aaa"
            value={displayName}
            onChangeText={setDisplayName}
            editable={!savingProfile} // Disable input while saving
          />

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Save Profile Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={savingProfile || displayName.trim() === ''} // Disable if saving or display name is empty
          >
            {savingProfile ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Profile</Text>
            )}
          </TouchableOpacity>

          {/* Optional: Sign Out Button */}
          {onSignOut && (
            <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Loading Overlay for saving profile */}
      <LoadingOverlay visible={savingProfile} message="Saving profile..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34', // Dark background
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  profileContent: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  changeAvatarButton: {
    marginTop: 15,
    backgroundColor: '#3a3a4e',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  changeAvatarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#bbb',
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#3a3a4e',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6347',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: '#ff6347', // Red color for sign out
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
