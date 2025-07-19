import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Firebase Imports (assuming Firebase app is already initialized in App.js or a service)
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Needed to get the auth instance for current user's UID

// Import custom components
import Header from '../components/Header'; // Adjust path as per your folder structure
import MessageBubble from '../components/MessageBubble'; // Adjust path
import ChatInput from '../components/ChatInput'; // Adjust path
import LoadingOverlay from '../components/LoadingOverlay'; // Adjust path

// Get Firebase instances (assuming they are initialized globally or accessible)
// In a more complex app, these would typically be passed via context or a service.
const app = typeof __firebase_config !== 'undefined' ? require('firebase/app').initializeApp(JSON.parse(__firebase_config)) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


/**
 * ChatScreen Component
 * This is the main chat interface where messages are displayed and sent.
 * It encapsulates the real-time messaging logic using Firebase Firestore.
 *
 * Props:
 * - userId: The ID of the currently authenticated user.
 * - onSignOut: (Optional) Function to call when the user wants to sign out.
 * (Not implemented in this version, but kept for future expansion).
 */
const ChatScreen = ({ userId }) => {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [newMessage, setNewMessage] = useState(''); // Stores the current message being typed
  const [loadingMessages, setLoadingMessages] = useState(true); // Loading state for initial message fetch
  const [sendingMessage, setSendingMessage] = useState(false); // Loading state for sending message
  const [chatError, setChatError] = useState(null); // Error state for chat operations

  // Ref to scroll FlatList to the bottom
  const flatListRef = useRef(null);

  /**
   * Effect hook for Firestore real-time message listener.
   * This runs when the userId becomes available to fetch messages.
   */
  useEffect(() => {
    // Ensure Firebase instances are available before proceeding
    if (!db || !auth || !userId) {
      console.warn('Firebase DB, Auth, or userId not available. Cannot fetch messages.');
      setLoadingMessages(false);
      return;
    }

    const messagesCollectionRef = collection(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'messages'
    );
    // Create a query to order messages by timestamp
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

    // Set up real-time listener for messages
    const unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        setLoadingMessages(false); // Messages loaded
        setChatError(null); // Clear any previous errors
        console.log('Messages updated:', fetchedMessages.length);
        // Scroll to bottom when messages are updated
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      },
      (e) => {
        console.error('Firestore Error:', e);
        setChatError('Failed to fetch messages. Please check your connection.');
        setLoadingMessages(false);
      }
    );

    // Cleanup Firestore listener on component unmount or userId change
    return () => unsubscribeFirestore();
  }, [userId, db, auth, appId]); // Re-run when userId or Firebase instances change

  /**
   * Handles sending a new message to Firestore.
   */
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !userId) {
      // Don't send empty messages or if user is not authenticated
      return;
    }

    setSendingMessage(true); // Start sending indicator
    setChatError(null); // Clear previous errors

    try {
      const messagesCollectionRef = collection(
        db,
        'artifacts',
        appId,
        'public',
        'data',
        'messages'
      );
      await addDoc(messagesCollectionRef, {
        senderId: userId,
        text: newMessage.trim(),
        timestamp: serverTimestamp(), // Use server timestamp for consistency
      });
      setNewMessage(''); // Clear input field after sending
      console.log('Message sent successfully!');
    } catch (e) {
      console.error('Error sending message:', e);
      setChatError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false); // Stop sending indicator
    }
  };

  /**
   * Renders each individual message item in the FlatList.
   * @param {object} item - The message object.
   * @returns {JSX.Element} The rendered message component.
   */
  const renderMessage = ({ item }) => {
    return (
      <MessageBubble
        text={item.text}
        senderId={item.senderId}
        timestamp={item.timestamp}
        currentUserId={userId}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header Component */}
      <Header title="ChatApp" userId={userId} />

      {/* Display chat error if any */}
      {chatError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{chatError}</Text>
        </View>
      )}

      {/* Message List */}
      {loadingMessages ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageListContent}
          // Ensure auto-scroll to bottom on content changes
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
      )}

      {/* Chat Input Component */}
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />

      {/* Loading Overlay for sending messages */}
      <LoadingOverlay visible={sendingMessage} message="Sending message..." />
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
  messageListContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexGrow: 1, // Allows content to grow and enable scrolling
  },
});

export default ChatScreen;
