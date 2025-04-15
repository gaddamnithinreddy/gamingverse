/*
  # Add messages table for chat functionality

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text, message content)
      - `user_id` (uuid, references users)
      - `username` (text, sender's username)
      - `room_code` (text, chat room identifier)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on messages table
    - Add policies for:
      - Authenticated users can insert messages
      - Anyone can read messages in their room
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  username text NOT NULL,
  room_code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read messages in their rooms"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster room queries
CREATE INDEX messages_room_code_idx ON messages(room_code);