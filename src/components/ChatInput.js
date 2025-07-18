import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

/**
 * ChatInput Component
 * Provides the input field and send button for composing messages.
 *
 * Props:
 * - newMessage: The current value of the message input.
 * - setNewMessage: Function to update the message input value.
 * - handleSendMessage: Function to call when the send button is pressed.
 */
const ChatInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.inputContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed for Android
    >
      <TextInput
        style={styles.textInput}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message..."
        placeholderTextColor="#aaa"
        multiline // Allow multiple lines for longer messages
        onEndEditing={handleSendMessage} // Optional: send on enter key press (for single line)
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendMessage}
        disabled={newMessage.trim() === ''} // Disable send button if input is empty
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#1a1a2e', // Dark background for input area
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e', // Separator line
  },
  textInput: {
    flex: 1, // Takes up available space
    backgroundColor: '#3a3a4e', // Darker background for input field
    borderRadius: 20, // Rounded corners for the input field
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff', // White text color
    maxHeight: 100, // Limit the height of the input field for multiline
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#6200EE', // Primary color for the send button
    borderRadius: 20, // Rounded button
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff', // White text on the button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatInput;
