import React, { useState } from 'react';
import { Search, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onSearchClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: 'Find Instructors', href: '/', active: location.pathname === '/' },
    { label: 'Browse Cities', href: '/cities', active: location.pathname === '/cities' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Instructors', href: '/instructor', active: location.pathname === '/instructor' },
  ];

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Scroll to section or navigate to home first
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      {/* Top contact bar */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hi@drivelessons.com.au</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Serving all of Australia</span>
              <span className="mx-2">|</span>
              <button
                onClick={() => navigate('/login')}
                className="underline hover:text-blue-200 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-xl mr-3 group-hover:shadow-lg transition-all duration-200">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Drive Lessons
              </span>
              <p className="text-sm text-gray-600 hidden sm:block">
                Australia's Driving Instructor Directory
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`font-medium transition-colors duration-200 hover:text-blue-600 ${
                  item.active ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onSearchClick || (() => navigate('/'))}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Search className="h-4 w-4" />
              Instructors Near Me
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left font-medium py-2 transition-colors duration-200 hover:text-blue-600 ${
                  item.active ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (onSearchClick) onSearchClick();
                  else navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Find Instructors
              </button>
            </div>
            
            {/* Mobile contact info */}
            <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1800 DRIVE (1800 374 838)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@drivingdirectory.com.au</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;