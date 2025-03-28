/*
  # Create branding storage bucket and policies

  1. Storage
    - Create 'branding' bucket for storing logos and favicons
    - Set up RLS policies for:
      - Authenticated users can upload files to their own folder
      - Anyone can read public files
      - Files are organized by user_id

  2. Security
    - Enable RLS on bucket
    - Add policies for:
      - File uploads
      - File downloads
      - File deletions
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can download files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'branding');

CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);