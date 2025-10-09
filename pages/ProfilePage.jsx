import React from 'react';

const ProfilePage = ({ navigateTo }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 glassmorphism rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-300 mb-4">This is a placeholder profile page. Connect this to your auth system to show real user data.</p>
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
  );
};

export default ProfilePage;
