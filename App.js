import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';


// In App.js or ChatScreen.js
import ChatInput from './src/components/ChatInput'; // Adjust path as needed

// ... inside your component's return statement ...
<ChatInput
  newMessage={newMessage}
  setNewMessage={setNewMessage}
  handleSendMessage={handleSendMessage}
/>

// In App.js
import LoadingOverlay from './src/components/LoadingOverlay'; // Adjust path as needed

// ... inside your App component ...
const [isSending, setIsSending] = useState(false); // New state for sending message

const handleSendMessage = async () => {
  if (newMessage.trim() === '' || !userId) {
    return;
  }
  setIsSending(true); // Set loading to true when sending starts
  try {
    // ... your addDoc logic ...
    await addDoc(messagesCollectionRef, {
      senderId: userId,
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
    });
    setNewMessage('');
    console.log('Message sent successfully!');
  } catch (e) {
    console.error('Error sending message:', e);
    setError('Failed to send message. Please try again.');
  } finally {
    setIsSending(false); // Set loading to false when sending completes (success or error)
  }
};

// ... inside your return statement, typically at the end of the main View ...
return (
  <SafeAreaView style={styles.container}>
    {/* ... existing header, flatlist, chat input ... */}

    {/* Render the LoadingOverlay */}
    <LoadingOverlay visible={isSending} message="Sending message..." />
    <LoadingOverlay visible={loading} message="Initializing Chat..." /> {/* Reuse for initial load */}
  </SafeAreaView>
);

// In App.js or ChatScreen.js
import CustomModal from './src/components/CustomModal'; // Adjust path as needed

// ... inside your component ...
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [messageToSend, setMessageToSend] = useState(''); // Store message temporarily for confirmation

const handlePreSendMessage = () => {
  if (newMessage.trim() === '') {
    // Maybe show a different alert for empty message
    return;
  }
  setMessageToSend(newMessage.trim()); // Store message before showing modal
  setShowConfirmModal(true); // Show the confirmation modal
};

const handleConfirmSend = () => {
  // Logic to actually send the message (e.g., call handleSendMessage)
  console.log('Confirmed send:', messageToSend);
  // Assuming handleSendMessage uses newMessage state, you might need to adjust
  // or pass messageToSend directly to a new send function.
  // For simplicity, let's assume handleSendMessage uses the current newMessage state
  // and we just close the modal.
  handleSendMessage(); // Call the actual send function
  setShowConfirmModal(false); // Hide the modal
  setMessageToSend(''); // Clear temporary message
};

const handleCancelSend = () => {
  setShowConfirmModal(false); // Hide the modal
  setMessageToSend(''); // Clear temporary message
};

// ... in your return statement, typically at the end of the main View ...
return (
  <SafeAreaView style={styles.container}>
    {/* ... existing header, flatlist, chat input ... */}

    <CustomModal
      visible={showConfirmModal}
      title="Confirm Message"
      message={`Are you sure you want to send this message?\n\n"${messageToSend}"`}
      onConfirm={handleConfirmSend}
      onCancel={handleCancelSend}
      confirmText="Send"
      cancelText="Cancel"
    />

    {/* You might trigger handlePreSendMessage instead of handleSendMessage from ChatInput */}
    {/* For example, by changing onPress on the send button to handlePreSendMessage */}
    {/* <ChatInput
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handlePreSendMessage} // Changed to pre-send handler
    /> */}
  </SafeAreaView>
);

// In ChatInput.js (or its parent, like ChatScreen.js)
import AttachmentPreview from './AttachmentPreview'; // Adjust path as needed
// import * as ImagePicker from 'expo-image-picker'; // Example for media selection

// ... inside your component ...
const [selectedAttachment, setSelectedAttachment] = useState(null); // { uri: string, type: 'image' | 'video' }

const pickImage = async () => {
  // Request media library permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and videos
    allowsEditing: true, // Optional
    aspect: [4, 3], // Optional
    quality: 1, // Optional
  });

  if (!result.canceled) {
    setSelectedAttachment({
      uri: result.assets[0].uri,
      type: result.assets[0].type,
    });
  }
};

const handleRemoveAttachment = () => {
  setSelectedAttachment(null); // Clear the selected attachment
};

