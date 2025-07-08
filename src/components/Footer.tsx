import React, { useState } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Shield,
  Award,
  Users,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your backend
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { label: 'Find Instructors', href: '/' },
    { label: 'All Instructors', href: '/all' },
    { label: 'Browse Cities', href: '/cities' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Instructors', href: '/instructor' },
    { label: 'Blogs', href: '/blog' },
  ];

  const supportLinks = [
    { label: 'Help Center', href: '#help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Safety Guidelines', href: '#safety' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Privacy Policy', href: '#privacy' },
  ];

  const features = [
    { icon: <Shield className="h-5 w-5" />, text: 'Verified Instructors' },
    { icon: <Award className="h-5 w-5" />, text: 'Top Rated Professionals' },
    { icon: <Users className="h-5 w-5" />, text: 'Thousands of Students' },
    { icon: <MessageCircle className="h-5 w-5" />, text: 'Instant Contact' },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-xl mr-3">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">DriveLessons</h3>
                <p className="text-gray-400 text-sm">Australia's #1 Driving Directory</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting learner drivers with Australia's best driving instructors. 
              Find verified, experienced professionals in your area and start your 
              journey to getting your license today.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-gray-800 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 transition-all duration-200 group"
                >
                  <div className="text-gray-400 group-hover:text-white transition-colors">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <h5 className="font-semibold text-white">Contact Info</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>0411253155</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>hi@drivingdirectory.com.au</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>Wellard, WA, Australia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Get the latest tips, news, and updates about driving lessons and road safety.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <button
                type="submit"
                disabled={isSubscribed}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribed ? (
                  <>
                    <span>✓ Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">Secure & Trusted</span>
                </div>
                <p className="text-xs text-gray-400">
                  All instructors are verified and background checked
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>© 2025 DriveLessons Australia. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <button 
                onClick={() => handleLinkClick('#terms')}
                className="hover:text-white transition-colors"
              >
                Terms
              </button>
              <button 
                onClick={() => handleLinkClick('#privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy
              </button>
              <button 
                onClick={() => handleLinkClick('#cookies')}
                className="hover:text-white transition-colors"
              >
                Cookies
              </button>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">Made with ❤️ in Australia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;