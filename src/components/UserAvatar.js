import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

/**
 * UserAvatar Component
 * Displays a user's profile picture or a placeholder avatar with initials.
 *
 * Props:
 * - uri: (String, optional) The URI of the user's profile picture.
 * - initials: (String, optional) The initials of the user, displayed if no URI is provided.
 * - size: (Number, optional) The diameter of the avatar in pixels (defaults to 40).
 * - backgroundColor: (String, optional) Background color for the avatar when initials are shown (defaults to a light blue).
 * - textColor: (String, optional) Text color for the initials (defaults to white).
 */
const UserAvatar = ({
  uri,
  initials,
  size = 40,
  backgroundColor = '#007bff', // A default vibrant color
  textColor = '#fff',
}) => {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2, // Makes it a perfect circle
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensures image stays within bounds
  };

  const textStyle = {
    fontSize: size * 0.4, // Adjust font size based on avatar size
    fontWeight: 'bold',
    color: textColor,
  };

  if (uri) {
    return (
      <View style={avatarStyle}>
        <Image source={{ uri: uri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  // If no URI, display initials
  return (
    <View style={avatarStyle}>
      <Text style={textStyle}>{initials ? initials.toUpperCase() : '?'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

export default UserAvatar;
