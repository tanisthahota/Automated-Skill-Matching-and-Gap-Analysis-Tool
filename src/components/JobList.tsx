import { MapPin, Star, Clock } from 'lucide-react';
import { Job } from '../types';

interface JobListProps {
  jobs: Job[];
  onApply: (jobId: string) => Promise<void>;
  onShowDetails: (job: Job) => void;
}

export function JobList({ jobs, onApply, onShowDetails }: JobListProps) {
  const handleApply = async (jobId: string) => {
    try {
      await onApply(jobId);
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  const getStatusButton = (job: Job) => {
    if (!job.applicationStatus?.applied) {
      return (
        <button
          onClick={() => handleApply(job.id)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Apply Now
        </button>
      );
    }

    return (
      <div className="text-sm text-gray-600">
        Applied {new Date(job.applicationStatus.applicationDate!).toLocaleDateString()}
        <span className="ml-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
          {job.applicationStatus.status}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 
                className="text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer"
                onClick={() => onShowDetails(job)}
              >
                {job.title}
              </h3>
              <p className="text-gray-600">{job.company}</p>
              <div className="flex items-center text-gray-500 space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.posted}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
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

            <div className="flex flex-col items-end space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-blue-600">
                  {job.matchRate}%
                </span>
              </div>
              {getStatusButton(job)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}