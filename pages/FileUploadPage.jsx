import React, { useState, useCallback } from 'react';
import { UploadIcon, CopyIcon, BackIcon, DownloadIcon } from '../components/icons.jsx';

const FileUploadPage = ({ navigateTo }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleFilesChange = (selectedFiles) => {
    if (selectedFiles && selectedFiles.length > 0) {
      // Convert FileList to Array
      const filesArray = Array.from(selectedFiles);
      setFiles(filesArray);
      setUploadResults([]);
      setProgress(0);
      setUploadError('');
    }
  };

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    setUploadError('');
    setUploadResults([]);

    try {
      // Create FormData for multiple file upload
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Use relative URL for both development and production with Vercel
      const apiUrl = '/api/upload';

      // Upload files to backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // Set the upload results from the backend response
      setUploadResults(data.files);
      setIsUploading(false);
      setProgress(100);
    } catch (error) {
      setUploadError('Failed to upload files. Please try again.');
      setIsUploading(false);
      setProgress(0);
    }
  }, [files]);

  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesChange(e.dataTransfer.files);
    }
  };

  const copyLinkToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    setCopySuccess(link);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const dropzoneClasses = `flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-accent-cyan bg-accent-cyan/10' : 'border-gray-600 hover:border-accent-purple hover:bg-accent-purple/10'}`;

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Upload & Share</h1>
        <button 
          onClick={() => navigateTo && navigateTo('home')}
          className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-dark-bg rounded-md hover:bg-cyan-500 transition-colors"
        >
          <BackIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
      
      <p className="text-gray-400 mb-8">Drag & drop files to generate shareable links.</p>

      {!uploadResults.length && (
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
            onChange={(e) => handleFilesChange(e.target.files)}
            multiple
          />
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <UploadIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold text-lg">
              {files.length > 0 ? `${files.length} file(s) selected` : "Click to select or drag & drop"}
            </p>
            <p className="text-sm text-gray-500">Any file type up to 500MB each</p>
          </label>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-300">
          {uploadError}
        </div>
      )}

      {files.length > 0 && uploadResults.length === 0 && (
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleUpload}
                className="px-8 py-3 bg-accent-cyan text-dark-bg font-bold rounded-lg hover:bg-opacity-80 transition-all"
              >
                Upload Files
              </button>
              <button
                onClick={() => navigateTo && navigateTo('home')}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-accent-cyan text-dark-bg font-bold rounded-lg hover:bg-cyan-500 transition-all"
              >
                <BackIcon className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {uploadResults.length > 0 && (
        <div className="mt-8 max-w-4xl mx-auto glassmorphism p-6 rounded-lg animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Upload Complete!</h2>
          <p className="mb-4">Your shareable links are ready:</p>
          
          <div className="space-y-4 mb-6">
            {uploadResults.map((result, index) => (
              <div key={result.fileId} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.fileName}</p>
                  <p className="text-sm text-gray-400 truncate">{result.shareableLink}</p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button 
                    onClick={() => copyLinkToClipboard(result.shareableLink)} 
                    className="p-2 rounded-md hover:bg-white/20 transition-colors"
                    title="Copy link"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                  <a 
                    href={result.shareableLink.replace('/files/', '/download/')} 
                    download={result.fileName}
                    className="flex items-center justify-center p-2 bg-accent-cyan text-dark-bg rounded-md hover:bg-cyan-500 transition-colors"
                    title="Download file"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href={result.shareableLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 bg-green-500 text-dark-bg rounded-md hover:bg-green-600 transition-colors"
                    title="Open file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {copySuccess && <p className="text-green-400 mb-4">Link copied to clipboard!</p>}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => { setFiles([]); setUploadResults([]); }}
              className="px-6 py-2 text-sm border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Upload More Files
            </button>
            <button 
              onClick={() => navigateTo && navigateTo('home')}
              className="flex items-center justify-center gap-2 px-6 py-2 text-sm bg-accent-cyan text-dark-bg rounded-md hover:bg-cyan-500 transition-colors"
            >
              <BackIcon className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;