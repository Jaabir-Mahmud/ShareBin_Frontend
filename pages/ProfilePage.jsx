import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const ProfilePage = ({ navigateTo }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the current user from authService
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Fallback to dummy data if no user
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 glassmorphism rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-t-2 border-accent-cyan rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 glassmorphism rounded-lg animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-4">
            {/* Display user profile photo or initials */}
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-dark-bg font-semibold">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium">{user.displayName || user.email || 'User'}</div>
              {user.email && <div className="text-sm text-gray-400">{user.email}</div>}
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigateTo && navigateTo('home')} 
          className="px-4 py-2 bg-accent-cyan text-dark-bg rounded font-medium hover:bg-cyan-500 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;