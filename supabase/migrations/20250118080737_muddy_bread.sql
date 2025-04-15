/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - username (text)
      - avatar_url (text)
      - created_at (timestamp)
    
    - game_ratings
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - game_id (integer)
      - rating (integer)
      - comment (text)
      - created_at (timestamp)
    
    - tournament_registrations
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - tournament_id (integer)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create game ratings table
CREATE TABLE IF NOT EXISTS game_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  game_id integer NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all ratings"
  ON game_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own ratings"
  ON game_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON game_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create tournament registrations table
CREATE TABLE IF NOT EXISTS tournament_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tournament_id integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own registrations"
  ON tournament_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
  ON tournament_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);