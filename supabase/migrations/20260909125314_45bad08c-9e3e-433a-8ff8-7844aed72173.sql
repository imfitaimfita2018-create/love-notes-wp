CREATE TABLE public.featured_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id integer NOT NULL UNIQUE,
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.featured_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.featured_posts TO authenticated;
GRANT ALL ON public.featured_posts TO service_role;

ALTER TABLE public.featured_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read featured posts"
  ON public.featured_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage featured posts"
  ON public.featured_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);