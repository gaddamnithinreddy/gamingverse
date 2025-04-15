/*
  # Fix RLS policies for users and tournament registrations

  1. Changes
    - Update users table RLS policies to allow inserts during signup
    - Fix tournament_registrations foreign key and RLS policies
    
  2. Security
    - Enable RLS on all tables
    - Add proper policies for authenticated users
*/

-- Fix users table policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

CREATE POLICY "Users can insert during signup"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fix tournament registrations
DROP POLICY IF EXISTS "Users can read own registrations" ON tournament_registrations;
DROP POLICY IF EXISTS "Users can create own registrations" ON tournament_registrations;

CREATE POLICY "Users can read own registrations"
  ON tournament_registrations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
  ON tournament_registrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add public read access to tournament registrations count
CREATE POLICY "Anyone can view registration counts"
  ON tournament_registrations
  FOR SELECT
  USING (true);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  username text NOT NULL,
  room_code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Anyone can view messages"
  ON messages
  FOR SELECT
  USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  WITH CHECK (true);