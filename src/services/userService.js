// userService.js
// Purpose: Handles user profile data operations in Firestore (e.g., fetchUserProfile, updateUserProfile).
// Contribution: User data management, personalization, and integrity of profile information.

import {
  doc,        // For referencing specific documents
  getDoc,     // For fetching a single document
  setDoc,     // For setting (creating or overwriting) a document
  updateDoc,  // For updating specific fields of a document
  collection, // For referencing a collection
} from 'firebase/firestore';

// Import the 'db' and 'appId' instances from your centralized Firebase configuration.
import { db, appId } from './firebase'; // Adjust path as per your folder structure

// Define the base collection reference for user profiles.
// This path corresponds to where public user profiles are stored in Firestore.
// Each document in this collection will have the user's UID as its ID.
const usersCollectionRef = collection(
  db,
  'artifacts',
  appId,
  'public',
  'data',
  'users'
);

/**
 * Fetches a user's profile data from Firestore.
 * @param {string} userId - The ID of the user whose profile is to be fetched.
 * @returns {Promise<object | null>} A promise that resolves with the user's profile data,
 * or null if the profile does not exist.
 * @throws {FirebaseError} If fetching the profile fails.
 */
const fetchUserProfile = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to fetch a user profile.');
  }
  try {
    const userDocRef = doc(usersCollectionRef, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log('User profile fetched successfully for ID:', userId);
      return userDocSnap.data();
    } else {
      console.log('User profile not found for ID:', userId);
      return null; // Profile does not exist
    }
  } catch (error) {
    console.error('Error fetching user profile:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Updates a user's profile data in Firestore.
 * If the profile document does not exist, it will be created.
 * Uses `setDoc` with `merge: true` to update existing fields without overwriting the entire document.
 * @param {string} userId - The ID of the user whose profile is to be updated.
 * @param {object} data - An object containing the profile fields to update (e.g., { displayName: 'New Name', avatarUri: 'http://...' }).
 * @returns {Promise<void>} A promise that resolves when the profile is successfully updated.
 * @throws {FirebaseError} If updating the profile fails.
 */
const updateUserProfile = async (userId, data) => {
  if (!userId || !data || typeof data !== 'object') {
    throw new Error('User ID and valid data object are required to update a user profile.');
  }
  try {
    const userDocRef = doc(usersCollectionRef, userId);
    // setDoc with { merge: true } will create the document if it doesn't exist,
    // or update only the specified fields if it does.
    await setDoc(userDocRef, data, { merge: true });
    console.log('User profile updated successfully for ID:', userId);
  } catch (error) {
    console.error('Error updating user profile:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

// Export all user service functions for use in other parts of the application.
export {
  fetchUserProfile,
  updateUserProfile,
};
