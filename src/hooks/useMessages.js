// useMessages.js
// Purpose: A custom hook that encapsulates the logic for fetching and sending messages for a specific chat.
// Contribution: Centralized message logic, simplifying ChatScreen and improving maintainability.

import { useState, useEffect, useRef } from 'react';
import {
  sendMessage as sendChatMessage, // Rename to avoid conflict with hook's own sendMessage
  getMessagesRealtime,
  // deleteMessage, // Include if you plan to add message deletion
} from '../services/chatService'; // Adjust path to your chatService.js

/**
 * useMessages Custom Hook
 * Provides real-time chat message data and functions to send messages.
 * It manages message state, loading indicators, and errors related to chat operations.
 *
 * @param {string} currentUserId - The ID of the currently authenticated user.
 * @returns {object} An object containing:
 * - messages: An array of chat message objects.
 * - newMessage: The current text in the message input.
 * - setNewMessage: Function to update the newMessage state.
 * - loadingMessages: Boolean indicating if initial messages are being loaded.
 * - sendingMessage: Boolean indicating if a message is currently being sent.
 * - error: Any error message from chat operations (string | null).
 * - handleSendMessage: Function to send a new message.
 * - flatListRef: A ref to be attached to a FlatList for auto-scrolling.
 */
const useMessages = (currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  const flatListRef = useRef(null); // Ref for FlatList auto-scrolling

  /**
   * Effect hook to set up a real-time listener for chat messages.
   * This runs when currentUserId becomes available.
   */
  useEffect(() => {
    if (!currentUserId) {
      // If no user is authenticated, we cannot fetch messages.
      setLoadingMessages(false);
      return;
    }

    setLoadingMessages(true); // Start loading when listener is set up
    setError(null); // Clear previous errors

    // Subscribe to real-time message updates using the chat service function
    const unsubscribe = getMessagesRealtime((fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoadingMessages(false); // Messages loaded
      setError(null); // Clear any previous errors
      console.log('Messages updated via useMessages hook:', fetchedMessages.length);
      // Scroll to bottom when messages are updated, if ref is available
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });

    // Cleanup function to unsubscribe from the Firestore listener
    return () => unsubscribe();
  }, [currentUserId]); // Re-run effect if currentUserId changes

  /**
   * Handles sending a new message.
   * Calls the chatService's sendMessage function.
   */
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUserId) {
      // Prevent sending empty messages or if user is not authenticated
      return;
    }

    setSendingMessage(true); // Indicate that a message is being sent
    setError(null); // Clear previous errors

    try {
      await sendChatMessage(currentUserId, newMessage); // Use the renamed service function
      setNewMessage(''); // Clear the input field on successful send
      console.log('Message sent successfully via useMessages hook!');
    } catch (e) {
      console.error('Error sending message via useMessages hook:', e);
      setError(e.message || 'Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false); // Stop sending indicator
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    loadingMessages,
    sendingMessage,
    error,
    handleSendMessage,
    flatListRef, // Expose the ref for the component to attach to FlatList
  };
};

export default useMessages;
