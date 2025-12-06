-- Make the gallery bucket private
UPDATE storage.buckets SET public = false WHERE id = 'gallery';

-- Add RLS policy for authenticated users to read their own files
CREATE POLICY "Authenticated users can view gallery files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'gallery');

-- Add RLS policy for authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add RLS policy for authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add RLS policy for authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);