import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

/**
 * EmojiPicker Component
 * A component for selecting and inserting emojis into the chat input.
 * This version provides a simplified grid of common emojis.
 *
 * Props:
 * - onEmojiSelect: (Function) Callback function to be called with the selected emoji string.
 * - onClose: (Function, optional) Callback function to close the picker.
 */
const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  // A simplified list of common emojis for demonstration purposes.
  // In a real application, you might use a dedicated emoji library
  // or fetch a more comprehensive list.
  const emojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😇', '😈',
    '😉', '😊', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '🌍', '🌎', '🌏', '🌟', '✨', '⚡', '🔥', '🌈', '☀️', '☁️',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '👍', '👎', '👌', '👏', '👋', '🙏', '💪', '🧠', '👀', '🗣️',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🍎', '🍌', '🍓', '🍕', '🍔', '🍟', '☕', '🍺', '🍷', '🎉',
  ];

  const renderEmojiItem = ({ item }) => (
    <TouchableOpacity
      style={styles.emojiItem}
      onPress={() => onEmojiSelect(item)}
    >
      <Text style={styles.emojiText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Emoji</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={emojis}
        renderItem={renderEmojiItem}
        keyExtractor={(item) => item}
        numColumns={8} // Display emojis in 8 columns
        contentContainerStyle={styles.emojiGrid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e', // Dark background matching chat input
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 10,
    maxHeight: 300, // Limit height to prevent it from taking up too much screen
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#bbb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emojiGrid: {
    padding: 10,
    justifyContent: 'center', // Center emojis if not filling full width
  },
  emojiItem: {
    flex: 1, // Allows items to take equal space in their column
    aspectRatio: 1, // Keep items square
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  emojiText: {
    fontSize: 28, // Large enough for easy tapping
  },
});

export default EmojiPicker;
