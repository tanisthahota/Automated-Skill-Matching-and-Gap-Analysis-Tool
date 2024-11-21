import { useEffect, useState } from 'react';
import { jobApi } from './api';
import { JobPostForm } from '../components/JobPostForm';
import { Job } from '../types';
import { JobRecommendations } from '../components/JobRecommendations';
import { JobList } from '../components/JobList';
import { JobDetails } from '../components/JobDetails';

export function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'matchRate' | 'date'>('matchRate');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobApi.getAll();
      // Fetch application status for each job
      const jobsWithStatus = await Promise.all(
        data.map(async (job : any) => {
          const status = await jobApi.getApplicationStatus(job.id);
          return {
            ...job,
            applicationStatus: status
          };
        })
      );
      setJobs(jobsWithStatus);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (jobData: {
    title: string;
    description: string;
    location: string;
    skills: string[];
  }) => {
    try {
      await jobApi.create(jobData);
      setShowPostForm(false);
      loadJobs();
    } catch (error) {
      console.error('Failed to post job:', error);
    }
  };

  const filteredJobs = jobs
    .filter(job => 
      locationFilter === 'all' || 
      (locationFilter === 'remote' && job.location.toLowerCase().includes('remote')) ||
      (locationFilter === 'onsite' && !job.location.toLowerCase().includes('remote'))
    )
    .sort((a, b) => 
      sortBy === 'matchRate' ? 
        b.matchRate - a.matchRate : 
        new Date(b.posted).getTime() - new Date(a.posted).getTime()
    );
    const handleApply = async (jobId: string, resumeId: string) => {
      try {
        await jobApi.apply(jobId, resumeId);
        setSelectedJob(null);
        loadJobs();
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to apply for job');
      }
    };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main job listing section */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Job Matches</h1>
            <div className="flex space-x-4">
              {user.role === 'Recruiter' && (
                <button 
                  onClick={() => setShowPostForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Post New Job
                </button>
              )}
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site Only</option>
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'matchRate' | 'date')}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="matchRate">Match Rate: High to Low</option>
                <option value="date">Most Recent</option>
              </select>
            </div>
          </div>

          <JobList 
            jobs={filteredJobs} 
            onApply={async (jobId) => {
              const job = jobs.find(j => j.id === jobId);
              if (job) {
                setSelectedJob(job);
              }
            }}
            onShowDetails={handleJobClick}
          />
        </div>

        {/* Recommendations sidebar */}
        <div className="lg:col-span-1">
          <JobRecommendations />
        </div>
      </div>

      {/* Job post form modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <JobPostForm onSubmit={handlePostJob} />
            <button 
              onClick={() => setShowPostForm(false)}
              className="mt-4 w-full p-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
}