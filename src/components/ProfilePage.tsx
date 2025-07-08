import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Save, 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Car,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Upload,
  Camera,
  X,
  Crop,
  Loader2
} from 'lucide-react';
import ReactCrop, { Crop as ReactCropType, PixelCrop } from 'react-image-crop';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardHeader from './DashboardHeader';
import 'react-image-crop/dist/ReactCrop.css';

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
  hourly_rate: number;
  experience_years: number;
  payment_methods: string[];
  languages: string[];
  serving_postcodes: string[];
  auth_user_id: string;
  display_name?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState<Partial<Instructor>>({});
  const [servingPostcodesText, setServingPostcodesText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image upload states
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<ReactCropType>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transmissionOptions = [
    { value: 'auto', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'forklift', label: 'Forklift' }
  ];

  const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'payid', label: 'PayID' },
    { value: 'card', label: 'Card' },
    { value: 'paypal', label: 'PayPal' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'mandarin', label: 'Mandarin' },
    { value: 'cantonese', label: 'Cantonese' },
    { value: 'malay', label: 'Malay' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'italian', label: 'Italian' },
    { value: 'greek', label: 'Greek' },
    { value: 'korean', label: 'Korean' },
    { value: 'japanese', label: 'Japanese' }
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
          // No instructor profile found, redirect to dashboard
          navigate('/');
          return;
        }
        throw error;
      }

      setInstructor(data);
      setFormData(data);
      setServingPostcodesText(data.serving_postcodes.join(', '));
    } catch (error: any) {
      console.error('Error fetching instructor data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Instructor, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field: 'transmission_types' | 'payment_methods' | 'languages', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setShowImageUpload(true);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        resolve(blob);
      }, 'image/webp', 0.8);
    });
  };

  const handleImageUpload = async () => {
    if (!completedCrop || !imgRef.current || !instructor) {
      setError('Please select and crop an image first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Get cropped image as blob
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);

      // Compress the image
      const compressedFile = await imageCompression(croppedImageBlob as File, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 400,
        useWebWorker: true,
        fileType: 'image/webp'
      });

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `instructor-${instructor.id}-${timestamp}.webp`;
      const filePath = `instructor-photos/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('instructor-photos')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('instructor-photos')
        .getPublicUrl(filePath);

      // Update instructor record with new photo URL
      const { error: updateError } = await supabase
        .from('instructors')
        .update({ photo_url: publicUrl })
        .eq('id', instructor.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      setInstructor(prev => prev ? { ...prev, photo_url: publicUrl } : null);
      
      // Close upload modal
      setShowImageUpload(false);
      setSelectedImage(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);

    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Convert serving postcodes text to array
      const servingPostcodesArray = servingPostcodesText
        .split(',')
        .map(pc => pc.trim())
        .filter(pc => pc.length > 0);

      const updateData = {
        ...formData,
        serving_postcodes: servingPostcodesArray
      };

      const { error } = await supabase
        .from('instructors')
        .update(updateData)
        .eq('id', instructor!.id);

      if (error) throw error;

      setInstructor({ ...(instructor as Instructor), ...updateData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error: any) {
      setError(error.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleViewProfile = () => {
    if (instructor) {
      // Sanitize name for URL
      const urlName = instructor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      window.open(`https://drivelessons.com.au/${instructor.postcode}/${urlName}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="profile" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="profile" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">Please create your instructor profile first.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="profile" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </button>
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleViewProfile}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View Public Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">Profile updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
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
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.display_name || ''}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional display name (shown to students)"
                  />
                  <p className="text-xs text-gray-500 mt-1">If provided, this will be shown instead of your full name</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0412 345 678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="61412345678 (with country code)"
                  />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={formData.photo_url || ''}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 w-fit"
                      >
                        <Upload className="h-4 w-4" />
                        Upload New Photo
                      </button>
                      <p className="text-xs text-gray-500">
                        Upload a high-quality photo. You'll be able to crop it before saving. 
                        Recommended: Square image, at least 400x400px. Max size: 10MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / About You
                </label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell students about your experience, teaching style, and what makes you a great instructor..."
                />
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
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
                    value={formData.suburb || ''}
                    onChange={(e) => handleInputChange('suburb', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Bondi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    value={formData.postcode || ''}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2026"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {stateOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serving Postcodes *
                </label>
                <textarea
                  value={servingPostcodesText}
                  onChange={(e) => setServingPostcodesText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2000, 2001, 2002, 2010, 2015 (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Enter postcodes you serve, separated by commas. Students will only see you if their postcode is in this list.</p>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
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
                    value={formData.hourly_rate || ''}
                    onChange={(e) => handleInputChange('hourly_rate', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="20"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    value={formData.experience_years || ''}
                    onChange={(e) => handleInputChange('experience_years', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            </div>

            {/* Services & Specialties */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
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
                          checked={formData.transmission_types?.includes(option.value) || false}
                          onChange={() => handleMultiSelectChange('transmission_types', option.value)}
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
                          checked={formData.payment_methods?.includes(option.value) || false}
                          onChange={() => handleMultiSelectChange('payment_methods', option.value)}
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
                          checked={formData.languages?.includes(option.value) || false}
                          onChange={() => handleMultiSelectChange('languages', option.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleViewProfile}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Public Profile
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Crop className="h-5 w-5 text-blue-600" />
                  Crop Your Profile Photo
                </h3>
                <button
                  onClick={() => {
                    setShowImageUpload(false);
                    setSelectedImage(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={selectedImage}
                    alt="Crop preview"
                    className="max-w-full h-auto"
                    style={{ maxHeight: '400px' }}
                  />
                </ReactCrop>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Tips:</strong> Drag the corners to adjust the crop area. 
                  The image will be automatically optimized and converted to WebP format for better performance.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowImageUpload(false);
                    setSelectedImage(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageUpload}
                  disabled={uploading || !completedCrop}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Save Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;