import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, BarChart2, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart2 className="h-8 w-8" />
            <span className="font-bold text-xl">SkillMatch</span>
          </Link>
          
          <div className="flex space-x-8">
            <Link to="/resumes" className="flex items-center space-x-1 hover:text-indigo-200">
              <FileText className="h-5 w-5" />
              <span>Resumes</span>
            </Link>
            <Link to="/jobs" className="flex items-center space-x-1 hover:text-indigo-200">
              <Briefcase className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 hover:text-indigo-200">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}