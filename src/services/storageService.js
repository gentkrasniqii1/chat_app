// storageService.js
// Purpose: Manages file uploads and downloads to Firebase Storage (e.g., uploadMedia, getMediaUrl).
// Contribution: Secure handling of media files, essential for a feature-rich chat app.

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject, // For deleting files
} from 'firebase/storage';

// Import the 'app' and 'appId' instances from your centralized Firebase configuration.
import { app, appId } from './firebase'; // Adjust path as per your folder structure

// Get the Firebase Storage instance.
const storage = getStorage(app);

// Define the base path for storing media files in Firebase Storage.
// This path ensures files are organized within your application's public data.
const mediaBasePath = `artifacts/${appId}/public/data/media`;

/**
 * Uploads a media file (image or video) to Firebase Storage.
 * @param {string} uri - The local file URI of the media to upload.
 * @param {string} fileName - The desired name for the file in storage (e.g., 'image_123.jpg').
 * @param {string} fileType - The MIME type of the file (e.g., 'image/jpeg', 'video/mp4').
 * @returns {Promise<string>} A promise that resolves with the download URL of the uploaded file.
 * @throws {Error} If the upload fails.
 */
const uploadMedia = async (uri, fileName, fileType) => {
  if (!uri || !fileName || !fileType) {
    throw new Error('URI, file name, and file type are required for media upload.');
  }

  try {
    // Fetch the file as a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a storage reference with a unique path
    const storageRef = ref(storage, `${mediaBasePath}/${fileName}`);

    // Upload the blob
    const uploadResult = await uploadBytes(storageRef, blob, { contentType: fileType });
    console.log('Media uploaded successfully:', uploadResult.metadata.fullPath);

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading media:', error.code, error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Gets the download URL for a file stored in Firebase Storage.
 * @param {string} fileName - The name of the file in storage (relative to mediaBasePath).
 * @returns {Promise<string>} A promise that resolves with the download URL.
 * @throws {Error} If fetching the URL fails (e.g., file not found).
 */
const getMediaUrl = async (fileName) => {
  if (!fileName) {
    throw new Error('File name is required to get media URL.');
  }
  try {
    const storageRef = ref(storage, `${mediaBasePath}/${fileName}`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting media URL:', error.code, error.message);
    throw error;
  }
};

/**
 * Deletes a media file from Firebase Storage.
 * Note: Implement proper security rules in Firebase Storage to ensure only authorized users can delete files.
 * @param {string} fileName - The name of the file to delete (relative to mediaBasePath).
 * @returns {Promise<void>} A promise that resolves when the file is deleted.
 * @throws {Error} If deletion fails.
 */
const deleteMedia = async (fileName) => {
  if (!fileName) {
    throw new Error('File name is required to delete media.');
  }
  try {
    const storageRef = ref(storage, `${mediaBasePath}/${fileName}`);
    await deleteObject(storageRef);
    console.log('Media deleted successfully:', fileName);
  } catch (error) {
    console.error('Error deleting media:', error.code, error.message);
    throw error;
  }
};

// Export all storage service functions for use in other parts of the application.
export {
  uploadMedia,
  getMediaUrl,
  deleteMedia,
};
