-- Create chat_history table to store all user conversations
CREATE TABLE IF NOT EXISTS public.chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  timestamp timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON public.chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON public.chat_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_session ON public.chat_history(user_id, session_id);

-- Enable Row Level Security
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own chat history
CREATE POLICY "Users can view their own chat history"
  ON public.chat_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.chat_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat messages"
  ON public.chat_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
  ON public.chat_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE public.chat_history IS 'Stores comprehensive chat history for all user conversations with AI';
