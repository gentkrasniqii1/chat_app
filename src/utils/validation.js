// validation.js
// Purpose: Functions specifically for validating user inputs (e.g., email format, password strength).
// Contribution: Data integrity, security (preventing invalid data), and improved user experience.

/**
 * @file This file provides a collection of functions for validating various user inputs.
 * Centralizing validation logic helps maintain data integrity and consistency across the application.
 */

/**
 * Validates an email address format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 */
export const isValidEmail = (email) => {
  // A robust regex for email validation.
  // While comprehensive, client-side validation should always be complemented by server-side validation.
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validates the strength of a password.
 * Checks for minimum length, presence of uppercase, lowercase, number, and special character.
 * @param {string} password - The password string to validate.
 * @returns {object} An object indicating validity and specific error messages.
 * { isValid: boolean, message: string | null }
 */
export const isValidPassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password cannot be empty.' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character.' };
  }
  return { isValid: true, message: null };
};

/**
 * Validates if a given string is not empty or just whitespace.
 * @param {string} value - The string to validate.
 * @returns {boolean} True if the string is not empty or whitespace, false otherwise.
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validates if two strings match (e.g., for password confirmation).
 * @param {string} value1 - The first string.
 * @param {string} value2 - The second string.
 * @returns {boolean} True if the strings match, false otherwise.
 */
export const doStringsMatch = (value1, value2) => {
  return value1 === value2;
};

// You can add more validation functions here as your application grows,
// such as:
// - `isValidUsername`: For username format validation.
// - `isValidPhoneNumber`: For phone number format validation.
// - `isPositiveNumber`: For validating numerical inputs.
