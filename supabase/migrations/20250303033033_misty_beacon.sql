/*
  # Initial schema for ServiceHub

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `full_name` (text, not null)
      - `avatar_url` (text, nullable)
      - `is_provider` (boolean, default false)
      - `provider_since` (timestamptz, nullable)
      - `provider_bio` (text, nullable)
      - `completed_jobs` (integer, default 0)
      - `created_at` (timestamptz, default now())
    
    - `services`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `price` (numeric, not null)
      - `category` (text, not null)
      - `image_url` (text, not null)
      - `rating` (numeric, default 0)
      - `review_count` (integer, default 0)
      - `location` (text, not null)
      - `duration` (text, not null)
      - `availability` (text, not null)
      - `includes` (text[], not null)
      - `additional_info` (text, nullable)
      - `provider_id` (uuid, references profiles.id)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, nullable)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `service_id` (uuid, references services.id)
      - `user_id` (uuid, references profiles.id)
      - `rating` (integer, not null)
      - `comment` (text, not null)
      - `created_at` (timestamptz, default now())
    
    - `bookings`
      - `id` (uuid, primary key)
      - `service_id` (uuid, references services.id)
      - `user_id` (uuid, references profiles.id)
      - `provider_id` (uuid, references profiles.id)
      - `date` (date, not null)
      - `time` (text, not null)
      - `duration` (integer, not null)
      - `price` (numeric, not null)
      - `status` (text, default 'Upcoming')
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, nullable)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and write their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  is_provider BOOLEAN DEFAULT false,
  provider_since TIMESTAMPTZ,
  provider_bio TEXT,
  completed_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  availability TEXT NOT NULL,
  includes TEXT[] NOT NULL,
  additional_info TEXT,
  provider_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT DEFAULT 'Upcoming',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Services policies
CREATE POLICY "Anyone can view services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Providers can insert their own services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can delete their own services"
  ON services
  FOR DELETE
  TO authenticated
  USING (auth.uid() = provider_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for services they booked"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view bookings for their services"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();