// ... in your return statement, typically above the TextInput ...
return (
  <KeyboardAvoidingView
    // ... existing KeyboardAvoidingView props ...
  >
    {selectedAttachment && (
      <AttachmentPreview
        uri={selectedAttachment.uri}
        type={selectedAttachment.type}
        onRemove={handleRemoveAttachment}
      />
    )}

    <View style={styles.inputRow}> {/* You might need a new style for input row */}
      {/* Optional: Add a button to trigger image picker */}
      <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
        <Feather name="paperclip" size={24} color="#bbb" />
      </TouchableOpacity>

      <TextInput
        // ... existing TextInput props ...
      />
      <TouchableOpacity
        // ... existing Send button props ...
      >
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);
// Global variables provided by the Canvas environment
// These are mandatory and will be available at runtime.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(
  typeof __firebase_config !== 'undefined'
    ? __firebase_config
    : '{}'
);
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Main App Component
export default function App() {
  const [userId, setUserId] = useState(null); // Stores the authenticated user's ID
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [newMessage, setNewMessage] = useState(''); // Stores the current message being typed
  const [loading, setLoading] = useState(true); // Loading state for initial setup
  const [error, setError] = useState(null); // Error state for Firebase operations

  // Ref to scroll FlatList to the bottom
  const flatListRef = useRef(null);

  /**
   * Effect hook for Firebase Authentication.
   * This runs once on component mount to initialize Firebase Auth and
   * listen for auth state changes.
   */
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Sign in with custom token if available, otherwise anonymously
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }

        // Listen for authentication state changes
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid); // Set the user ID once authenticated
            setLoading(false); // Auth is ready, stop loading
            console.log('User authenticated:', user.uid);
          } else {
            setUserId(null);
            setLoading(false);
            console.log('No user authenticated.');
          }
        });

        // Cleanup auth listener on component unmount
        return () => unsubscribeAuth();
      } catch (e) {
        console.error('Firebase Auth Error:', e);
        setError('Failed to authenticate. Please try again.');
        setLoading(false);
      }
    };

    setupAuth();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Effect hook for Firestore real-time message listener.
   * This runs when the userId becomes available to fetch messages.
   */
  useEffect(() => {
    // Only set up the Firestore listener if userId is available and not in loading state
    if (userId) {
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
          console.log('Messages updated:', fetchedMessages.length);
          // Scroll to bottom when messages are updated
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        },
        (e) => {
          console.error('Firestore Error:', e);
          setError('Failed to fetch messages. Please check your connection.');
        }
      );

      // Cleanup Firestore listener on component unmount or userId change
      return () => unsubscribeFirestore();
    }
  }, [userId]); // Re-run when userId changes

  /**
   * Handles sending a new message to Firestore.
   */
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !userId) {
      // Don't send empty messages or if user is not authenticated
      return;
    }

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
      setError('Failed to send message. Please try again.');
    }
  };

  /**
   * Renders each individual message item in the FlatList.
   * @param {object} item - The message object.
   * @returns {JSX.Element} The rendered message component.
   */
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === userId;
    const messageTime = item.timestamp
      ? new Date(item.timestamp.toDate()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.senderIdText,
            isCurrentUser ? styles.mySenderIdText : styles.otherSenderIdText,
          ]}
        >
          {isCurrentUser ? 'You' : item.senderId}
        </Text>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text
          style={[
            styles.timestampText,
            isCurrentUser
              ? styles.myTimestampText
              : styles.otherTimestampText,
          ]}
        >
          {messageTime}
        </Text>
      </View>
    );
  };

  // Display loading indicator while Firebase is setting up
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Initializing Chat...</Text>
      </SafeAreaView>
    );
  }

  // Display error message if something went wrong
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubText}>Please restart the app or check your internet connection.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatApp</Text>
        {userId && (
          <Text style={styles.userIdText}>Your ID: {userId}</Text>
        )}
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      {/* Message Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
      >
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// StyleSheet for the components
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6347', // Tomato red for errors
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorSubText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  header: {
    padding: 15,
    backgroundColor: '#1a1a2e', // Darker header
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userIdText: {
    color: '#bbb',
    fontSize: 12,
  },
  messageListContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6200EE', // Primary color for my messages
    borderBottomRightRadius: 5, // Pointed corner for sender
  },
  otherMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#3a3a4e', // Neutral color for other messages
    borderBottomLeftRadius: 5, // Pointed corner for receiver
  },
  senderIdText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mySenderIdText: {
    color: 'rgba(255,255,255,0.7)', // Lighter for contrast on dark bubble
    textAlign: 'right',
  },
  otherSenderIdText: {
    color: 'rgba(255,255,255,0.5)', // Slightly faded for others
    textAlign: 'left',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  timestampText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 5,
  },
  myTimestampText: {
    textAlign: 'right',
  },
  otherTimestampText: {
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#1a1a2e', // Dark background for input
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#3a3a4e',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
    maxHeight: 100, // Prevent text input from growing too large
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#6200EE',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
