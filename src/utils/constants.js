// constants.js
// Purpose: Stores app-wide constants like Firebase collection names, theme colors, API endpoints, etc.
// Contribution: Maintainability, consistency, and easy modification of global values.

/**
 * @file This file contains application-wide constants.
 * Using constants centralizes configuration, improves readability,
 * and makes it easier to manage values that might change across environments or features.
 */

// --- Firebase Collection Names ---
// These constants define the names of your Firestore collections.
// Using constants prevents typos and ensures consistency when interacting with the database.
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',      // Collection for user profiles
  MESSAGES: 'messages',  // Collection for chat messages (e.g., in a public chat)
  CHATS: 'chats',      // Collection for individual/group chat rooms (for private/group chats)
  // Add more collections as your app grows (e.g., 'groups', 'notifications')
};

// --- Theme Colors ---
// These constants define the color palette used throughout your application.
// Centralizing colors ensures a consistent look and makes it easy to switch themes.
export const COLORS = {
  PRIMARY: '#6200EE',       // A vibrant purple, used for primary actions, active states
  ACCENT: '#03DAC6',        // A teal accent color (can be used for highlights)
  BACKGROUND_DARK: '#282c34', // Main dark background color
  BACKGROUND_LIGHT: '#1a1a2e', // Slightly lighter dark background for elements like headers, cards
  SURFACE_DARK: '#3a3a4e',  // Dark surface color for inputs, bubbles, etc.
  TEXT_PRIMARY: '#fff',     // White text for main content
  TEXT_SECONDARY: '#bbb',   // Lighter grey for secondary text, placeholders
  TEXT_MUTED: '#8c8c8c',    // Muted grey for less prominent text
  ERROR: '#ff6347',         // Tomato red for error messages
  SUCCESS: '#4CAF50',       // Green for success messages
  WARNING: '#FFC107',       // Amber for warnings
};

// --- App-wide Numerical Constants ---
// Useful for defining sizes, durations, limits, etc.
export const APP_CONSTANTS = {
  MESSAGE_CHAR_LIMIT: 500,  // Max characters allowed in a single message
  AVATAR_DEFAULT_SIZE: 40,  // Default size for user avatars
  SPLASH_SCREEN_DURATION: 2000, // Duration in ms for splash screen
  // Add other numerical constants as needed
};

// --- Other Global Settings (Examples) ---
export const APP_SETTINGS = {
  DEFAULT_THEME: 'dark', // Default theme for the app
  ENABLE_NOTIFICATIONS_BY_DEFAULT: true, // Whether notifications are on by default
  // Add other boolean or string settings
};

// You can also define API endpoints if you have a separate backend API
/*
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.yourchatapp.com',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  // ...
};
*/
