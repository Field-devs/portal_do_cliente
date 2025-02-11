-- Create usuario table if it doesn't exist
CREATE TABLE IF NOT EXISTS usuario (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  senha text,
  nome text NOT NULL,
  telefone text,
  foto_perfil text,
  cargo_id integer NOT NULL,
  dt_criacao timestamptz DEFAULT now(),
  status boolean DEFAULT true
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_cargo_id ON usuario(cargo_id);
CREATE INDEX IF NOT EXISTS idx_usuario_status ON usuario(status);

-- Enable RLS
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;

-- Create policies for usuario table
CREATE POLICY "Users can view their own data"
  ON usuario
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own data"
  ON usuario
  FOR UPDATE
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all users"
  ON usuario
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.user_id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Users can upload their own profile photo"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view profile photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update their own profile photo"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own profile photo"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );