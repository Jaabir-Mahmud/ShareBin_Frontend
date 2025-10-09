import React, { useState, useEffect, useCallback } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import { ShareIcon, DownloadIcon, CopyIcon, PlusIcon, SettingsIcon } from '../components/icons.jsx';
import SettingsPanel from '../components/SettingsPanel.jsx';

const EditorPage = ({ roomId }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    syntax: 'javascript',
    tabSize: 2,
    theme: 'monokai',
    keymap: 'sublime',
    fontFamily: 'Fira Code',
    fontSize: 13,
    lineHeight: 1.4,
    wordWrap: false,
    showLineNumbers: true,
    softTabs: true,
    autoSave: false,
    autoSaveInterval: 5,
  });
  const [copySuccess, setCopySuccess] = useState('');
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
          />
        </div>
      </div>
      {/* Right-side compact toolbar */}

      <aside className="w-12 flex-shrink-0 flex flex-col items-center gap-2">
  <SettingsPanel visible={settingsOpen} settings={settings} onClose={() => setSettingsOpen(false)} onChange={(k, v) => setSettings(s => ({ ...s, [k]: v }))} />
        <div className="p-2">
          <button onClick={() => setSettingsOpen(true)} title="Settings" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-2">
          <button onClick={handleCopyLink} title="Share" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2">
          <button onClick={handleDownload} title="Download" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 mt-2">
          <button onClick={createNewFile} title="New file" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </div>
      {/* collaborators reopen button intentionally removed to match requested layout */}
    </>
  );
};

export default EditorPage;
