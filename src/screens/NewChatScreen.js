import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
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
import LoadingOverlay from '../components/LoadingOverlay'; // Adjust path (if needed for starting chat)

// Get Firebase instances (assuming they are initialized globally or accessible)
const app = typeof __firebase_config !== 'undefined' ? require('firebase/app').initializeApp(JSON.parse(__firebase_config)) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * NewChatScreen Component
 * A screen dedicated to selecting contacts or creating a new group chat
 * to start a fresh conversation.
 *
 * Props:
 * - userId: The ID of the currently authenticated user.
 * - onStartChat: Function to call when a chat is initiated.
 * Expected signature: (selectedUsers: Array<{id: string, displayName: string}>) => void
 * - onGoBack: Function to navigate back to the previous screen.
 */
const NewChatScreen = ({ userId, onStartChat, onGoBack }) => {
  const [allContacts, setAllContacts] = useState([]); // All users fetched from Firestore
  const [filteredContacts, setFilteredContacts] = useState([]); // Contacts after search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]); // For single or multi-selection
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Effect hook for Firestore real-time listener for users/contacts.
   * Fetches all users from a 'users' collection (excluding the current user).
   */
  useEffect(() => {
    if (!db || !auth || !userId) {
      console.warn('Firebase DB, Auth, or userId not available. Cannot fetch users for new chat.');
      setLoadingContacts(false);
      return;
    }

    const usersCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');

    const unsubscribeFirestore = onSnapshot(
      usersCollectionRef,
      (snapshot) => {
        const fetchedUsers = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            displayName: doc.data().displayName || doc.id, // Fallback to ID
            avatarUri: doc.data().avatarUri || null,
            // Add a dynamic color for avatar if not present
            avatarColor: doc.data().avatarColor || '#' + Math.floor(Math.random()*16777215).toString(16),
          }))
          .filter((user) => user.id !== userId); // Exclude the current user

        setAllContacts(fetchedUsers);
        setFilteredContacts(fetchedUsers); // Initially, all contacts are filtered
        setLoadingContacts(false);
        setError(null);
        console.log('Users for new chat updated:', fetchedUsers.length);
      },
      (e) => {
        console.error('Firestore Users for New Chat Error:', e);
        setError('Failed to load users. Please check your connection.');
        setLoadingContacts(false);
      }
    );

    return () => unsubscribeFirestore();
  }, [userId, db, auth, appId]);

  /**
   * Filters contacts based on search query.
   */
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(allContacts);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = allContacts.filter(
        (contact) =>
          contact.displayName.toLowerCase().includes(lowerCaseQuery) ||
          contact.id.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, allContacts]);

  /**
   * Handles selection/deselection of a contact.
   * For simplicity, this version supports single selection for 1-on-1 chats.
   * Extend this for multi-selection for group chats.
   */
  const handleContactSelect = (contact) => {
    // Toggle selection for single user chat (if already selected, deselect)
    if (selectedContacts.some(c => c.id === contact.id)) {
      setSelectedContacts([]); // Deselect all if this one was already selected
    } else {
      setSelectedContacts([contact]); // Select this contact for 1-on-1 chat
    }

    // For multi-selection (group chat):
    /*
    const isSelected = selectedContacts.some((c) => c.id === contact.id);
    if (isSelected) {
      setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
    */
  };

  /**
   * Initiates a new chat with the selected contacts.
   * Calls the onStartChat prop.
   */
  const handleStartChat = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('No Contact Selected', 'Please select at least one contact to start a chat.');
      return;
    }
    // In a real app, you'd navigate to a chat screen or create a new chat room.
    // For now, we call the passed prop.
    if (onStartChat) {
      onStartChat(selectedContacts);
    } else {
      Alert.alert('Chat Initiated', `Starting chat with: ${selectedContacts.map(c => c.displayName).join(', ')}`);
      if (onGoBack) onGoBack(); // Go back after "starting" chat
    }
  };

  /**
   * Renders each individual contact item in the FlatList.
   */
  const renderContact = ({ item }) => {
    const initials = item.displayName
      ? item.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
      : item.id.substring(0, 2).toUpperCase();
    const isSelected = selectedContacts.some(c => c.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedContactItem]}
        onPress={() => handleContactSelect(item)}
      >
        <UserAvatar
          uri={item.avatarUri}
          initials={initials}
          size={50}
          backgroundColor={item.avatarColor}
        />
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.displayName}</Text>
          <Text style={styles.contactId}>ID: {item.id}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Text style={styles.selectionIndicatorText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header Component */}
      <Header title="New Chat" userId={userId} />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Display error if any */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Contacts List */}
      {loadingContacts ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>No contacts found.</Text>
          <Text style={styles.emptyListSubText}>Try a different search or invite friends!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contactListContent}
        />
      )}

      {/* Start Chat Button */}
      <TouchableOpacity
        style={[styles.startButton, selectedContacts.length === 0 && styles.startButtonDisabled]}
        onPress={handleStartChat}
        disabled={selectedContacts.length === 0}
      >
        <Text style={styles.startButtonText}>
          {selectedContacts.length > 1 ? `Start Group Chat (${selectedContacts.length})` : 'Start Chat'}
        </Text>
      </TouchableOpacity>
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
  searchContainer: {
    padding: 10,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  searchInput: {
    backgroundColor: '#3a3a4e',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  contactListContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  selectedContactItem: {
    borderColor: '#6200EE', // Highlight selected item
    borderWidth: 2,
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1,
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
  selectionIndicator: {
    marginLeft: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  startButton: {
    backgroundColor: '#6200EE',
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#3a3a4e', // Faded color when disabled
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NewChatScreen;
