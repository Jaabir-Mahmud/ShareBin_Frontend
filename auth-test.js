// Simple authentication test script
import authService from './services/authService';
import { auth } from './services/firebaseConfig';

// Test the current auth state
console.log('Testing authentication state...');

// Check if Firebase auth is initialized
console.log('Firebase auth initialized:', !!auth);

// Check current user
console.log('Current Firebase user:', auth.currentUser);

// Check authService state
console.log('AuthService user:', authService.user);
console.log('AuthService isAuthenticated:', authService.isAuthenticated());

// Listen for auth state changes
const unsubscribe = authService.onAuthStateChanged((user) => {
  console.log('Auth state changed - User:', user);
  console.log('AuthService user after change:', authService.user);
  console.log('AuthService isAuthenticated after change:', authService.isAuthenticated());
});

// Test logout function
const testLogout = async () => {
  console.log('Testing logout function...');
  try {
    await authService.logout();
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Export for use in browser console
window.testAuth = {
  logout: testLogout,
  authService: authService,
  firebaseAuth: auth
};

console.log('Auth test functions available in window.testAuth');
console.log('Call window.testAuth.logout() to test logout');

// Clean up listener after 30 seconds
setTimeout(() => {
  unsubscribe();
  console.log('Auth state listener unsubscribed');
}, 30000);