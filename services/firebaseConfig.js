// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCQxzQohIUmEfpsqgepvnERRwBO_qlsa44",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sharebin-5b2f4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sharebin-5b2f4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sharebin-5b2f4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "7648407347",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:7648407347:web:f9e0aba747e3ed11c85846",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6BNH336B16"
};

console.log('Firebase config values:');
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? 'From env' : 'Using fallback');
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'From env' : 'Using fallback');
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'From env' : 'Using fallback');

console.log('Firebase config object:', firebaseConfig);

// Check if all required config values are present
const requiredConfig = [
  'apiKey', 'authDomain', 'projectId', 'storageBucket',
  'messagingSenderId', 'appId'
];

const missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);
if (missingConfig.length > 0) {
  console.error('Missing Firebase configuration values:', missingConfig);
} else {
  console.log('All required Firebase configuration values are present');
}

// Only initialize Firebase if we have the required configuration
let app, auth, googleProvider, analytics;

if (missingConfig.length === 0) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
    console.log('Firebase auth initialized successfully');
    
    // Initialize Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    console.log('Google Auth provider initialized successfully');
    
    // Conditionally initialize analytics only in browser environment
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
        console.log('Firebase analytics initialized successfully');
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase not initialized due to missing configuration');
}

export { auth, googleProvider, analytics };