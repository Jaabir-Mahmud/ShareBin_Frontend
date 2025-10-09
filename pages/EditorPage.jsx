import React, { useState, useEffect, useCallback } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import { ShareIcon, DownloadIcon, CopyIcon, PlusIcon, SettingsIcon, UserIcon } from '../components/icons.jsx';
import SettingsPanel from '../components/SettingsPanel.jsx';

const EditorPage = ({ roomId }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false); // State for toolbar visibility
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false); // New state for collaborators panel
  const [settings, setSettings] = useState({
    syntax: 'javascript',
    tabSize: 2,
    theme: 'monokai',
    keymap: 'sublime',
    fontFamily: 'Times New Roman',
    fontSize: 13,
    lineHeight: 1.4,
    wordWrap: true,
    showLineNumbers: true,
    softTabs: true,
    autoSave: false,
    autoSaveInterval: 5,
    minimap: false,
    highlightActiveLine: true,
    showInvisibles: false,
    scrollPastEnd: false,
    editorWidth: 'full',
    indentGuides: 'none',
  });
  const [copySuccess, setCopySuccess] = useState('');
  // Mock collaborators data
  const [collaborators] = useState([
    { id: 1, name: 'Alex Johnson', color: '#06b6d4', active: true },
    { id: 2, name: 'Sam Wilson', color: '#7c3aed', active: true },
    { id: 3, name: 'Taylor Kim', color: '#16a34a', active: false },
  ]);
  // simple in-memory files: id, name, content
  const [files, setFiles] = useState(() => {
    const id = Math.random().toString(36).substring(2, 9);
    return [{ id, name: 'untitled', content: `` }];
  });
  const [activeFileId, setActiveFileId] = useState(files[0].id);

  const handleCodeChange = useCallback((newCode) => {
    setFiles((cur) => cur.map(f => f.id === activeFileId ? { ...f, content: newCode } : f));
  }, [activeFileId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#room/${roomId}`);
    setCopySuccess('Link copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };
  
  const handleDownload = () => {
    const active = files.find(f => f.id === activeFileId) || files[0];
    const blob = new Blob([active.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${active.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createNewFile = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const name = `untitled-${id}`;
    const newFile = { id, name, content: '' };
    setFiles((cur) => [...cur, newFile]);
    setActiveFileId(id);
  };

  // autosave to localStorage when enabled
  useEffect(() => {
    if (!settings.autoSave) return;
    const interval = setInterval(() => {
      try {
        localStorage.setItem('sharebin_files', JSON.stringify(files));
      } catch (e) {
        // ignore storage errors
      }
    }, (settings.autoSaveInterval || 5) * 1000);
    return () => clearInterval(interval);
  }, [settings.autoSave, settings.autoSaveInterval, files]);

  // Toggle toolbar when settings icon is clicked
  const toggleToolbar = () => {
    setToolbarOpen(!toolbarOpen);
    // Close settings panel when toolbar is closed
    if (toolbarOpen && settingsOpen) {
      setSettingsOpen(false);
    }
  };

  return (
    <>
    <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] gap-4">
      {/* Editor Main Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2 p-2 glassmorphism rounded-t-lg">
          <div className="flex items-center gap-4">
             {/* Room ID section removed as per user request */}
          </div>
          <div className="flex items-center gap-2">
            {/* Top textual share/download removed to keep header minimal. Use right-side toolbar icons instead. */}
          </div>
        </div>
        {/* file tabs - removed as per user request */}
        <div className="mb-2 hidden">
          <div className="flex items-center gap-2">
            {files.map(f => (
              <button key={f.id} onClick={() => setActiveFileId(f.id)} className={`px-3 py-1 rounded-md ${f.id === activeFileId ? 'bg-gray-800' : 'bg-transparent'}`}>{f.name}</button>
            ))}
          </div>
        </div>
        <div className="flex-grow">
          <CodeEditor
            value={(files.find(f => f.id === activeFileId) || files[0]).content}
            onChange={handleCodeChange}
            syntax={settings.syntax}
            tabSize={settings.softTabs ? settings.tabSize : 0}
            theme={settings.theme}
            keymap={settings.keymap}
            fontFamily={settings.fontFamily}
            fontSize={settings.fontSize}
            lineHeight={settings.lineHeight}
            wordWrap={settings.wordWrap}
            showLineNumbers={settings.showLineNumbers}
            minimap={settings.minimap}
            highlightActiveLine={settings.highlightActiveLine}
            showInvisibles={settings.showInvisibles}
            scrollPastEnd={settings.scrollPastEnd}
            editorWidth={settings.editorWidth}
            indentGuides={settings.indentGuides}
          />
        </div>
      </div>
      {/* Right-side compact toolbar */}

      <aside className="w-12 flex-shrink-0 flex flex-col items-center gap-2">
        {/* Collaborators Panel */}
        {collaboratorsOpen && (
          <div className="fixed right-12 top-0 h-full w-80 bg-dark-bg/90 backdrop-blur-sm border-l border-glass-border p-4 z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Collaborators</h2>
              <button onClick={() => setCollaboratorsOpen(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center gap-3 p-2 rounded bg-gray-800/50">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: collaborator.color, color: '#0f172a' }}
                  >
                    {collaborator.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{collaborator.name}</div>
                    <div className="text-xs text-gray-400">
                      {collaborator.active ? 'Active now' : 'Offline'}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${collaborator.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <SettingsPanel visible={settingsOpen} settings={settings} onClose={() => setSettingsOpen(false)} onChange={(k, v) => setSettings(s => ({ ...s, [k]: v }))} />
        
        {/* Horizontal toolbar - shows other icons to the left when open */}
        <div className="flex flex-row-reverse items-center">
          {/* Settings button - toggles the toolbar */}
          <div className="p-2">
            <button 
              onClick={toggleToolbar} 
              title="Settings" 
              className={`w-10 h-10 rounded-md flex items-center justify-center ${toolbarOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Other icons - shown to the left of settings when toolbar is open */}
          {toolbarOpen && (
            <>
              <div className="p-2">
                <button onClick={createNewFile} title="New file" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-2">
                <button onClick={handleDownload} title="Download" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
                  <DownloadIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-2">
                <button onClick={() => setCollaboratorsOpen(true)} title="Collaborators" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
                  <UserIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-2 relative">
                <button onClick={handleCopyLink} title="Share" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
                  <ShareIcon className="w-5 h-5" />
                </button>
                {copySuccess && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-green-400 rounded whitespace-nowrap z-50">
                    {copySuccess}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
    </>
  );
};

export default EditorPage;