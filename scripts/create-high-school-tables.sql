-- Create high schools table
CREATE TABLE IF NOT EXISTS high_schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  principal_email VARCHAR(255),
  coach_emails TEXT[], -- Array of coach email addresses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resource views tracking table
CREATE TABLE IF NOT EXISTS resource_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES high_schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table if it doesn't exist
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin logs table for tracking report generation
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add high_school_id to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'high_school_id') THEN
    ALTER TABLE profiles ADD COLUMN high_school_id UUID REFERENCES high_schools(id);
  END IF;
END $$;

-- Insert sample high schools for testing
INSERT INTO high_schools (name, district, city, state, principal_email, coach_emails) VALUES
  ('Riverside High School', 'Riverside ISD', 'Riverside', 'TX', 'principal@riverside.edu', ARRAY['coach1@riverside.edu', 'coach2@riverside.edu']),
  ('Prairie View High School', 'Prairie View ISD', 'Prairie View', 'TX', 'principal@prairieview.edu', ARRAY['athletics@prairieview.edu']),
  ('Cedar Creek High School', 'Cedar Creek ISD', 'Cedar Creek', 'TX', 'principal@cedarcreek.edu', ARRAY['coach@cedarcreek.edu', 'athletics@cedarcreek.edu']),
  ('Lone Star High School', 'Lone Star ISD', 'Lone Star', 'TX', 'principal@lonestar.edu', ARRAY['coach1@lonestar.edu'])
ON CONFLICT (name, district) DO NOTHING;

-- Insert sample resources
INSERT INTO resources (title, category) VALUES
  ('Self-Efficacy Building Guide', 'Personal Development'),
  ('Goal Setting Workshop', 'Goal Setting'),
  ('Emotional Intelligence Training', 'Emotional Intelligence'),
  ('Time Management for Student Athletes', 'Time Management'),
  ('Stress Management Techniques', 'Mental Health'),
  ('Getting Started Guide', 'Onboarding'),
  ('Self-Assessment Tools', 'Assessment')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resource_views_school_id ON resource_views(school_id);
CREATE INDEX IF NOT EXISTS idx_resource_views_created_at ON resource_views(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_high_school_id ON profiles(high_school_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp);

-- Enable RLS (Row Level Security)
ALTER TABLE high_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin can view all high schools" ON high_schools FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin can view all resource views" ON resource_views FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Everyone can view resources" ON resources FOR SELECT USING (true);

CREATE POLICY "Admin can view admin logs" ON admin_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin can insert admin logs" ON admin_logs FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
