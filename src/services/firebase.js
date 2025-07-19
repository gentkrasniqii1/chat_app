// firebase.js
// Purpose: Initializes the Firebase app and exports configured
// db (Firestore) and auth (Authentication) instances.
// Contribution: Centralized Firebase setup, promoting modularity and easy configuration updates.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Global variables provided by the Canvas environment.
// These are mandatory and will be available at runtime.
// They contain your Firebase project's configuration details.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(
  typeof __firebase_config !== 'undefined'
    ? __firebase_config
    : '{}'
);

// Initialize the Firebase application.
// This should be done only once in your application.
const app = initializeApp(firebaseConfig);

// Get the Firestore database instance.
// This instance will be used for all database operations (e.g., sending/receiving messages).
const db = getFirestore(app);

// Get the Firebase Authentication instance.
// This instance will be used for all user authentication operations (e.g., login, registration).
const auth = getAuth(app);

// Export the initialized Firebase instances.
// Other parts of your application can now import `db` and `auth` directly
// without needing to know the underlying initialization details.
export { app, db, auth, appId };
