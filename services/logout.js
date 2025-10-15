// Simple logout utility function
import authService from './authService';

/**
 * Logs out the current user
 * @param {Function} navigateTo - Navigation function to redirect after logout
 * @returns {Promise<void>}
 */
export const logoutUser = async (navigateTo) => {
  try {
    console.log('Logging out user...');
    await authService.logout();
    console.log('User logged out successfully');
    
    // Navigate to home page after logout
    if (navigateTo && typeof navigateTo === 'function') {
      navigateTo('home');
    }
  } catch (error) {
    console.error('Error logging out user:', error);
    // Still navigate to home even if logout fails
    if (navigateTo && typeof navigateTo === 'function') {
      navigateTo('home');
    }
  }
};

export default logoutUser;