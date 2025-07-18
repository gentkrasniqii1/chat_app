import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Assuming Expo icons are available, or use a custom SVG/icon font

/**
 * AttachmentPreview Component
 * Shows a preview of an image or video before it's sent in the chat input.
 * Provides a close button to remove the attachment.
 *
 * Props:
 * - uri: (String) The URI of the image or video file to preview.
 * - type: (String, optional) The type of attachment ('image' or 'video'). Defaults to 'image'.
 * - onRemove: (Function) Callback function to be called when the remove button is pressed.
 */
const AttachmentPreview = ({ uri, type = 'image', onRemove }) => {
  // Determine if the attachment is an image or video for specific rendering
  const isImage = type === 'image';
  // For video, you would typically use a <Video> component and potentially display a thumbnail.
  // For simplicity in this initial version, we'll show a placeholder for video.

  if (!uri) {
    return null; // Don't render if no URI is provided
  }

  return (
    <View style={styles.container}>
      <View style={styles.previewBox}>
        {isImage ? (
          <Image source={{ uri: uri }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          // Placeholder for video preview. In a real app, you'd use a <Video> component
          // from 'expo-av' or similar, and display a thumbnail.
          <View style={styles.videoPlaceholder}>
            <Feather name="video" size={40} color="#bbb" />
            <Text style={styles.videoPlaceholderText}>Video Preview</Text>
          </View>
        )}

        {/* Remove Button */}
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          {/* Using Feather icon for a close (x) symbol */}
          <Feather name="x-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // This container wraps the preview box, allowing for spacing if needed
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#1a1a2e', // Matches chat input background
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e',
  },
  previewBox: {
    width: 100, // Fixed width for the preview thumbnail
    height: 100, // Fixed height for the preview thumbnail
    borderRadius: 10,
    overflow: 'hidden', // Ensures content stays within rounded corners
    backgroundColor: '#3a3a4e', // Background for placeholder/loading
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // For positioning the remove button
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent dark background
    borderRadius: 15, // Make it circular
    padding: 2,
    zIndex: 1, // Ensure button is on top of the image/video
  },
});

export default AttachmentPreview;
