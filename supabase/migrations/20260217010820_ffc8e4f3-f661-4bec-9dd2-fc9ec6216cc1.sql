
-- Allow deleting pins (needed for expiry)
CREATE POLICY "Anyone can delete pins"
ON public.pins
FOR DELETE
USING (true);
