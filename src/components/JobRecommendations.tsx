import { useEffect, useState } from 'react';
import { Star, MapPin} from 'lucide-react';
import { jobApi } from '../pages/api';
import { Job } from '../types';

export function JobRecommendations() {
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await jobApi.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
      <div className="grid gap-4">
        {recommendations.map((job) => (
          <div key={job.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-bold text-indigo-600">{job.matchRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}