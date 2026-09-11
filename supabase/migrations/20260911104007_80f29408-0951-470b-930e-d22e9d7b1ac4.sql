CREATE TABLE public.news_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  simple_explanation text,
  relevance_to_pm text,
  pm_use_cases text[] NOT NULL DEFAULT '{}',
  pricing_comparison jsonb,
  published_date date NOT NULL DEFAULT current_date,
  source_name text,
  source_url text UNIQUE,
  is_featured boolean NOT NULL DEFAULT false,
  is_user_submitted boolean NOT NULL DEFAULT false,
  submitted_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.news_items TO anon;
GRANT SELECT, INSERT ON public.news_items TO authenticated;
GRANT ALL ON public.news_items TO service_role;

ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news items"
ON public.news_items FOR SELECT
USING (true);

CREATE POLICY "Anyone can add their own story"
ON public.news_items FOR INSERT
WITH CHECK (is_user_submitted = true);

CREATE INDEX news_items_published_date_idx ON public.news_items (published_date DESC, created_at DESC);