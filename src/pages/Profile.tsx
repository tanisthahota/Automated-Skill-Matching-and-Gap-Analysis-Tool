import React from 'react';
import { User, Mail, Phone, MapPin, Book } from 'lucide-react';

export function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            </div>
          </div>
          <button className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Skills</h2>
          <button className="text-indigo-600 hover:text-indigo-700">
            Add Skill
          </button>
        </div>
        <div className="grid gap-4">
          {user.skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Book className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  <p className="text-sm text-gray-500">{skill.level}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}