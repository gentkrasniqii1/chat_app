// helpers.js
// Purpose: Contains miscellaneous utility functions (e.g., formatTimestamp, generateUniqueId, validateEmail).
// Contribution: Code reusability, reducing redundancy, and improving code quality.

/**
 * @file This file provides various helper functions used across the application.
 * These functions encapsulate common logic, making the codebase cleaner and more maintainable.
 */

/**
 * Formats a Firebase Timestamp object into a human-readable date and time string.
 * @param {object | null | undefined} timestamp - The Firebase Timestamp object.
 * @param {boolean} includeDate - Whether to include the date in the formatted string.
 * @returns {string} The formatted date/time string, or an empty string if timestamp is invalid.
 */
export const formatTimestamp = (timestamp, includeDate = false) => {
  if (!timestamp || !timestamp.toDate) {
    return '';
  }
  const date = timestamp.toDate();
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };

  if (includeDate) {
    return `${date.toLocaleDateString([], dateOptions)} ${date.toLocaleTimeString([], timeOptions)}`;
  } else {
    return date.toLocaleTimeString([], timeOptions);
  }
};

/**
 * Generates a simple unique ID string.
 * This is suitable for client-side generation where strong cryptographic uniqueness isn't strictly required
 * but a high probability of uniqueness is desired (e.g., for temporary keys).
 * For truly unique and collision-resistant IDs (especially for database primary keys),
 * consider using UUID libraries or server-generated IDs.
 * @returns {string} A unique ID string.
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Validates an email address format using a simple regex.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 */
export const isValidEmail = (email) => {
  // Basic regex for email validation.
  // For more robust validation, consider using a dedicated library.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with its first letter capitalized.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length and appends an ellipsis if truncated.
 * @param {string} str - The input string.
 * @param {number} maxLength - The maximum desired length of the string.
 * @returns {string} The truncated string.
 */
export const truncateString = (str, maxLength) => {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
};

// You can add more helper functions here as your application grows,
// such as:
// - `debounce`: For limiting how often a function is called.
// - `throttle`: For limiting how often a function is called over time.
// - `isNetworkConnected`: To check device's network status.
// - `getInitials`: (If not handled directly in UserAvatar) To extract initials from a name.
