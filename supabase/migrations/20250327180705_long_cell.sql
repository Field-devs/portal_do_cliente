/*
  # Create settings tables and views

  1. New Tables
    - `configuracoes`: Main settings table
      - Stores email, branding and terms settings
      - Includes version history
      - Tracks changes and updates

  2. Fields
    - user_id (uuid)
    - email_settings (jsonb)
    - email_templates (jsonb[])
    - branding_settings (jsonb)
    - branding_history (jsonb[])
    - terms_settings (jsonb)
    - terms_history (jsonb[])
    - created_at (timestamptz)
    - updated_at (timestamptz)
*/

CREATE TABLE IF NOT EXISTS configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  email_settings jsonb DEFAULT '{}'::jsonb,
  email_templates jsonb[] DEFAULT '{}'::jsonb[],
  branding_settings jsonb DEFAULT '{}'::jsonb,
  branding_history jsonb[] DEFAULT '{}'::jsonb[],
  terms_settings jsonb DEFAULT '{}'::jsonb,
  terms_history jsonb[] DEFAULT '{}'::jsonb[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own settings"
  ON configuracoes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON configuracoes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_configuracoes_updated_at
  BEFORE UPDATE ON configuracoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();