/*
  # Create Storage Buckets

  1. New Buckets
    - `profiles` - For user profile photos
    - `branding` - For branding assets (logos, favicons)

  2. Security
    - Enable public access for viewing files
    - Restrict upload/delete to authenticated users
    - Users can only manage their own files
*/

-- Create profiles bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Create branding bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for profiles bucket
CREATE POLICY "Authenticated users can upload profile photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profiles');

CREATE POLICY "Users can update own profile photos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'profiles' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policies for branding bucket
CREATE POLICY "Authenticated users can upload branding files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view branding files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'branding');

CREATE POLICY "Users can update own branding files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own branding files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'branding' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);