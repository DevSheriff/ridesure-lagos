
-- Enable realtime for pins and custom_categories
ALTER PUBLICATION supabase_realtime ADD TABLE public.pins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_categories;
