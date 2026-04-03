/*
  # Create Habit Logs Table

  1. New Tables
    - `habit_logs`
      - `id` (uuid, primary key) - Unique identifier for each log entry
      - `habit_id` (uuid, foreign key) - References habits table
      - `user_id` (uuid, foreign key) - References auth.users (for faster queries)
      - `date` (date) - The date this habit was completed
      - `completed` (boolean) - Whether the habit was completed
      - `created_at` (timestamptz) - When the log was created

  2. Security
    - Enable RLS on `habit_logs` table
    - Add policies for authenticated users to manage their own logs

  3. Important Notes
    - Unique constraint on (habit_id, date) to prevent duplicate completions for the same day
    - Index on user_id and date for efficient queries
*/

CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  completed boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, date)
);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habit logs"
  ON habit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit logs"
  ON habit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit logs"
  ON habit_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit logs"
  ON habit_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS habit_logs_habit_id_idx ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS habit_logs_user_id_date_idx ON habit_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS habit_logs_date_idx ON habit_logs(date DESC);