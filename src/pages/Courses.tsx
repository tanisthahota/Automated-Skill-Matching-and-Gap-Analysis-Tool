import { useState, useEffect } from 'react';
import api from './api';
import { CourseRecommendation } from '../types';

export function Courses() {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get<CourseRecommendation[]>('/course-recommendations');
        const processedData = response.data.map((rec: CourseRecommendation) => ({
          ...rec,
          matchRate: rec.matchRate || 0
        }));
        setRecommendations(processedData);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);
  
    if (loading) return <div>Loading...</div>;
  
    const missingSkills = recommendations.filter(rec => rec.matchRate < 100);
  
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Course Recommendations</h1>
        
        {missingSkills.length === 0 ? (
          <p className="text-gray-500">Your skills match all available job requirements!</p>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-700">
              We recommend improving these skills to increase your job match rates:
            </p>
            <div className="grid gap-4">
              {missingSkills.map((skill, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-medium text-gray-900">{skill.Skill_Name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Required for: {skill.Job_Name}
                  </p>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${Math.max(0, Math.min(100, skill.matchRate))}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{Math.round(skill.matchRate)}% Match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }