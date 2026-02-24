-- Enable Row Level Security on all user-accessible tables
-- This script adds RLS policies to protect user data

-- User Profiles Table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- AI Feedback Table
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
  ON ai_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON ai_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Goal Progress Table
ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals"
  ON goal_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goal_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goal_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goal_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Outcome Measurements Table
ALTER TABLE outcome_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outcomes"
  ON outcome_measurements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outcomes"
  ON outcome_measurements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Resource Engagements Table
ALTER TABLE resource_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own engagements"
  ON resource_engagements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engagements"
  ON resource_engagements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Interactions Table
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interactions"
  ON user_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON user_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Preferences Table
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- User Topics Table
ALTER TABLE user_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own topics"
  ON user_topics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own topics"
  ON user_topics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topics"
  ON user_topics FOR UPDATE
  USING (auth.uid() = user_id);

-- User Journey Table
ALTER TABLE user_journey ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journey"
  ON user_journey FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own journey steps"
  ON user_journey FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Public tables (readable by all authenticated users)
ALTER TABLE texas_high_schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view schools"
  ON texas_high_schools FOR SELECT
  USING (auth.role() = 'authenticated');

-- Response Improvements (system-managed, read-only for users)
ALTER TABLE response_improvements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view improvements"
  ON response_improvements FOR SELECT
  USING (auth.role() = 'authenticated');

-- Monthly Digests (system-managed, read-only for users)
ALTER TABLE monthly_digests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view digests"
  ON monthly_digests FOR SELECT
  USING (auth.role() = 'authenticated');
