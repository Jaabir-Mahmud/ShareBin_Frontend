// Auth Debug Script
console.log('=== Auth Debug Script ===');

// Function to test auth state changes
function testAuthState() {
  console.log('Testing auth state...');
  
  // Import authService
  import('./services/authService.js').then((module) => {
    const authService = module.default;
    
    console.log('Current user:', authService.getCurrentUser());
    console.log('Is authenticated:', authService.isAuthenticated());
    
    // Add a listener to see state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log('Auth state changed - User:', user);
    });
    
    // Test logout
    window.testLogout = async function() {
      console.log('Testing logout...');
      try {
        await authService.logout();
        console.log('Logout completed');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
    
    console.log('Added testLogout() function to window. Call it to test logout.');
    console.log('Added auth state listener. Check console for updates.');
  });
}

// Run the test
testAuthState();

export default testAuthState;