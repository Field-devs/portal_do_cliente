/*
  # Create profiles storage bucket
  
  1. New Storage Bucket
    - Creates a public bucket named 'profiles' for storing user profile photos
    
  2. Security
    - Enables RLS policies for secure file access and management
    - Policies:
      - Upload: Only authenticated users can upload to their own folder
      - Download: Public access for viewing profile photos
      - Update: Users can only update their own files
      - Delete: Users can only delete their own files
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Authenticated users can upload profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');

CREATE POLICY "Users can update own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);