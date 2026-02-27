-- Create monthly_digests table
CREATE TABLE IF NOT EXISTS monthly_digests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Create outcome_measurements table if it doesn't exist
CREATE TABLE IF NOT EXISTS outcome_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  score DECIMAL NOT NULL,
  previous_score DECIMAL,
  source TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS goal_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  progress DECIMAL NOT NULL,
  previous_progress DECIMAL,
  status TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resource_engagements table if it doesn't exist
CREATE TABLE IF NOT EXISTS resource_engagements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  category TEXT NOT NULL,
  completion_percentage DECIMAL NOT NULL,
  time_spent_minutes INTEGER NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_outcome_measurements_user_category ON outcome_measurements(user_id, category);
CREATE INDEX IF NOT EXISTS idx_outcome_measurements_timestamp ON outcome_measurements(timestamp);
CREATE INDEX IF NOT EXISTS idx_goal_progress_user_goal ON goal_progress(user_id, goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_timestamp ON goal_progress(timestamp);
CREATE INDEX IF NOT EXISTS idx_resource_engagements_user ON resource_engagements(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_engagements_timestamp ON resource_engagements(timestamp);
CREATE INDEX IF NOT EXISTS idx_monthly_digests_month_year ON monthly_digests(month, year);
