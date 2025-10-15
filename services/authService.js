// AuthService.js - Fully functional Firebase authentication service
import { auth, googleProvider } from './firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged 
} from "firebase/auth";

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.listeners = [];
  }

  // Add listener for auth state changes
  onAuthStateChanged(callback) {
    // If Firebase auth is not available, call the callback with null immediately
    if (!auth) {
      console.warn('Firebase auth not available, calling callback with null user');
      callback(null);
      // Return a no-op unsubscribe function
      return () => {};
    }
    
    // Call the Firebase onAuthStateChanged method
    const unsubscribe = firebaseOnAuthStateChanged(auth, (user) => {
      this.user = user;
      callback(user);
    });
    
    // Return unsubscribe function
    return unsubscribe;
  }

  // Email/password login
  async login(email, password) {
    if (!auth) {
      throw new Error('Firebase auth not available');
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Email/password registration
  async register(username, email, password) {
    if (!auth) {
      throw new Error('Firebase auth not available');
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
      
      // Note: Firebase doesn't directly support username during registration
      // You might want to store the username in a separate database
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Google login
  async googleLogin() {
    if (!auth || !googleProvider) {
      throw new Error('Firebase auth or Google provider not available');
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      this.user = result.user;
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout() {
    if (!auth) {
      // If Firebase auth is not available, just reset local state
      this.user = null;
      this.token = null;
      return Promise.resolve();
    }
    
    try {
      await signOut(auth);
      this.user = null;
      this.token = null;
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get token
  async getToken() {
    if (!auth) {
      return null;
    }
    
    if (this.user) {
      return await this.user.getIdToken();
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.user;
  }
}

// Only export an instance if Firebase auth is available
const authService = auth ? new AuthService() : null;

// Export a fallback object with the same interface if Firebase is not available
export default authService || {
  onAuthStateChanged: (callback) => {
    console.warn('Firebase auth not available, auth state change listener not registered');
    callback(null);
    return () => {}; // Return no-op unsubscribe function
  },
  login: () => Promise.reject(new Error('Firebase auth not available')),
  register: () => Promise.reject(new Error('Firebase auth not available')),
  googleLogin: () => Promise.reject(new Error('Firebase auth not available')),
  logout: () => Promise.resolve(),
  getCurrentUser: () => null,
  getToken: () => Promise.resolve(null),
  isAuthenticated: () => false
};