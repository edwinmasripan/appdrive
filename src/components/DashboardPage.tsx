import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardHeader from '../components/DashboardHeader';
import { 
  User, 
  Calendar, 
  Star, 
  MessageSquare, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail,
  Edit3,
  Clock,
  Plus,
  Car,
  UserPlus,
  ExternalLink
} from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  photo_url: string;
  bio: string;
  transmission_types: string[];
  suburb: string;
  postcode: string;
  state: string;
  latitude: number;
  longitude: number;
  hourly_rate: number;
  experience_years: number;
  google_rating: number;
  google_reviews_count: number;
  payment_methods: string[];
  languages: string[];
  serving_postcodes: string[];
  auth_user_id: string;
}

interface Review {
  id: string;
  student_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Booking {
  id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
}

interface CreateInstructorProfileFormProps {
  user: any;
  onProfileCreated: () => void;
  setLoading: (loading: boolean) => void;
}

const CreateInstructorProfileForm: React.FC<CreateInstructorProfileFormProps> = ({
  user,
  onProfileCreated,
  setLoading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    bio: '',
    suburb: '',
    postcode: '',
    state: 'NSW',
    hourly_rate: 50,
    experience_years: 1,
    photo_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    transmission_types: ['auto'],
    payment_methods: ['cash', 'bank_transfer'],
    languages: ['english']
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transmissionOptions = [
    { value: 'auto', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'forklift', label: 'Forklift' }
  ];

  const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' },
    { value: 'paypal', label: 'PayPal' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'mandarin', label: 'Mandarin' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'vietnamese', label: 'Vietnamese' }
  ];

  const stateOptions = [
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' }
  ];

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      // Default coordinates for Sydney CBD (since we can't use getPostcodeCoordinates)
      const defaultLatitude = -33.8688;
      const defaultLongitude = 151.2093;

      const instructorData = {
        ...formData,
        email: user.email,
        auth_user_id: user.id,
        latitude: defaultLatitude,
        longitude: defaultLongitude,
        is_active: true,
        google_reviews_count: 0,
        google_rating: 0.0,
        serving_postcodes: [formData.postcode],
        review_keywords: []
      };

      const { error } = await supabase
        .from('instructors')
        .insert([instructorData]);

      if (error) throw error;

      onProfileCreated();
    } catch (error: any) {
      console.error('Error creating instructor profile:', error);
      setError(error.message || 'Failed to create profile. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Create Your Instructor Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Let's Set Up Your Profile
            </h2>
            <p className="text-gray-600 text-lg">
              Complete your instructor profile to start connecting with students
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0412 345 678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="61412345678 (with country code)"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / About You
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell students about your experience, teaching style, and what makes you a great instructor..."
                />
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suburb *
                  </label>
                  <input
                    type="text"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Bondi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2026"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {stateOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (AUD) *
                  </label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="20"
                    max="200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Services & Specialties */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Services & Specialties
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Transmission Types *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {transmissionOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.transmission_types.includes(option.value)}
                          onChange={() => handleMultiSelect('transmission_types', option.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Methods *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {paymentOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.payment_methods.includes(option.value)}
                          onChange={() => handleMultiSelect('payment_methods', option.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Languages Spoken *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languageOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(option.value)}
                          onChange={() => handleMultiSelect('languages', option.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Create My Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInstructorData();
    }
  }, [user]);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('auth_user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No instructor profile found
          setHasProfile(false);
          setInstructor(null);
        } else {
          throw error;
        }
      } else {
        setHasProfile(true);
        setInstructor(data);
        // Fetch related data only if instructor profile exists
        fetchReviews(data.id);
        fetchBookings(data.id);
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (instructorId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('instructor_id', instructorId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchBookings = async (instructorId: string) => {
    try {
      const { data, error } = await supabase
        .from('instructor_booking')
        .select('*')
        .eq('instructor_id', instructorId)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(10);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleViewProfile = () => {
    if (instructor) {
      window.open(`/instructor/${instructor.id}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show profile creation form if no profile exists
  if (!loading && !hasProfile) {
    return (
      <CreateInstructorProfileForm
        user={user}
        onProfileCreated={fetchInstructorData}
        setLoading={setLoading}
      />
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Error</h2>
          <p className="text-gray-600 mb-6">There was an issue loading your profile.</p>
          <button
            onClick={fetchInstructorData}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  
  return (
    
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{instructor.google_rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{instructor.google_reviews_count}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                <p className="text-2xl font-bold text-gray-900">${instructor.hourly_rate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Experience</p>
                <p className="text-2xl font-bold text-gray-900">{instructor.experience_years} years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
                <button
                  onClick={handleViewProfile}
                  className="flex items-center text-gray-600 hover:text-gray-700"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Public
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <img
                  src={instructor.photo_url}
                  alt={instructor.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                  <p className="text-gray-600">{instructor.suburb}, {instructor.state} {instructor.postcode}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{instructor.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{instructor.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">
                    Serving: {instructor.serving_postcodes.join(', ')}
                  </span>
                </div>

                {instructor.bio && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {instructor.bio.length > 150 
                        ? `${instructor.bio.substring(0, 150)}...` 
                        : instructor.bio
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
            </div>
            <div className="p-6">
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.student_name}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Availability</h2>
          </div>
          <div className="p-6">
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-lg border ${
                      booking.is_available
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">{booking.time_slot}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.is_available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;