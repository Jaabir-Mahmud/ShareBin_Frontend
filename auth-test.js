// Simple authentication test script
import authService from './services/authService';
import { auth, analytics } from './services/firebaseConfig';

// Test the current auth state
console.log('Testing authentication state...');

// Check if Firebase auth is initialized
console.log('Firebase auth initialized:', !!auth);

// Check if Firebase analytics is initialized
console.log('Firebase analytics initialized:', !!analytics);

// Check current user (if auth is available)
if (auth) {
  console.log('Current Firebase user:', auth.currentUser);
} else {
  console.log('Current Firebase user: Firebase not initialized');
}

// Check authService state
if (authService) {
  console.log('AuthService user:', authService.user);
  console.log('AuthService isAuthenticated:', authService.isAuthenticated());
} else {
  console.log('AuthService: Not available (Firebase not initialized)');
}

// Listen for auth state changes (if authService is available)
let unsubscribe = () => {};
if (authService) {
  unsubscribe = authService.onAuthStateChanged((user) => {
    console.log('Auth state changed - User:', user);
    if (authService) {
      console.log('AuthService user after change:', authService.user);
      console.log('AuthService isAuthenticated after change:', authService.isAuthenticated());
    }
  });
} else {
  console.log('Auth state listener not registered: AuthService not available');
}

// Test logout function
const testLogout = async () => {
  if (!authService) {
    console.log('Logout test skipped: AuthService not available');
    return;
  }
  
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
  firebaseAuth: auth,
  analytics: analytics
};

console.log('Auth test functions available in window.testAuth');
if (authService) {
  console.log('Call window.testAuth.logout() to test logout');
} else {
  console.log('AuthService not available - Firebase not initialized');
}

// Clean up listener after 30 seconds (if unsubscribe is a function)
setTimeout(() => {
  if (typeof unsubscribe === 'function') {
    unsubscribe();
    console.log('Auth state listener unsubscribed');
  }
}, 30000);