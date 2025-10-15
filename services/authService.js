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

export default new AuthService();