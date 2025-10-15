import React, { useState, useEffect } from 'react';
import { ClockIcon } from './icons.jsx';
import authService from '../services/authService';

const Header = ({ navigateTo }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState('YZ');
  const [loggingOut, setLoggingOut] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    console.log('Header: Setting up auth state listener');
    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log('Header: Auth state changed, user:', user ? 'exists' : 'null');
      console.log('Header: Current authService user:', authService.user ? 'exists' : 'null');
      
      if (user) {
        setUser(user);
        // Fix: Get initials from displayName or email properly
        const displayName = user.displayName || user.email;
        const initials = displayName ? displayName.charAt(0).toUpperCase() : 'U';
        setUserInitials(initials);
        console.log('Header: User set to:', user.email, 'initials:', initials);
      } else {
        setUser(null);
        setUserInitials('YZ');
        console.log('Header: User set to null');
      }
    });
    
    return () => {
      console.log('Header: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []); // This should be fine as a one-time setup

  const palette = [
    ['#06b6d4', '#7c3aed'], // cyan -> purple
    ['#06b6d4', '#16a34a'], // cyan -> green
    ['#ef4444', '#f97316'], // red -> orange
    ['#6366f1', '#ec4899'], // indigo -> pink
  ];

  const getAvatarGradient = (text) => {
    const sum = text.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const pair = palette[sum % palette.length];
    return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
  };
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Split time string into individual characters with spacing
  const renderSpacedTime = (timeString) => {
    return timeString.split('').map((char, index) => (
      <span key={index} className="mx-1">{char}</span>
    ));
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authService.logout();
      navigateTo('home');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
  <header style={{ WebkitBackdropFilter: 'blur(6px)' }} className="bg-dark-bg/50 backdrop-blur-sm sticky top-0 z-50 border-b border-glass-border">
  <nav className="w-full px-6 py-2 flex justify-between items-center">
        <div 
          className="text-xl font-bold cursor-pointer flex items-center"
          onClick={() => navigateTo('home')}
          aria-label="Go to home"
        >
          <span style={{ color: '#91C4C3' }}>Share</span>
          <span style={{ color: '#B4DEBD' }}>Bin</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2 text-gray-400">
            <ClockIcon className="w-4 h-4" style={{ color: '#91C4C3' }} />
            <span className="font-medium tracking-wider flex" style={{ color: '#91C4C3' }}>
              {renderSpacedTime(timeStr)}
            </span>
          </div>
          
          {/* Show either login button or user profile based on auth state */}
          {user ? (
            <div className="relative group">
              {/* Display user profile photo or initials */}
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium cursor-pointer"
                  style={{ background: getAvatarGradient(user.email || 'user') }}
                >
                  {userInitials}
                </div>
              )}
              <div className="absolute right-0 mt-2 w-48 bg-dark-bg border border-glass-border rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-2 text-sm border-b border-glass-border">
                  <div className="font-medium">{user.displayName || user.email}</div>
                  {user.email && <div className="text-gray-400 text-xs">{user.email}</div>}
                </div>
                <button
                  onClick={() => navigateTo('profile')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-2 bg-accent-cyan text-dark-bg rounded font-medium hover:bg-cyan-400 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;