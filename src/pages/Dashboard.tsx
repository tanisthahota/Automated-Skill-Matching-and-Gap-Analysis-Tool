import React, { useEffect, useState } from 'react';
import { Briefcase, FileText, GraduationCap, TrendingUp } from 'lucide-react';
import api from './api';
import { Activity, CourseRecommendation } from '../types';
import { Courses } from './Courses';
import { RecommendationsModal } from '../components/RecommendationsModal';

export function Dashboard() {
  const [data, setData] = useState({ 
    resumes: 0, 
    jobMatches: 0, 
    skillsMatch: 0, 
    recommendations: [] 
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  const fetchData = async () => {
    try {
      const [dashboardData, recommendationsData] = await Promise.all([
        api.get('/dashboard'),
        api.get<CourseRecommendation[]>('/course-recommendations')
      ]);
      
      setData({
        ...dashboardData.data,
        recommendations: recommendationsData.data.map((rec: CourseRecommendation) => rec.Skill_Name)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add event listener for resume changes
  useEffect(() => {
    const handleResumeChange = () => {
      fetchData();
    };

    window.addEventListener('resumeChange', handleResumeChange);
    return () => window.removeEventListener('resumeChange', handleResumeChange);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <a href="/resumes">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Upload Resume
        </button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          title="Resumes"
          value={data.resumes.toString()}
          description="Total uploaded resumes"
        />
        <StatCard
          icon={<Briefcase className="h-6 w-6" />}
          title="Job Matches"
          value={data.jobMatches.toString()}
          description="Potential job matches"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Skills Match"
          value={`${data.skillsMatch.toFixed(2)}%`}
          description="Average skills match rate"
        />
        <div onClick={() => setShowRecommendations(true)} className="cursor-pointer">
          <StatCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="Recommendations"
            value={data.recommendations.length.toString()}
            description="Course recommendations"
          />
        </div>
      </div>

      <RecommendationsModal 
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        recommendations={data.recommendations}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <div className="space-y-8">
          {/* <SkillGapAnalysis /> */}
          <Courses />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, description }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/recent-activity');
        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch recent activities:', error);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">{activity.type}</p>
              <p className="text-sm text-gray-500">
                {activity.description} • {new Date(activity.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// function SkillGapAnalysis() {
//   const [skills, setSkills] = useState<Skill[]>([]);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await api.get('/skill-gap-analysis');
//         setSkills(response.data);
//       } catch (error) {
//         console.error('Failed to fetch skill gap analysis:', error);
//       }
//     };
//     fetchSkills();
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Skill Gap Analysis</h2>
//       <div className="space-y-4">
//         {skills.map((skill) => (
//           <div key={skill.name} className="space-y-2">
//             <div className="flex justify-between">
//               <span className="text-sm font-medium text-gray-700">{skill.name}</span>
//               <span className="text-sm text-gray-500">{skill.match}%</span>
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full">
//               <div
//                 className="h-2 bg-indigo-600 rounded-full"
//                 style={{ width: `${skill.match}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }