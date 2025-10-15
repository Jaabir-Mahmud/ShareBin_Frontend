import React, { useState, useEffect, useCallback } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import { ShareIcon, DownloadIcon, CopyIcon, PlusIcon, SettingsIcon, UserIcon } from '../components/icons.jsx';
import SettingsPanel from '../components/SettingsPanel.jsx';

const EditorPage = ({ roomId, snippetId }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
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
  const [collaborators] = useState([
    { id: 1, name: 'Alex Johnson', color: '#06b6d4', active: true },
    { id: 2, name: 'Sam Wilson', color: '#7c3aed', active: true },
    { id: 3, name: 'Taylor Kim', color: '#16a34a', active: false },
  ]);
  const [files, setFiles] = useState(() => {
    const id = Math.random().toString(36).substring(2, 9);
    return [{ id, name: 'untitled', content: `` }];
  });
  const [activeFileId, setActiveFileId] = useState(files[0].id);
  const [snippetLoaded, setSnippetLoaded] = useState(false);
  const [snippetInfo, setSnippetInfo] = useState(null);
  const [editingMode, setEditingMode] = useState(false);

  // Load snippet if snippetId is provided
  useEffect(() => {
    if (snippetId && !snippetLoaded) {
      loadSnippet(snippetId);
    }
  }, [snippetId, snippetLoaded]);

  const loadSnippet = async (id) => {
    try {
      // Call backend API to load snippet
      const response = await fetch(`https://sharebin-jb7r.onrender.com/api/snippets/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Snippet not found');
        } else if (response.status === 410) {
          throw new Error('Snippet has expired');
        } else {
          throw new Error('Failed to load snippet');
        }
      }
      
      const data = await response.json();
      
      // Set the loaded snippet content
      setFiles([{ 
        id: 'loaded-snippet', 
        name: data.name || `snippet-${id}`, 
        content: data.content || '' 
      }]);
      setActiveFileId('loaded-snippet');
      setSnippetLoaded(true);
      setSnippetInfo(data);
      setEditingMode(data.editing || false);
      
      // Update syntax highlighting based on language if available
      if (data.language) {
        setSettings(s => ({ ...s, syntax: data.language }));
      }
    } catch (error) {
      console.error('Error loading snippet:', error);
      // Set some default content to indicate the error
      setFiles([{ 
        id: 'error-snippet', 
        name: 'error-loading', 
        content: `// Error loading snippet: ${error.message}\n// Please check the URL and try again.` 
      }]);
      setActiveFileId('error-snippet');
    }
  };

  const saveSnippet = async (customId = null) => {
    try {
      const activeFile = files.find(f => f.id === activeFileId) || files[0];
      
      // Get JWT token from localStorage (assuming it's stored there after login)
      const token = localStorage.getItem('sharebin_token');
      
      if (!token) {
        setCopySuccess('Please log in to save snippets');
        setTimeout(() => setCopySuccess(''), 3000);
        return;
      }
      
      // Call backend API to save snippet
      const response = await fetch('https://sharebin-jb7r.onrender.com/api/snippets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: activeFile.content, 
          name: activeFile.name,
          language: settings.syntax,
          customId: customId, // Pass custom ID if provided
          editing: editingMode // Pass current editing mode
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save snippet');
      }
      
      const data = await response.json();
      
      // Update the URL to reflect the new snippet
      window.location.hash = `#/${data.snippetId}`;
      
      // Copy the shareable URL to clipboard
      navigator.clipboard.writeText(data.url);
      setCopySuccess('Snippet saved! Link copied to clipboard.');
      
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (error) {
      console.error('Error saving snippet:', error);
      setCopySuccess(`Error: ${error.message}`);
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  const updateSnippet = async () => {
    try {
      if (!snippetId) return;
      
      const activeFile = files.find(f => f.id === activeFileId) || files[0];
      
      // Call backend API to update snippet
      const response = await fetch(`https://sharebin-jb7r.onrender.com/api/snippets/${snippetId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: activeFile.content, 
          name: activeFile.name,
          language: settings.syntax
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update snippet');
      }
      
      const data = await response.json();
      setSnippetInfo(data);
      
      setCopySuccess('Snippet updated successfully!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (error) {
      console.error('Error updating snippet:', error);
      setCopySuccess(`Error: ${error.message}`);
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  const toggleEditingMode = async () => {
    try {
      if (!snippetId) return;
      
      // Get JWT token from localStorage
      const token = localStorage.getItem('sharebin_token');
      
      if (!token) {
        setCopySuccess('Please log in to change editing mode');
        setTimeout(() => setCopySuccess(''), 3000);
        return;
      }
      
      // Call backend API to toggle editing mode
      const response = await fetch(`https://sharebin-jb7r.onrender.com/api/snippets/${snippetId}/editing`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          editing: !editingMode
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle editing mode');
      }
      
      const data = await response.json();
      setEditingMode(data.editing);
      
      setCopySuccess(`Editing mode: ${data.editing ? 'ON' : 'OFF'}`);
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (error) {
      console.error('Error toggling editing mode:', error);
      setCopySuccess(`Error: ${error.message}`);
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  const handleCodeChange = useCallback((newCode) => {
    setFiles((cur) => cur.map(f => f.id === activeFileId ? { ...f, content: newCode } : f));
    
    // If we're viewing an existing snippet with editing enabled, auto-save changes
    if (snippetId && editingMode) {
      // Debounce the update to avoid too many requests
      const timer = setTimeout(() => {
        updateSnippet();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [activeFileId, snippetId, editingMode]);

  const handleCopyLink = () => {
    if (snippetId) {
      // If we're viewing an existing snippet, just copy the current URL
      const url = `${window.location.origin}/${snippetId}`;
      navigator.clipboard.writeText(url);
      setCopySuccess('Link copied!');
    } else {
      // If we're creating a new snippet, save it first
      const customId = prompt('Enter a custom ID (or leave blank for auto-generated):');
      if (customId !== null) {
        saveSnippet(customId);
      }
    }
    setTimeout(() => setCopySuccess(''), 2000);
  };
  
  const handleDownload = () => {
    const active = files.find(f => f.id === activeFileId) || files[0];
    const blob = new Blob([active.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${active.name}.txt`;
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
            {snippetInfo && (
              <div className="text-sm">
                <span className="text-gray-400">Editing: </span>
                <span className={editingMode ? "text-green-400" : "text-red-400"}>
                  {editingMode ? "ON" : "OFF"}
                </span>
                {snippetInfo.owner_id && (
                  <button 
                    onClick={toggleEditingMode}
                    className="ml-2 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                  >
                    Toggle
                  </button>
                )}
              </div>
            )}
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
        
        <div className="p-2">
          <button onClick={() => setSettingsOpen(true)} title="Settings" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
            <SettingsIcon className="w-5 h-5" />
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
        
        <div className="p-2">
          <button onClick={() => setCollaboratorsOpen(true)} title="Collaborators" className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/5">
            <UserIcon className="w-5 h-5" />
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
    </>
  );
};

export default EditorPage;