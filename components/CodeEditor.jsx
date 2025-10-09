import React, { useState, useEffect, useRef } from 'react';

const highlightKeywords = (text, syntax = 'javascript') => {
  let keywords = ['const', 'let', 'var', 'function', 'return', 'import', 'from', 'export', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'default'];
  if (syntax === 'python') {
    keywords = ['def', 'return', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'class', 'self'];
  }
  // Add more language-specific keywords as needed
  if (syntax === 'java') {
    keywords = [...keywords, 'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void'];
  }
  if (syntax === 'cpp') {
    keywords = [...keywords, 'public', 'private', 'protected', 'class', 'struct', 'template', 'namespace', 'using', 'std', 'cout', 'cin'];
  }
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  const commentsRegex = syntax === 'python' ? /(#.*)/g : /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  const stringsRegex = /('.*?'|".*?"|`.*?`)/g;

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(keywordRegex, '<span class="text-accent-purple">$1</span>')
    .replace(commentsRegex, '<span class="text-green-400">$1</span>')
    .replace(stringsRegex, '<span class="text-cyan-300">$1</span>');
};

const CodeEditor = ({ 
  value, 
  onChange, 
  syntax = 'javascript', 
  tabSize = 2, 
  theme = 'monokai', 
  keymap = 'sublime', 
  fontFamily = 'Fira Code', 
  fontSize = 13, 
  lineHeight = 1.4, 
  wordWrap = true, // Changed default to true
  showLineNumbers = true,
  minimap = false,
  highlightActiveLine = true,
  showInvisibles = false,
  scrollPastEnd = false,
  editorWidth = 'normal',
  indentGuides = 'none'
}) => {
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines > 0 ? lines : 1);
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const insert = ' '.repeat(tabSize);
      const newVal = el.value.substring(0, start) + insert + el.value.substring(end);
      onChange(newVal);
      // set caret after inserted spaces
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + insert.length;
      });
    }
  };

  // Ensure the textarea has the correct styling
  const textAreaStyle = {
    padding: '1rem',
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}`,
  };

  // Apply theme-based styling
  let themeClasses = '';
  switch (theme) {
    case 'monokai':
      themeClasses = 'bg-gray-900 text-gray-100';
      break;
    case 'one-dark':
      themeClasses = 'bg-gray-800 text-gray-100';
      break;
    case 'light':
      themeClasses = 'bg-white text-gray-800';
      break;
    case 'dark':
      themeClasses = 'bg-gray-900 text-gray-100';
      break;
    case 'github':
      themeClasses = 'bg-white text-gray-800';
      break;
    case 'solarized':
      themeClasses = 'bg-yellow-50 text-gray-800';
      break;
    case 'dracula':
      themeClasses = 'bg-purple-900 text-purple-100';
      break;
    case 'nord':
      themeClasses = 'bg-blue-900 text-blue-100';
      break;
    case 'material':
      themeClasses = 'bg-gray-800 text-gray-100';
      break;
    case 'cobalt':
      themeClasses = 'bg-blue-900 text-blue-100';
      break;
    default:
      themeClasses = 'bg-dark-bg text-gray-300';
  }

  // Apply editor width class
  let editorWidthClass = '';
  switch (editorWidth) {
    case 'narrow':
      editorWidthClass = 'max-w-3xl mx-auto';
      break;
    case 'wide':
      editorWidthClass = 'max-w-6xl mx-auto';
      break;
    case 'full':
      editorWidthClass = 'w-full';
      break;
    default:
      editorWidthClass = 'max-w-5xl mx-auto';
  }

  // Apply indent guides if enabled
  let indentGuideStyle = {};
  if (indentGuides === 'dotted') {
    indentGuideStyle.backgroundImage = 'linear-gradient(to bottom, transparent 50%, rgba(128, 128, 128, 0.2) 50%)';
    indentGuideStyle.backgroundSize = '1px 24px';
  } else if (indentGuides === 'solid') {
    indentGuideStyle.backgroundImage = 'linear-gradient(to bottom, transparent 50%, rgba(128, 128, 128, 0.4) 50%)';
    indentGuideStyle.backgroundSize = '1px 24px';
  }

  return (
    <div className={`relative h-full w-full flex flex-col rounded-lg overflow-hidden ${editorWidthClass}`}>
      <div className="flex-1 flex overflow-hidden">
        {showLineNumbers && (
          <div className="line-numbers bg-gray-900/50 text-gray-500 p-4 text-right select-none" style={{ minWidth: 48 }}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-5">{i + 1}</div>
            ))}
          </div>
        )}
        <div className="relative flex-1 h-full overflow-auto" style={indentGuideStyle}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full h-full ${themeClasses} caret-accent-cyan resize-none outline-none font-mono ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'} ${highlightActiveLine ? 'active-line-highlight' : ''} ${showInvisibles ? 'show-invisibles' : ''}`}
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Start typing your code here..."
            style={textAreaStyle}
          />
        </div>
        {minimap && (
          <div className="minimap bg-gray-900/50 w-24 p-2 text-xs text-gray-500 hidden md:block">
            {value.split('\n').slice(0, 50).map((line, i) => (
              <div key={i} className="truncate">{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;