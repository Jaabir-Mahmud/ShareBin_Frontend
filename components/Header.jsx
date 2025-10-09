import React, { useState, useEffect } from 'react';
import { ClockIcon } from './icons.jsx';
import authService from '../services/authService';

const Header = ({ navigateTo }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState('YZ');

  useEffect(() => {
    // Check if user is authenticated and get user data
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserInitials(currentUser.username?.charAt(0)?.toUpperCase() || 'U');
    }
  }, []);

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

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserInitials('YZ');
    setMenuOpen(false);
    navigateTo('home');
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
          <div className="flex items-center gap-2">
            {/* removed the Share button per request for a cleaner header */}

            {/* settings moved to the right-side toolbar in the editor page */}

            <div className="relative" tabIndex={0} onBlur={() => setMenuOpen(false)}>
              {authService.isAuthenticated() && user ? (
                <div className="group">
                  <button
                    onClick={() => setMenuOpen((s) => !s)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm ring-1 ring-gray-700 focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    title="Account"
                    style={{ background: getAvatarGradient(userInitials), color: '#0f172a' }}
                  >
                    <span className="font-semibold">{userInitials}</span>
                  </button>

                  <div className="absolute -top-8 right-0 hidden group-hover:block px-2 py-1 rounded bg-gray-800 text-xs text-gray-300">Account</div>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-dark-bg border border-gray-700 rounded shadow-lg p-2 z-50">
                      <div className="px-2 py-1 text-xs text-gray-400">Signed in as {user.username || user.email}</div>
                      <button
                        onClick={() => { setMenuOpen(false); navigateTo('profile'); }}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-800 rounded"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-800 rounded"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button onClick={() => navigateTo('login')} className="px-3 py-1 rounded-md border border-gray-700 text-sm hover:bg-white/5">Login</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    {/* SettingsPanel is now handled in the EditorPage right toolbar */}
    </header>
  );
};

export default Header;