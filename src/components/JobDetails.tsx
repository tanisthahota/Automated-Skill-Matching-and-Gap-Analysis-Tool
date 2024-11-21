import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, X } from 'lucide-react';
import { Job, Resume } from '../types';
import { resumeApi } from '../pages/api';

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onApply: (jobId: string, resumeId: string) => Promise<void>;
}

export function JobDetails({ job, onClose, onApply }: JobDetailsProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [useLatestResume, setUseLatestResume] = useState(true);
  const [showResumeSelector, setShowResumeSelector] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await resumeApi.getAll();
        setResumes(data);
        setSelectedResume(data[0]); // Default to the latest resume
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      }
    };
    fetchResumes();
  }, []);

  const handleApplyClick = () => {
    if (useLatestResume) {
      handleApply(resumes[0].id);
    } else {
      setShowResumeSelector(true);
    }
  };

  const handleApply = async (resumeId: string) => {
    try {
      await onApply(job.id, resumeId);
      onClose();
    } catch (error) {
      console.error('Failed to apply:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-lg text-gray-600">{job.company}</p>
          </div>

          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-5 w-5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-5 w-5" />
              <span>{job.posted}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-bold text-indigo-600">{job.matchRate}% Match</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useLatest"
                checked={useLatestResume}
                onChange={(e) => setUseLatestResume(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="useLatest" className="text-sm text-gray-700">
                Use latest resume
              </label>
            </div>

            <button
              onClick={handleApplyClick}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Apply Now
            </button>
          </div>
        </div>

        {showResumeSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Select Resume</h3>
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => handleApply(resume.id)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <h4 className="font-medium">{resume.fileName}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {resume.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowResumeSelector(false)}
                className="mt-4 w-full p-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}