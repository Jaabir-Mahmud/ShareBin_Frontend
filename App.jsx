import React, { useState, useCallback } from 'react';
import HomePage from './pages/HomePage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import FileUploadPage from './pages/FileUploadPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Header from './components/Header.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [roomId, setRoomId] = useState(null);

  const navigateTo = useCallback((page) => {
    if (page === 'editor') {
      // Generate a unique room ID for a new editor session
      const newRoomId = Math.random().toString(36).substring(2, 9);
      setRoomId(newRoomId);
    }
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'editor':
        return <EditorPage roomId={roomId || 'default'} />;
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