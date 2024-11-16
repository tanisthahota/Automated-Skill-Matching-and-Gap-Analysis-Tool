import React from 'react';
import { Briefcase, MapPin, Star } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  matchRate: number;
}

interface JobListProps {
  jobs: Job[];
  onApply: (jobId: string) => void;
}

export function JobList({ jobs, onApply }: JobListProps) {
  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <div key={job.id} className="card p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <div className="flex items-center text-gray-500 space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.skills.length} required skills</span>
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
              <button
                onClick={() => onApply(job.id)}
                className="btn-primary"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}