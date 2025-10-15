// Manual logout script - Run this in the browser console to logout the current user
// Copy and paste the following code into your browser's developer console:

/*
// Method 1: Direct logout using authService
import authService from './services/authService';

authService.logout().then(() => {
  console.log('User logged out successfully');
  // Optionally redirect to home page
  window.location.href = '/';
}).catch((error) => {
  console.error('Error logging out:', error);
});

// Method 2: Using the logout utility function
import { logoutUser } from './services/logout';

logoutUser(() => {
  console.log('Navigated to home after logout');
});
*/

// For immediate execution in browser console (without imports):
function manualLogout() {
  // Clear Firebase auth state
  import('/src/services/authService.js').then((module) => {
    const authService = module.default;
    authService.logout().then(() => {
      console.log('User logged out successfully');
      // Refresh the page to reflect the logout
      window.location.reload();
    }).catch((error) => {
      console.error('Error logging out:', error);
      // Still refresh the page to clear any cached state
      window.location.reload();
    });
  }).catch((error) => {
    console.error('Error importing authService:', error);
  });
}

// Export for use in other modules
export { manualLogout };

console.log('Manual logout function available. Call manualLogout() to logout the current user.');