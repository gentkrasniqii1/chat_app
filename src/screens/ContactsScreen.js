import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Firebase Imports (assuming Firebase app is already initialized)
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import custom components
import Header from '../components/Header'; // Adjust path as per your folder structure
import UserAvatar from '../components/UserAvatar'; // Adjust path

// Get Firebase instances (assuming they are initialized globally or accessible)
const app = typeof __firebase_config !== 'undefined' ? require('firebase/app').initializeApp(JSON.parse(__firebase_config)) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * ContactsScreen Component
 * Displays a list of other chat participants (users) in the application.
 * Users can potentially initiate new conversations by tapping on a contact.
 *
 * Props:
 * - userId: The ID of the currently authenticated user.
 * - onSelectContact: (Optional) Function to call when a contact is selected,
 * e.g., to navigate to a chat screen with that user.
 */
const ContactsScreen = ({ userId, onSelectContact }) => {
  const [contacts, setContacts] = useState([]); // Stores list of other users/contacts
  const [loading, setLoading] = useState(true); // Loading state for fetching contacts
  const [error, setError] = useState(null); // Error state for fetching contacts

  /**
   * Effect hook for Firestore real-time listener for users/contacts.
   * Fetches all users from a 'users' collection (excluding the current user).
   * In a real app, you might have a dedicated 'users' collection storing user profiles.
   */
  useEffect(() => {
    // Ensure Firebase instances are available before proceeding
    if (!db || !auth || !userId) {
      console.warn('Firebase DB, Auth, or userId not available. Cannot fetch contacts.');
      setLoading(false);
      return;
    }

    // Assuming a 'users' collection exists where each document's ID is the userId
    // For simplicity, we'll just list all authenticated users' UIDs as contacts.
    // In a real app, you'd store display names, avatars, etc., in a 'users' collection.
    const usersCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');

    // Set up real-time listener for users
    const unsubscribeFirestore = onSnapshot(
      usersCollectionRef, // Query all users
      (snapshot) => {
        const fetchedUsers = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Assuming 'name' or 'displayName' field exists, otherwise use ID
            displayName: doc.data().displayName || doc.id,
            avatarUri: doc.data().avatarUri || null,
          }))
          .filter((user) => user.id !== userId); // Exclude the current user from the list

        setContacts(fetchedUsers);
        setLoading(false);
        setError(null); // Clear any previous errors
        console.log('Contacts updated:', fetchedUsers.length);
      },
      (e) => {
        console.error('Firestore Contacts Error:', e);
        setError('Failed to fetch contacts. Please check your connection.');
        setLoading(false);
      }
    );

    // Cleanup Firestore listener on component unmount or userId change
    return () => unsubscribeFirestore();
  }, [userId, db, auth, appId]); // Re-run when userId or Firebase instances change

  /**
   * Renders each individual contact item in the FlatList.
   * @param {object} item - The contact (user) object.
   * @returns {JSX.Element} The rendered contact component.
   */
  const renderContact = ({ item }) => {
    // Extract initials for UserAvatar
    const initials = item.displayName
      ? item.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
      : item.id.substring(0, 2).toUpperCase(); // Fallback to first 2 chars of ID

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => onSelectContact && onSelectContact(item)}
      >
        <UserAvatar
          uri={item.avatarUri}
          initials={initials}
          size={50} // Larger avatar for contact list
          backgroundColor={item.avatarColor || '#007bff'} // Use a dynamic color if available
        />
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.displayName}</Text>
          {/* You could add last seen, status, etc. here */}
          <Text style={styles.contactId}>ID: {item.id}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header Component */}
      <Header title="Contacts" userId={userId} />

      {/* Display error if any */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Contacts List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>No other users found.</Text>
          <Text style={styles.emptyListSubText}>Invite friends to chat!</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contactListContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34', // Dark background
  },
  loadingContainer: {
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
  errorBanner: {
    backgroundColor: '#ff6347', // Tomato red for errors
    padding: 10,
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactListContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e', // Darker background for each contact row
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1, // Allows contact info to take remaining space
  },
  contactName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactId: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 2,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    color: '#bbb',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyListSubText: {
    color: '#8c8c8c',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ContactsScreen;
