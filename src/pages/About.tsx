import React from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export function About() {
  const teamMembers = [
    {
      name: 'Tanistha Hota',
      role: 'Student at PES University',
      usn: 'PES2UG22CS618',
      image: 'tanshita2.jpg',
      github: 'https://github.com/tanisthahota',
      linkedin: 'https://www.linkedin.com/in/tanistha-hota-471a95250',
      email: 'mailto:hotatanistha@gmail.com'
    },
    {
      name: 'Suhit Hegde',
      role: 'Student at PES University',
      usn: 'PES2UG22CS591',
      image: 'susu2.png',
      github: 'https://github.com/EscVel',
      linkedin: 'https://www.linkedin.com/in/suhit-hegde-a63446297',
      email: 'mailto:suhithegde@gmail.com'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Our Project
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Automated Skill Matching and Gap Analysis Tool - A sophisticated platform
          that bridges the gap between job seekers and recruiters through intelligent
          skill analysis and matching.
        </p>
      </div>

      {/* Project Details */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
          <p className="text-gray-600 mb-6">
            Our platform uses advanced algorithms to analyze resumes and job descriptions,
            providing accurate skill matches and identifying potential skill gaps. This
            helps job seekers understand their market position and guides them towards
            relevant opportunities.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              <span className="text-gray-700">Automated Resume Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              <span className="text-gray-700">Intelligent Skill Matching</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              <span className="text-gray-700">Personalized Learning Recommendations</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Frontend</h3>
              <ul className="space-y-1 text-gray-600">
                <li>React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Lucide Icons</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Backend</h3>
              <ul className="space-y-1 text-gray-600">
                <li>Node.js</li>
                <li>Express</li>
                <li>MySQL</li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
        Meet Our Team
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center space-x-6">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <p className="text-sm text-gray-500 mb-4">{member.usn}</p>
                <div className="flex space-x-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={member.email}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Links */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Resources</h2>
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/tanisthahota/Automated-Skill-Matching-and-Gap-Analysis-Tool"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Github className="h-5 w-5" />
            <span>Source Code</span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ExternalLink className="h-5 w-5" />
            <span>Documentation</span>
          </a>
        </div>
      </div>
    </div>
  );
}