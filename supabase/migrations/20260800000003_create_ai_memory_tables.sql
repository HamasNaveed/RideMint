CREATE TABLE public.ai_conversations (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  role       text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content    text NOT NULL,
  metadata   jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT NOW()
);
CREATE INDEX ON public.ai_conversations (user_id, session_id, created_at);
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own_conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.ai_insights_cache (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  insight_type text NOT NULL,
  title        text NOT NULL,
  body         text NOT NULL,
  data         jsonb DEFAULT '{}',
  priority     integer DEFAULT 0,
  expires_at   timestamptz,
  created_at   timestamptz DEFAULT NOW()
);
CREATE INDEX ON public.ai_insights_cache (user_id, insight_type, priority DESC);
ALTER TABLE public.ai_insights_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own_insights" ON public.ai_insights_cache
  FOR ALL USING (auth.uid() = user_id);
