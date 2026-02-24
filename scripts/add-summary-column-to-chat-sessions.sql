-- Add summary column to chat_sessions table for memory layer
-- This column stores the thread-level summary that gets updated every 10 messages

-- Add summary column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'summary'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN summary TEXT DEFAULT '';
    END IF;
END $$;

-- Create index for faster lookups when loading conversation context
CREATE INDEX IF NOT EXISTS idx_chat_sessions_summary ON chat_sessions(id) WHERE summary IS NOT NULL AND summary != '';

-- Comment explaining the column purpose
COMMENT ON COLUMN chat_sessions.summary IS 'Thread-level summary updated every 10 messages by the summarizer job. Used for memory layer context.';
