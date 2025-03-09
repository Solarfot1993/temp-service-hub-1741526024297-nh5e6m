/*
  # Add storage bucket for service images

  1. New Storage Bucket
    - Create a new storage bucket for service images
    - Set public access policy for the bucket
*/

-- Create a new storage bucket for service images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to the service-images bucket
CREATE POLICY "Public Access to Service Images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

-- Allow authenticated users to upload images to the service-images bucket
CREATE POLICY "Authenticated Users Can Upload Service Images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-images');

-- Allow users to update and delete their own images
CREATE POLICY "Users Can Update Their Own Service Images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'service-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users Can Delete Their Own Service Images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'service-images' AND (storage.foldername(name))[1] = auth.uid()::text);