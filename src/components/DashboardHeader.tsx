import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


interface DashboardHeaderProps {
  currentPage?: 'dashboard' | 'profile';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentPage }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const name = user?.user_metadata?.name || user?.email || 'User';

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <span
            className="text-2xl font-bold text-blue-700 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            DriveLessons
          </span>
          <button
            className={`text-base font-medium hover:text-blue-700 transition-colors ${currentPage === 'dashboard' ? 'text-blue-700' : 'text-gray-700'}`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-700 font-medium hidden md:inline">Welcome back, {name}</span>
          <button
            className={`text-base font-medium hover:text-blue-700 transition-colors ${currentPage === 'profile' ? 'text-blue-700 underline' : 'text-gray-700 underline'}`}
            onClick={() => navigate('/dashboard/profile')}
          >
            Edit Profile
          </button>
          <a
            href="#"
            className="text-base font-medium text-gray-700 underline hover:text-blue-700 transition-colors"
          >
            Billing
          </a>
          <button
            className="text-base font-medium text-red-600 underline hover:text-red-800 transition-colors"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
