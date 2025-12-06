-- Create gallery_moments table
CREATE TABLE public.gallery_moments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  moment_date DATE DEFAULT CURRENT_DATE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery_moments ENABLE ROW LEVEL SECURITY;

-- Create policies - users can view all moments
CREATE POLICY "Anyone can view gallery moments" 
ON public.gallery_moments 
FOR SELECT 
USING (true);

-- Users can create their own moments
CREATE POLICY "Authenticated users can create moments" 
ON public.gallery_moments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own moments
CREATE POLICY "Users can update their own moments" 
ON public.gallery_moments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own non-default moments
CREATE POLICY "Users can delete their own non-default moments" 
ON public.gallery_moments 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id AND is_default = false);

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true);

-- Storage policies
CREATE POLICY "Anyone can view gallery images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Users can update their own gallery images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "Users can delete their own gallery images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'gallery');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gallery_moments_updated_at
BEFORE UPDATE ON public.gallery_moments
FOR EACH ROW
EXECUTE FUNCTION public.update_gallery_updated_at();