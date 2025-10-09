import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const ProfilePage = ({ navigateTo }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        } else {
          // Fallback to dummy data if not authenticated
          setUser({
            id: 1,
            username: 'Guest',
            email: 'guest@example.com'
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to dummy data on error
        setUser({
          id: 1,
          username: 'Guest',
          email: 'guest@example.com'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigateTo('home');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 glassmorphism rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 glassmorphism rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {authService.isAuthenticated() ? (
        <div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-dark-bg font-semibold">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-medium">{user?.username || 'User'}</div>
                <div className="text-sm text-gray-400">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded font-medium mr-2"
          >
            Logout
          </button>
          <button 
            onClick={() => navigateTo && navigateTo('home')} 
            className="px-4 py-2 bg-accent-cyan text-dark-bg rounded font-medium"
          >
            Back
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-300 mb-4">You are not logged in. Please log in to access your profile.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-dark-bg font-semibold">YZ</div>
              <div>
                <div className="font-medium">YZ</div>
                <div className="text-sm text-gray-400">yz@example.com</div>
              </div>
            </div>
            <div className="pt-4">
              <button onClick={() => navigateTo && navigateTo('home')} className="px-4 py-2 bg-accent-cyan text-dark-bg rounded font-medium">Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;