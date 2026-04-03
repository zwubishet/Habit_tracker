/*
  # Create Habits Table

  1. New Tables
    - `habits`
      - `id` (uuid, primary key) - Unique identifier for each habit
      - `user_id` (uuid, foreign key) - References auth.users
      - `title` (text) - Name of the habit
      - `description` (text) - Optional description
      - `frequency` (text) - daily or weekly
      - `reminder_time` (time) - Optional reminder time
      - `created_at` (timestamptz) - When the habit was created
      - `updated_at` (timestamptz) - When the habit was last updated

  2. Security
    - Enable RLS on `habits` table
    - Add policies for authenticated users to manage their own habits
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  reminder_time time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS habits_created_at_idx ON habits(created_at DESC);