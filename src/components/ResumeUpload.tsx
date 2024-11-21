import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { resumeApi } from '../pages/api';

export function ResumeUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setError('');
      setSuccess(false);
      
      await resumeApi.upload(acceptedFiles[0]);
      setSuccess(true);
      setTimeout(() => window.location.reload(), 1500); // Refresh after success message
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Resume</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          Resume uploaded successfully!
        </div>
      )}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <Upload className="h-12 w-12 text-blue-500 mb-4" />
          ) : (
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
          )}
          <p className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 
              isDragActive ? 'Drop your resume here' : 
              'Drag & drop your resume here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX</p>
        </div>
      </div>
    </div>
  );
}