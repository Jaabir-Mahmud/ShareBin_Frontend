import React, { useState, useCallback, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import FileUploadPage from './pages/FileUploadPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Header from './components/Header.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [roomId, setRoomId] = useState(null);
  const [snippetId, setSnippetId] = useState(null);

  // Handle URL routing for both hash-based and path-based URLs
  useEffect(() => {
    const handleRouteChange = () => {
      // First check for hash-based routing (existing functionality)
      const hash = window.location.hash.slice(1); // Remove the '#'
      
      if (hash.startsWith('/s/')) {
        // Handle snippet access: #/s/unique-id
        const id = hash.substring(3);
        setSnippetId(id);
        setCurrentPage('editor');
      } else if (hash.startsWith('/room/')) {
        // Handle existing room functionality
        const id = hash.substring(6);
        setRoomId(id);
        setCurrentPage('editor');
      } else {
        // Check for path-based routing (new functionality)
        const path = window.location.pathname;
        
        if (path.startsWith('/')) {
          const id = path.substring(1);
          // Only treat as snippet if it's not one of our known routes
          // We check for non-empty id and that it's not a reserved route
          if (id && !['login', 'profile', 'upload', 'editor', 'home'].includes(id)) {
            setSnippetId(id);
            setCurrentPage('editor');
            return;
          }
        }
        
        // Reset snippet ID when navigating away
        setSnippetId(null);
        switch (hash || path) {
          case '/login':
          case '#/login':
            setCurrentPage('login');
            break;
          case '/profile':
          case '#/profile':
            setCurrentPage('profile');
            break;
          case '/upload':
          case '#/upload':
            setCurrentPage('upload');
            break;
          case '/editor':
          case '#/editor':
            // Generate a unique room ID for a new editor session
            const newRoomId = Math.random().toString(36).substring(2, 9);
            setRoomId(newRoomId);
            setCurrentPage('editor');
            break;
          case '/home':
          case '#/home':
          case '/':
          case '':
          default:
            setCurrentPage('home');
            break;
        }
      }
    };

    // Initial check
    handleRouteChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);
    
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateTo = useCallback((page) => {
    if (page === 'editor') {
      // Generate a unique room ID for a new editor session
      const newRoomId = Math.random().toString(36).substring(2, 9);
      setRoomId(newRoomId);
      window.location.hash = '#/editor';
    } else {
      window.location.hash = `#${page === 'home' ? '' : '/' + page}`;
    }
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'editor':
        return <EditorPage roomId={roomId || 'default'} snippetId={snippetId} />;
      case 'profile':
        return <ProfilePage navigateTo={navigateTo} />;
      case 'upload':
        return <FileUploadPage navigateTo={navigateTo} />;
      case 'home':
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="bg-dark-bg min-h-screen text-gray-200">
      <Header navigateTo={navigateTo} />
      <main className="w-full px-4 py-8 animate-fade-in">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;