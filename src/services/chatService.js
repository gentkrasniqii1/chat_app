// chatService.js
// Purpose: Manages all Firestore operations specific to chat messages (e.g., sendMessage, getMessagesRealtime, deleteMessage).
// Contribution: Real-time functionality, data integrity, and organized data access.

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc, // For deleting messages
  doc,       // For referencing specific documents
} from 'firebase/firestore';

// Import the 'db' and 'appId' instances from your centralized Firebase configuration.
import { db, appId } from './firebase'; // Adjust path as per your folder structure

// Define the base collection reference for messages.
// This path corresponds to where public chat messages are stored in Firestore.
const messagesCollectionRef = collection(
  db,
  'artifacts',
  appId,
  'public',
  'data',
  'messages'
);

/**
 * Sends a new message to the Firestore database.
 * @param {string} senderId - The ID of the user sending the message.
 * @param {string} text - The content of the message.
 * @returns {Promise<DocumentReference>} A promise that resolves with the DocumentReference of the new message.
 * @throws {FirebaseError} If the message fails to send.
 */
const sendMessage = async (senderId, text) => {
  if (!senderId || text.trim() === '') {
    throw new Error('Sender ID and non-empty text are required to send a message.');
  }
  try {
    const docRef = await addDoc(messagesCollectionRef, {
      senderId: senderId,
      text: text.trim(),
      timestamp: serverTimestamp(), // Use server timestamp for consistency across clients
    });
    console.log('Message sent successfully with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error sending message:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Sets up a real-time listener for chat messages.
 * Messages are ordered by their timestamp.
 * @param {function(Array<object>): void} callback - A callback function that receives the updated list of messages.
 * @returns {function(): void} An unsubscribe function to detach the listener.
 */
const getMessagesRealtime = (callback) => {
  // Create a query to order messages by timestamp in ascending order.
  const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

  // Set up the real-time listener using onSnapshot.
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID
        ...doc.data(), // Spread all other document data
      }));
      callback(fetchedMessages); // Invoke the callback with the updated messages
    },
    (error) => {
      console.error('Error fetching real-time messages:', error.code, error.message);
      // You might want to pass this error to the UI as well
    }
  );

  return unsubscribe; // Return the unsubscribe function
};

/**
 * Deletes a specific message from the Firestore database.
 * Note: Implement proper security rules in Firebase to ensure only authorized users can delete messages.
 * @param {string} messageId - The ID of the message document to delete.
 * @returns {Promise<void>} A promise that resolves when the message is deleted.
 * @throws {FirebaseError} If deletion fails.
 */
const deleteMessage = async (messageId) => {
  if (!messageId) {
    throw new Error('Message ID is required to delete a message.');
  }
  try {
    const messageDocRef = doc(messagesCollectionRef, messageId);
    await deleteDoc(messageDocRef);
    console.log('Message deleted successfully:', messageId);
  } catch (error) {
    console.error('Error deleting message:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

// Export all chat-related functions for use in other parts of the application.
export {
  sendMessage,
  getMessagesRealtime,
  deleteMessage,
};
