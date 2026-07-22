CREATE TABLE public.document_embeddings (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  source_table text NOT NULL,
  source_id    uuid NOT NULL,
  content      text NOT NULL,
  embedding    vector(1536) NOT NULL,
  metadata     jsonb DEFAULT '{}',
  created_at   timestamptz DEFAULT NOW()
);

CREATE INDEX ON public.document_embeddings 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX ON public.document_embeddings (user_id, source_table);

ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own_embeddings" ON public.document_embeddings
  FOR ALL USING (auth.uid() = user_id);
