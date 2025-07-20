// ThemeContext.js
// Purpose: Provides global access to theme preferences (e.g., light/dark mode) and functions to toggle them.
// Contribution: Consistent styling, user customization, and professional UI.

import React, { createContext, useContext, useState, useEffect } from 'react';
// You might import constants for default theme or colors if defined there
// import { APP_SETTINGS, COLORS } from '../utils/constants'; // Adjust path

// Create the Theme Context
// This context will hold the current theme state and a function to toggle it.
const ThemeContext = createContext(null);

/**
 * ThemeProvider Component
 * This component wraps your application (or parts of it) and provides
 * the current theme preference and a function to toggle it to all its children.
 * It manages the `isDarkMode` state.
 *
 * @param {object} { children } - React children to be rendered within the provider's scope.
 */
export const ThemeProvider = ({ children }) => {
  // State to manage the current theme mode.
  // Initialize with a default value, e.g., true for dark mode, or from local storage.
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Function to toggle the theme mode
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
    // In a real application, you might also save this preference to AsyncStorage
    // or a user's profile in Firestore so it persists across sessions.
    console.log(`Theme toggled to: ${!isDarkMode ? 'Dark' : 'Light'} Mode`);
  };

  // The value that will be provided to consumers of ThemeContext.
  // It includes the current theme status and the toggle function.
  const themeContextValue = {
    isDarkMode,
    toggleTheme,
    // You could also expose specific theme colors here based on isDarkMode
    // e.g., currentColors: isDarkMode ? DARK_THEME_COLORS : LIGHT_THEME_COLORS
  };

  return (
    // Provide the theme context value to all children.
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Custom Hook
 * A convenient hook to consume the ThemeContext.
 * This hook makes it easier for components to access the theme state
 * and toggle function without directly importing useContext and ThemeContext.
 *
 * @returns {object} The theme context value: { isDarkMode: boolean, toggleTheme: function }.
 * @throws {Error} If used outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
