import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

export function ResumeUpload() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('resume', acceptedFiles[0]);

    // TODO: Implement API call to upload resume
    fetch('/api/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Resume</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <Upload className="h-12 w-12 text-blue-500 mb-4" />
          ) : (
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
          )}
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop your resume here'
              : 'Drag & drop your resume here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX</p>
        </div>
      </div>
    </div>
  );
}