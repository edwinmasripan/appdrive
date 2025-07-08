import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Instructor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  photo_url?: string;
  bio?: string;
  transmission_types: string[];
  suburb: string;
  postcode: string;
  state: string;
  latitude: number;
  longitude: number;
  hourly_rate: number;
  experience_years: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // New enriched fields
  serving_postcodes: string[];
  review_keywords: string[];
  google_reviews_count: number;
  google_rating: number;
  payment_methods: string[];
  google_place_id?: string;
  languages: string[];
  
  // New fields from recent migration
  display_name?: string;
  claimed: boolean;
  is_paying_customer: boolean;
  
  // Computed fields
  reviews?: Review[];
  average_rating?: number;
  total_reviews?: number;
  distance?: number;
};

export type Review = {
  id: string;
  instructor_id: string;
  student_name: string;
  rating: number;
  comment?: string;
  created_at: string;
};

export type Booking = {
  id: string;
  instructor_id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  student_email?: string;
  student_phone?: string;
  created_at: string;
};

export type SearchFilters = {
  postcode: string;
  transmission: 'auto' | 'manual' | 'both';
  latitude?: number;
  longitude?: number;
  language?: string;
  paymentMethod?: string;
  maxDistance?: number;
};