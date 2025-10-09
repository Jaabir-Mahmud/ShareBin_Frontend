import React, { useState, useCallback } from 'react';
import { UploadIcon, CopyIcon } from '../components/icons.jsx';

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareableLink, setShareableLink] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setShareableLink('');
      setProgress(0);
    }
  };

  const handleUpload = useCallback(() => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    // Simulate file upload
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShareableLink(`${window.location.origin}/files/${file.name.replace(/\s/g, '_')}-${Math.random().toString(36).substring(2, 10)}`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, [file]);

  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const dropzoneClasses = `flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-accent-cyan bg-accent-cyan/10' : 'border-gray-600 hover:border-accent-purple hover:bg-accent-purple/10'}`;

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-2">Upload & Share</h1>
      <p className="text-gray-400 mb-8">Drag & drop any file to generate a shareable link.</p>

      {!shareableLink && (
        <div 
          className={dropzoneClasses}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            className="hidden" 
            id="file-upload"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          />
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <UploadIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold text-lg">
              {file ? file.name : "Click to select or drag & drop"}
            </p>
            <p className="text-sm text-gray-500">Any file type up to 100MB (simulated)</p>
          </label>
        </div>
      )}

      {file && !shareableLink && (
        <div className="mt-8 max-w-2xl mx-auto">
          {isUploading ? (
            <div>
              <p className="mb-2">Uploading...</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-accent-purple to-accent-cyan h-2.5 rounded-full" 
                  style={{ width: `${progress}%`, transition: 'width 0.2s ease-in-out' }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="px-8 py-3 bg-accent-cyan text-dark-bg font-bold rounded-lg hover:bg-opacity-80 transition-all"
            >
              Upload File
            </button>
          )}
        </div>
      )}
      
      {shareableLink && (
        <div className="mt-8 max-w-2xl mx-auto glassmorphism p-6 rounded-lg animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Upload Complete!</h2>
          <p className="mb-4">Your shareable link is ready:</p>
          <div className="flex items-center justify-center bg-gray-900 rounded-lg p-2">
            <input 
              type="text" 
              readOnly 
              value={shareableLink} 
              className="bg-transparent text-accent-cyan w-full outline-none font-mono" 
            />
            <button onClick={copyLinkToClipboard} className="p-2 rounded-md hover:bg-white/20 transition-colors">
              <CopyIcon className="w-6 h-6" />
            </button>
          </div>
          {copySuccess && <p className="text-green-400 mt-2">Copied to clipboard!</p>}
          <button 
            onClick={() => { setFile(null); setShareableLink(''); }}
            className="mt-6 px-6 py-2 text-sm border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
          >
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;