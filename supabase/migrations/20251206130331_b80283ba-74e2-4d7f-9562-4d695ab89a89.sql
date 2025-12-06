-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view gallery moments" ON public.gallery_moments;

-- Create a new policy that requires authentication
CREATE POLICY "Authenticated users can view moments"
ON public.gallery_moments FOR SELECT
TO authenticated
USING (true);