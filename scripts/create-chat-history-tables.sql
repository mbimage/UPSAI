-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  title TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "messageCount" INTEGER DEFAULT 0,
  "lastMessage" TEXT
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionId" UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions("userId");
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON chat_sessions("updatedAt" DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages("sessionId");
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages("createdAt");

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid()::text = "userId" OR "userId" = 'demo-user');

CREATE POLICY "Users can insert their own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = "userId" OR "userId" = 'demo-user');

CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid()::text = "userId" OR "userId" = 'demo-user');

CREATE POLICY "Users can delete their own chat sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid()::text = "userId" OR "userId" = 'demo-user');

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages."sessionId"
      AND (chat_sessions."userId" = auth.uid()::text OR chat_sessions."userId" = 'demo-user')
    )
  );

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages."sessionId"
      AND (chat_sessions."userId" = auth.uid()::text OR chat_sessions."userId" = 'demo-user')
    )
  );

CREATE POLICY "Users can delete their own chat messages"
  ON chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages."sessionId"
      AND (chat_sessions."userId" = auth.uid()::text OR chat_sessions."userId" = 'demo-user')
    )
  );
