import { useEffect, useState } from 'react';
import { jobApi } from '../pages/api';
import { Job } from '../types';

export function Profile() {
  const [applications, setApplications] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await jobApi.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
      <div className="space-y-4">
        {applications.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Applied on {new Date(job.applicationStatus!.applicationDate!).toLocaleDateString()}</p>
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  {job.applicationStatus!.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}