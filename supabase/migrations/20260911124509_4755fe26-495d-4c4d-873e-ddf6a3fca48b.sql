CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email TEXT CHECK (email IS NULL OR char_length(email) <= 320),
  feedback TEXT NOT NULL CHECK (char_length(feedback) BETWEEN 1 AND 5000),
  section TEXT CHECK (section IS NULL OR section IN ('daily-news', 'glossary', 'model-finder', 'general')),
  rating SMALLINT CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.feedback TO anon, authenticated;
GRANT ALL ON public.feedback TO service_role;

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
ON public.feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 120
  AND char_length(feedback) BETWEEN 1 AND 5000
  AND (email IS NULL OR char_length(email) <= 320)
  AND (section IS NULL OR section IN ('daily-news', 'glossary', 'model-finder', 'general'))
  AND (rating IS NULL OR rating BETWEEN 1 AND 5)
);

CREATE OR REPLACE FUNCTION public.set_feedback_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.set_feedback_updated_at();