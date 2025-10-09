import React from 'react';

// settings: { syntax, tabSize, theme, keymap }
const SettingsPanel = ({ visible, onClose, settings = {}, onChange }) => {
  if (!visible) return null;

  const change = (key, value) => {
    if (onChange) onChange(key, value);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-dark-bg/90 backdrop-blur-sm border-l border-glass-border p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button onClick={onClose} className="text-gray-400">✕</button>
      </div>

      <label className="block text-sm text-gray-400 mb-2">Syntax</label>
      <select value={settings.syntax || 'javascript'} onChange={(e) => change('syntax', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value="plaintext">Plain Text</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Tab Size</label>
      <select value={String(settings.tabSize || 2)} onChange={(e) => change('tabSize', Number(e.target.value))} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value={2}>2</option>
        <option value={4}>4</option>
        <option value={8}>8</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Theme</label>
      <select value={settings.theme || 'monokai'} onChange={(e) => change('theme', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value="monokai">monokai</option>
        <option value="one-dark">one-dark</option>
        <option value="light">light</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Keymap</label>
      <select value={settings.keymap || 'sublime'} onChange={(e) => change('keymap', e.target.value)} className="w-full p-2 rounded bg-dark-bg/60 border border-gray-700">
        <option value="sublime">sublime</option>
        <option value="vim">vim</option>
        <option value="emacs">emacs</option>
      </select>
  
      <hr className="my-4 border-glass-border" />

      <label className="block text-sm text-gray-400 mb-2">Font Family</label>
      <select value={settings.fontFamily || 'Fira Code'} onChange={(e) => change('fontFamily', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value="Fira Code">Fira Code</option>
        <option value="JetBrains Mono">JetBrains Mono</option>
        <option value="Inter">Inter</option>
        <option value="monospace">System</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Font Size</label>
      <select value={String(settings.fontSize || 13)} onChange={(e) => change('fontSize', Number(e.target.value))} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value={12}>12</option>
        <option value={13}>13</option>
        <option value={14}>14</option>
        <option value={16}>16</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Line Height</label>
      <select value={String(settings.lineHeight || 1.4)} onChange={(e) => change('lineHeight', Number(e.target.value))} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value={1.2}>1.2</option>
        <option value={1.4}>1.4</option>
        <option value={1.6}>1.6</option>
      </select>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.wordWrap} onChange={(e) => change('wordWrap', e.target.checked)} />
        <span>Word wrap</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.showLineNumbers} onChange={(e) => change('showLineNumbers', e.target.checked)} />
        <span>Show line numbers</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.softTabs} onChange={(e) => change('softTabs', e.target.checked)} />
        <span>Use spaces for Tab (soft tabs)</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.autoSave} onChange={(e) => change('autoSave', e.target.checked)} />
        <span>Auto-save</span>
      </label>

      {settings.autoSave && (
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Auto-save interval (seconds)</label>
          <input type="number" min={1} value={settings.autoSaveInterval || 5} onChange={(e) => change('autoSaveInterval', Number(e.target.value))} className="w-full p-2 rounded bg-dark-bg/60 border border-gray-700" />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
