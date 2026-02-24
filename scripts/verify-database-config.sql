-- Verification script to check database configuration
-- Run this to ensure all tables, RLS policies, and indexes are properly set up

-- Check if all required tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'user_profiles', 'chat_sessions', 'chat_messages', 'chat_history',
        'goal_progress', 'outcome_measurements', 'resource_engagements',
        'monthly_digests', 'texas_high_schools', 'security_logs',
        'blocked_ips', 'security_settings', 'user_interactions',
        'user_preferences', 'user_topics', 'user_journey',
        'ai_feedback', 'response_improvements'
    );
    
    RAISE NOTICE 'Found % out of 18 required tables', table_count;
    
    IF table_count < 18 THEN
        RAISE WARNING 'Some tables are missing. Please run init scripts.';
    ELSE
        RAISE NOTICE 'All required tables exist!';
    END IF;
END $$;

-- Check RLS status on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check all RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verify auth.users integration (Supabase Auth)
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- Check for any missing foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database verification complete!';
    RAISE NOTICE 'Review the output above to ensure all configurations are correct.';
END $$;
