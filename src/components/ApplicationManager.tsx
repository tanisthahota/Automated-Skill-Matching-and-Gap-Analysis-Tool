import { useState, useEffect } from 'react';
import { jobApi } from '../pages/api';

interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  applicationDate: string;
  jobTitle: string;
  applicantName: string;
  matchRate: number;
}

export function ApplicationManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await jobApi.getJobApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId: string, status: Application['status']) => {
    try {
      await jobApi.updateApplicationStatus(applicationId, status);
      loadApplications();
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {applications.map((application) => (
        <div key={application.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">{application.jobTitle}</h3>
              <p className="text-gray-600">Applicant: {application.applicantName}</p>
              <p className="text-sm text-gray-500">
                Applied on {new Date(application.applicationDate).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Match Rate:</span>
                <span className="text-lg font-bold text-indigo-600">{application.matchRate}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <select
                value={application.status}
                onChange={(e) => updateStatus(application.id, e.target.value as Application['status'])}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}