import React from 'react';
import { Briefcase, FileText, GraduationCap, TrendingUp } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Upload Resume
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          title="Resumes"
          value="5"
          description="Total uploaded resumes"
        />
        <StatCard
          icon={<Briefcase className="h-6 w-6" />}
          title="Job Matches"
          value="12"
          description="Potential job matches"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Skills Match"
          value="85%"
          description="Average skills match rate"
        />
        <StatCard
          icon={<GraduationCap className="h-6 w-6" />}
          title="Recommendations"
          value="3"
          description="Course recommendations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <SkillGapAnalysis />
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
  const activities = [
    { id: 1, type: 'Resume Upload', date: '2h ago', description: 'Frontend Developer Resume.pdf' },
    { id: 2, type: 'Job Match', date: '5h ago', description: 'Senior React Developer at TechCorp' },
    { id: 3, type: 'Skill Gap', date: '1d ago', description: 'GraphQL identified as missing skill' },
  ];

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
                {activity.description} • {activity.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillGapAnalysis() {
  const skills = [
    { name: 'React', match: 90 },
    { name: 'TypeScript', match: 85 },
    { name: 'Node.js', match: 70 },
    { name: 'GraphQL', match: 40 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Skill Gap Analysis</h2>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.match}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${skill.match}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}