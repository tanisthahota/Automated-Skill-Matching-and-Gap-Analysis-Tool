import React from 'react';
import { Briefcase, MapPin, Star, Clock } from 'lucide-react';

export function Jobs() {
  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      matchRate: 90,
      posted: '2 days ago',
      skills: ['React', 'TypeScript', 'GraphQL'],
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupX',
      location: 'Remote',
      matchRate: 75,
      posted: '1 week ago',
      skills: ['Node.js', 'React', 'MongoDB'],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Job Matches</h1>
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded-lg px-4 py-2">
            <option>All Locations</option>
            <option>Remote Only</option>
            <option>On-site Only</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-4 py-2">
            <option>Match Rate: High to Low</option>
            <option>Most Recent</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.posted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-indigo-600">
                    {job.matchRate}%
                  </span>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}