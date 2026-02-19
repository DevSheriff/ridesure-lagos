
-- Create delivery_ratings table for reliability scores
CREATE TABLE public.delivery_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_lat DOUBLE PRECISION NOT NULL,
  destination_lng DOUBLE PRECISION NOT NULL,
  address_accuracy INTEGER NOT NULL CHECK (address_accuracy BETWEEN 1 AND 5),
  route_accuracy INTEGER NOT NULL CHECK (route_accuracy BETWEEN 1 AND 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert ratings" ON public.delivery_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read ratings" ON public.delivery_ratings FOR SELECT USING (true);

-- Enable realtime for delivery_ratings
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_ratings;
