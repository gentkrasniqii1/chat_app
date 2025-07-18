ChatApp: Real-time Mobile Chat Application
A modern, real-time chat application built with React Native and powered by Firebase Firestore for seamless message synchronization and authentication. This application demonstrates a clean, responsive UI for mobile devices, allowing users to send and receive messages instantly.

🌟 Features
Real-time Messaging: Send and receive messages instantly with Firebase Firestore's real-time capabilities.

Anonymous Authentication: Users are automatically authenticated anonymously upon app launch, ensuring a unique ID for each participant.

User Identification: Each message is tagged with the sender's unique ID.

Intuitive UI: A clean and responsive chat interface designed for mobile.

Automatic Scrolling: The chat view automatically scrolls to the latest message.

Dark Theme: A visually appealing dark color scheme.

Keyboard Avoiding: Ensures the message input field is not obscured by the on-screen keyboard.

🚀 Technologies Used
Frontend: React Native

Backend/Database: Firebase (Firestore for database, Authentication for user management)

Bundler: Metro

Transpiler: Babel

🛠️ Setup and Installation
Follow these steps to get the ChatApp running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm or Yarn (npm is used in these instructions)

Expo CLI (npm install -g expo-cli)

A Firebase Project (You'll need your Firebase configuration details)

1. Clone the Repository (or create project structure)
If you're starting from scratch, create a new Expo project and then add the files.

# If starting a new Expo project
npx create-expo-app ChatApp --template blank
cd ChatApp

Then, ensure your project structure matches the recommended one:

my-chat-app/
├── App.js
├── app.json
├── package.json
├── .env
├── .gitignore
├── babel.config.js
├── metro.config.js
├── README.md
├── assets/
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/
    ├── components/
    ├── screens/
    ├── navigation/
    ├── services/
    ├── utils/
    ├── hooks/
    ├── context/
    └── styles/

2. Install Dependencies
Navigate to your project directory and install the required packages:

cd ChatApp
npm install

3. Configure Firebase
You need to connect your app to a Firebase project.

Create a Firebase Project: Go to the Firebase Console and create a new project.

Enable Firestore: In your Firebase project, navigate to "Firestore Database" and create a new database. Start in "production mode" and choose a location.

Enable Anonymous Authentication: In your Firebase project, go to "Authentication" -> "Sign-in method" tab. Enable the "Anonymous" provider.

Get Firebase Config: In your Firebase project settings (gear icon next to "Project overview") -> "Project settings" -> "General" tab. Scroll down to "Your apps" and select the "Web app" you registered (or add a new one if you haven't). Copy the Firebase SDK configuration object.

Update .env file: Open the .env file in your project root and replace the placeholder values with your actual Firebase configuration.

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
EXPO_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"

Update app.json: Change the bundleIdentifier for iOS and package for Android in app.json to a unique identifier (e.g., com.yourcompany.chatapp).

"ios": {
  "bundleIdentifier": "com.yourcompany.chatapp"
},
"android": {
  "package": "com.yourcompany.chatapp"
}

4. Create Assets
Create placeholder image files in the assets/ directory as referenced in app.json:

assets/icon.png

assets/splash.png

assets/adaptive-icon.png

assets/favicon.png

5. Run the Application
Once all dependencies are installed and Firebase is configured, you can run the application:

npm start

This will open the Expo development server. You can then:

Scan the QR code with the Expo Go app on your phone (iOS or Android).

Press a to run on an Android emulator/device.

Press i to run on an iOS simulator/device.

Press w to run in a web browser.

🤝 Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

📄 License
This project is open-source and available under the MIT License.