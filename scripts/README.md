# Database Scripts

This folder contains SQL scripts for setting up and managing the UpSide AI database.

## Available Scripts

### Initial Setup

1. **init-database.sql** - Main database initialization script
   - Creates core tables: profiles, chat_sessions, chat_messages, assessments, user_analytics, feedback
   - Sets up Row Level Security (RLS) policies
   - Creates indexes for performance
   - Adds triggers for updated_at columns

### Additional Features

2. **add-stripe-customer-id-to-profiles.sql** - Adds Stripe integration to profiles
3. **create-chat-history-table.sql** - Creates chat history table
4. **create-chat-history-tables.sql** - Creates chat sessions and messages tables (extended version)
5. **create-digest-tables.sql** - Creates monthly digests, outcome measurements, goal progress, resource engagements
6. **create-high-school-tables.sql** - Creates tables for high schools, resources, resource views, admin logs
7. **create-security-monitoring-tables.sql** - Creates threat alerts and security audit log tables
8. **create-security-tables.sql** - Creates security logs, blocked IPs, security settings tables
9. **create-texas-schools-table.sql** - Creates and populates Texas high schools data
10. **enable-rls-policies.sql** - Comprehensive RLS policies for all user tables

## How to Run Scripts

### In v0 Chat
You can run these scripts directly in the v0 chat by clicking the "Run Script" button in the scripts folder.

### In Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the script content
4. Click "Run" to execute

### Using npm scripts
\`\`\`bash
# Initialize the database
npm run db:init

# Setup Row Level Security
npm run db:setup-rls

# Add Stripe integration
npm run db:add-stripe
\`\`\`

## Script Execution Order

For a fresh database setup, run scripts in this order:

1. `init-database.sql` - Core tables and RLS
2. `create-texas-schools-table.sql` - School data (if needed)
3. `create-digest-tables.sql` - Analytics tables
4. `create-security-tables.sql` - Security monitoring
5. `add-stripe-customer-id-to-profiles.sql` - Payment integration
6. `enable-rls-policies.sql` - Additional RLS policies

## Current Database Status

Based on the live schema, the following tables are already configured:
- ✅ user_profiles
- ✅ chat_sessions, chat_messages, chat_history
- ✅ goal_progress
- ✅ outcome_measurements
- ✅ resource_engagements
- ✅ monthly_digests
- ✅ texas_high_schools
- ✅ security_logs, blocked_ips, security_settings
- ✅ user_interactions, user_preferences, user_topics, user_journey
- ✅ ai_feedback
- ✅ response_improvements

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Notes

- All tables use UUID primary keys
- RLS policies ensure users can only access their own data
- Timestamps use `timestamp with time zone` for proper timezone handling
- Indexes are created on foreign keys and frequently queried columns
- Public tables (like texas_high_schools) are readable by all authenticated users
