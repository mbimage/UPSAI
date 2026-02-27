-- Add summary column to chat_sessions for thread-level conversation summaries
-- This allows the AI to maintain context across long conversations

ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';

-- Update existing sessions with empty summary
UPDATE chat_sessions 
SET summary = '' 
WHERE summary IS NULL;

COMMENT ON COLUMN chat_sessions.summary IS 'Thread-level conversation summary for AI context';
