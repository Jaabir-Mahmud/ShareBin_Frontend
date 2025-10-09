import React from 'react';

// settings: { syntax, tabSize, theme, keymap }
const SettingsPanel = ({ visible, onClose, settings = {}, onChange }) => {
  if (!visible) return null;

  const change = (key, value) => {
    if (onChange) onChange(key, value);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-dark-bg/90 backdrop-blur-sm border-l border-glass-border p-4 z-50 overflow-y-auto">
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
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="sql">SQL</option>
        <option value="markdown">Markdown</option>
        <option value="json">JSON</option>
        <option value="yaml">YAML</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Tab Size</label>
      <select value={String(settings.tabSize || 2)} onChange={(e) => change('tabSize', Number(e.target.value))} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={4}>4</option>
        <option value={8}>8</option>
        <option value={16}>16</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Theme</label>
      <select value={settings.theme || 'monokai'} onChange={(e) => change('theme', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value="monokai">Monokai</option>
        <option value="one-dark">One Dark</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="github">GitHub</option>
        <option value="solarized">Solarized</option>
        <option value="dracula">Dracula</option>
        <option value="nord">Nord</option>
        <option value="material">Material</option>
        <option value="cobalt">Cobalt</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Keymap</label>
      <select value={settings.keymap || 'sublime'} onChange={(e) => change('keymap', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value="sublime">Sublime</option>
        <option value="vim">Vim</option>
        <option value="emacs">Emacs</option>
        <option value="vscode">VS Code</option>
        <option value="atom">Atom</option>
      </select>
  
      <hr className="my-4 border-glass-border" />

      <label className="block text-sm text-gray-400 mb-2">Font Family</label>
      <select value={settings.fontFamily || 'Fira Code'} onChange={(e) => change('fontFamily', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value="Fira Code">Fira Code</option>
        <option value="JetBrains Mono">JetBrains Mono</option>
        <option value="Inter">Inter</option>
        <option value="monospace">System Monospace</option>
        <option value="Consolas">Consolas</option>
        <option value="Monaco">Monaco</option>
        <option value="Source Code Pro">Source Code Pro</option>
        <option value="Ubuntu Mono">Ubuntu Mono</option>
        <option value="Courier New">Courier New</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Font Size</label>
      <select value={String(settings.fontSize || 13)} onChange={(e) => change('fontSize', Number(e.target.value))} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value={10}>10</option>
        <option value={11}>11</option>
        <option value={12}>12</option>
        <option value={13}>13</option>
        <option value={14}>14</option>
        <option value={16}>16</option>
        <option value={18}>18</option>
        <option value={20}>20</option>
        <option value={24}>24</option>
      </select>

      <label className="block text-sm text-gray-400 mb-2">Line Height</label>
      <select value={String(settings.lineHeight || 1.4)} onChange={(e) => change('lineHeight', Number(e.target.value))} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
        <option value={1.0}>1.0</option>
        <option value={1.2}>1.2</option>
        <option value={1.4}>1.4</option>
        <option value={1.6}>1.6</option>
        <option value={1.8}>1.8</option>
        <option value={2.0}>2.0</option>
      </select>

      <hr className="my-4 border-glass-border" />

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

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.minimap} onChange={(e) => change('minimap', e.target.checked)} />
        <span>Show minimap</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.highlightActiveLine} onChange={(e) => change('highlightActiveLine', e.target.checked)} />
        <span>Highlight active line</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.showInvisibles} onChange={(e) => change('showInvisibles', e.target.checked)} />
        <span>Show invisibles</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <input type="checkbox" checked={!!settings.scrollPastEnd} onChange={(e) => change('scrollPastEnd', e.target.checked)} />
        <span>Scroll past end</span>
      </label>

      {settings.autoSave && (
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Auto-save interval (seconds)</label>
          <input type="number" min={1} value={settings.autoSaveInterval || 5} onChange={(e) => change('autoSaveInterval', Number(e.target.value))} className="w-full p-2 rounded bg-dark-bg/60 border border-gray-700" />
        </div>
      )}

      <hr className="my-4 border-glass-border" />

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Editor Width</label>
        <select value={settings.editorWidth || 'normal'} onChange={(e) => change('editorWidth', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
          <option value="narrow">Narrow</option>
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
          <option value="full">Full Width</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Indentation Guides</label>
        <select value={settings.indentGuides || 'none'} onChange={(e) => change('indentGuides', e.target.value)} className="w-full p-2 mb-4 rounded bg-dark-bg/60 border border-gray-700">
          <option value="none">None</option>
          <option value="dotted">Dotted</option>
          <option value="solid">Solid</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsPanel;
