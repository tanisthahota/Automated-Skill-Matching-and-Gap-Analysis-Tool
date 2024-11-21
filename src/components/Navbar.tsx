import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, BarChart2, Info } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error("Invalid user data in localStorage:", e);
      localStorage.removeItem('user'); // Optional: Clear invalid data
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
              <Info className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 hover:text-indigo-200">
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
            <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
}