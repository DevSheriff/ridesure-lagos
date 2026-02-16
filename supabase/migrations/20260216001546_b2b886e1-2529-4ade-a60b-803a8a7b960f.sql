
-- Pins table
CREATE TABLE public.pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  reported_by TEXT NOT NULL DEFAULT 'Anonymous',
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  permanent BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pins" ON public.pins FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pins" ON public.pins FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update pins" ON public.pins FOR UPDATE USING (true);

-- Custom categories table
CREATE TABLE public.custom_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories" ON public.custom_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert categories" ON public.custom_categories FOR INSERT WITH CHECK (true);
