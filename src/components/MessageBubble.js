import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * MessageBubble Component
 * Renders a single chat message bubble.
 * It styles messages differently based on whether the current user sent them.
 *
 * Props:
 * - text: The content of the message.
 * - senderId: The ID of the user who sent the message.
 * - timestamp: The timestamp of when the message was sent (Firestore Timestamp object).
 * - currentUserId: The ID of the currently authenticated user.
 */
const MessageBubble = ({ text, senderId, timestamp, currentUserId }) => {
  // Determine if the message was sent by the current user
  const isCurrentUser = senderId === currentUserId;

  // Format the timestamp for display
  const messageTime = timestamp
    ? new Date(timestamp.toDate()).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''; // Handle cases where timestamp might not be immediately available

  return (
    <View
      style={[
        styles.messageBubble,
        isCurrentUser ? styles.myMessageBubble : styles.otherMessageBubble,
      ]}
    >
      {/* Sender ID - displayed above the message text */}
      <Text
        style={[
          styles.senderIdText,
          isCurrentUser ? styles.mySenderIdText : styles.otherSenderIdText,
        ]}
      >
        {isCurrentUser ? 'You' : senderId} {/* Show 'You' for current user */}
      </Text>

      {/* Message Text */}
      <Text style={styles.messageText}>{text}</Text>

      {/* Timestamp */}
      <Text
        style={[
          styles.timestampText,
          isCurrentUser ? styles.myTimestampText : styles.otherTimestampText,
        ]}
      >
        {messageTime}
      </Text>
    </View>
  );
};

// StyleSheet for the MessageBubble component
const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%', // Limit bubble width to 80% of container
    padding: 10,
    borderRadius: 15,
    marginBottom: 8, // Space between messages
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  myMessageBubble: {
    alignSelf: 'flex-end', // Align to the right for current user
    backgroundColor: '#6200EE', // Primary color for my messages
    borderBottomRightRadius: 5, // A subtle "tail" effect on the bottom-right corner
  },
  otherMessageBubble: {
    alignSelf: 'flex-start', // Align to the left for other users
    backgroundColor: '#3a3a4e', // Neutral color for other messages
    borderBottomLeftRadius: 5, // A subtle "tail" effect on the bottom-left corner
  },
  senderIdText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mySenderIdText: {
    color: 'rgba(255,255,255,0.7)', // Lighter color for contrast on dark bubble
    textAlign: 'right', // Align sender ID to the right for current user
  },
  otherSenderIdText: {
    color: 'rgba(255,255,255,0.5)', // Slightly faded for other users
    textAlign: 'left', // Align sender ID to the left for other users
  },
  messageText: {
    fontSize: 16,
    color: '#fff', // White text for message content
  },
  timestampText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)', // Faded timestamp
    marginTop: 5,
  },
  myTimestampText: {
    textAlign: 'right', // Align timestamp to the right for current user
  },
  otherTimestampText: {
    textAlign: 'left', // Align timestamp to the left for other users
  },
});

export default MessageBubble;
