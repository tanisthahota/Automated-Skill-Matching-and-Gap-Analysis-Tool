import React from 'react';
import { FileText, Upload, Trash2 } from 'lucide-react';

export function Resumes() {
  const resumes = [
    {
      id: '1',
      name: 'Frontend Developer Resume.pdf',
      uploadDate: '2024-03-15',
      skills: ['React', 'TypeScript', 'CSS'],
      matchRate: 85,
    },
    {
      id: '2',
      name: 'Full Stack Resume.pdf',
      uploadDate: '2024-03-10',
      skills: ['Node.js', 'React', 'MongoDB'],
      matchRate: 75,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Upload className="h-5 w-5" />
          <span>Upload New Resume</span>
        </button>
      </div>

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
                <h3 className="font-medium text-gray-900">{resume.name}</h3>
                <p className="text-sm text-gray-500">Uploaded on {resume.uploadDate}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resume.skills.map((skill) => (
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
              <button className="p-2 text-gray-400 hover:text-red-500">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}