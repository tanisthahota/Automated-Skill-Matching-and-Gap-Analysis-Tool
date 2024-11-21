import { useEffect, useState } from 'react';
import { User, Mail, Briefcase, Trash2 } from 'lucide-react';
import api, { jobApi } from '../pages/api';
import { Job } from '../types';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [applications, setApplications] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
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

  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await jobApi.deleteApplication(applicationId);
        setApplications(applications.filter(app => app.id !== applicationId));
      } catch (error) {
        console.error('Failed to delete application:', error);
        alert('Failed to delete application');
      }
    }
  };

  if (loading || !userData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{userData.role}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => alert('Edit profile functionality coming soon!')}
            className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-gray-500">No applications yet</p>
          ) : (
            applications.map((job) => (
              <div key={job.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Resume used: {job.applicationStatus?.resumeName || 'Not available'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills?.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-right">
                      <p className="text-gray-500">
                        {job.applicationStatus?.applicationDate ? 
                          `Applied on ${new Date(job.applicationStatus.applicationDate).toLocaleDateString()}` :
                          'Application date not available'
                        }
                      </p>
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        {job.applicationStatus?.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteApplication(job.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}