import React, { useState, useEffect, useRef } from 'react';

const highlightKeywords = (text, syntax = 'javascript') => {
  let keywords = ['const', 'let', 'var', 'function', 'return', 'import', 'from', 'export', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'default'];
  if (syntax === 'python') {
    keywords = ['def', 'return', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'class', 'self'];
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

const CodeEditor = ({ value, onChange, syntax = 'javascript', tabSize = 2, theme = 'monokai', keymap = 'sublime', fontFamily = 'Fira Code', fontSize = 13, lineHeight = 1.4, wordWrap = false, showLineNumbers = true }) => {
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines > 0 ? lines : 1);
  }, [value]);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
        preRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

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

  return (
    <div className="relative h-full w-full flex flex-col rounded-lg overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {showLineNumbers && (
          <div className="line-numbers bg-gray-900/50 text-gray-500 p-4 text-right select-none" style={{ minWidth: 48 }}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-5">{i + 1}</div>
            ))}
          </div>
        )}
        <div className="relative flex-1 h-full">
        <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
         onKeyDown={handleKeyDown}
              onScroll={handleScroll}
          className={`absolute top-0 left-0 w-full h-full p-4 bg-dark-bg text-gray-300 caret-accent-cyan resize-none outline-none font-mono leading-6 whitespace-pre overflow-auto ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}
              spellCheck="false"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="Start typing your code here..."
           />
        <pre ref={preRef} className="absolute top-0 left-0 w-full h-full p-4 pointer-events-none overflow-auto" aria-hidden="true" data-theme={theme} style={{ fontFamily, fontSize, lineHeight }}>
          <code className="font-mono text-sm leading-6 text-gray-200" style={{ fontFamily, fontSize, lineHeight }} dangerouslySetInnerHTML={{ __html: highlightKeywords(value, syntax) + '<span class="blinking-cursor">|</span>' }} />
        </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;