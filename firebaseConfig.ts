// This file configures the connection to your Firebase Realtime Database.
// Make sure the Firebase SDK scripts are included in your index.html file.

// This line tells TypeScript that a global 'firebase' object exists.
// It's loaded from the <script> tags in index.html.
declare const firebase: any;

// --- IMPORTANT: PASTE YOUR FIREBASE PROJECT CONFIGURATION HERE ---
// You can get this from the Firebase Console:
// Project Settings > General > Your apps > Web app > Firebase SDK snippet > Config
const firebaseConfig = {
   apiKey: "AIzaSyBTpe0lK6VW63yx1vnydNq4OfyeKT3hkNs",
  authDomain: "work-2295f.firebaseapp.com",
  databaseURL: "https://work-2295f-default-rtdb.firebaseio.com",
  projectId: "work-2295f",
  storageBucket: "work-2295f.firebasestorage.app",
  messagingSenderId: "311135482401",
  appId: "1:311135482401:web:640534d536f6d926efa960",
  measurementId: "G-NCGDZ2JLBP"
};

// Initialize Firebase only if it hasn't been initialized yet.
if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.error("Firebase initialization error. Make sure your config is correct.", e);
  }
}

// Get a reference to the Firebase Realtime Database service
const database = firebase.database();

export { database };
