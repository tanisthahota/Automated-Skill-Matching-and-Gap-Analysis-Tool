import { useEffect, useState } from 'react';
import { FileText, Upload, Trash2 } from 'lucide-react';
import { resumeApi } from '../pages/api';
import { ResumeUpload } from '../components/ResumeUpload';
import { Resume } from '../types';

interface ResumeWithMatch extends Resume {
  matchRate: number;
  skills: string[];
  uploadDate: string;
}

export function Resumes() {
  const [resumes, setResumes] = useState<ResumeWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await resumeApi.getAll();
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await resumeApi.delete(id);
      loadResumes();
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
        <button 
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Upload className="h-5 w-5" />
          <span>Upload New Resume</span>
        </button>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <ResumeUpload />
            <button 
              onClick={() => setShowUpload(false)}
              className="w-full p-4 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(resume.uploadDate).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resume.skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Match Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{resume.matchRate}%</p>
              </div>
              <button 
                onClick={() => handleDelete(resume.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}