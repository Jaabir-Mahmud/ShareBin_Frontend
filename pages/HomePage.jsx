import React from 'react';
import GlowingButton from '../components/GlowingButton.jsx';
import authService from '../services/authService';

const FeatureCard = ({ title, description, icon }) => (
    <div className="glassmorphism p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="mb-4 text-accent-cyan flex justify-center">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);


const StaticCodeMockup = () => (
  <div className="w-full max-w-3xl mx-auto my-12 glassmorphism rounded-lg shadow-lg overflow-hidden">
    <div className="bg-gray-900/50 p-2 flex items-center">
      <div className="flex space-x-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="text-gray-400 text-sm mx-auto font-mono">
        collab-session.js
      </div>
    </div>
    <div className="p-4 font-mono text-sm text-left bg-dark-bg/50 overflow-x-auto">
      <pre><code>{`import React from 'react';

const ShareBin = () => {
  return (
    <div>
      <h1>Welcome to Real-Time Collaboration!</h1>
      // Start sharing code instantly...
    </div>
  );
};

export default ShareBin;
`}</code></pre>
    </div>
  </div>
);


const HomePage = ({ navigateTo }) => {
  return (
    <div className="text-center">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00FFFF] to-[#9333EA] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>
        <div className="mx-auto max-w-2xl py-24 sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-purple">
            Share Code, Instantly.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            A real-time collaborative code and file sharing bin. Built for developers, students, and teams who need to move fast.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <GlowingButton onClick={() => navigateTo('editor')} variant="cyan">
              Start Coding
            </GlowingButton>
            <GlowingButton onClick={() => navigateTo('upload')} variant="purple">
              Upload File
            </GlowingButton>
          </div>
        </div>
      </div>
      
      <StaticCodeMockup />

      <div className="py-12">
        <h2 className="text-3xl font-bold mb-8">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
                title="Real-Time Collaboration" 
                description="Code together with live cursors and syntax highlighting. See changes as they happen."
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <FeatureCard 
                title="Instant File Sharing" 
                description="Upload any file type and get a shareable link in seconds. Perfect for code, images, and documents."
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
            />
            <FeatureCard 
                title="Shareable Links" 
                description="Generate unique, shareable links for every code snippet or file upload. Control access and expiry."
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
            />
        </div>
      </div>

       <footer className="mt-20 py-8 border-t border-glass-border">
          <p className="text-gray-500">
            ShareBin - A Frontend Prototype. &copy; {new Date().getFullYear()}
          </p>
      </footer>
    </div>
  );
};

export default HomePage;