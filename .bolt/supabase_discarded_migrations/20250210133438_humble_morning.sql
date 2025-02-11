-- Create usuariooutr table first
CREATE TABLE IF NOT EXISTS usuariooutr (
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

-- Drop existing table if it exists (case-insensitive check)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename ILIKE 'proposta_outr'
  ) THEN
    DROP TABLE proposta_outr CASCADE;
  END IF;
END $$;

-- Create proposta_outr table with correct structure
CREATE TABLE proposta_outr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES usuariooutr(user_id),
  plano_id uuid REFERENCES plano_outr(id),
  valor numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  dt_inicio timestamptz NOT NULL DEFAULT now(),
  dt_fim timestamptz,
  email_empresa text NOT NULL,
  email_empresarial text NOT NULL,
  nome_empresa text NOT NULL,
  cnpj text NOT NULL,
  responsavel text NOT NULL,
  cpf text NOT NULL,
  telefone text NOT NULL,
  wallet_id text NOT NULL
);

-- Enable RLS
ALTER TABLE usuariooutr ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposta_outr ENABLE ROW LEVEL SECURITY;

-- Create policies for usuariooutr
CREATE POLICY "Users can view their own data"
  ON usuariooutr
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own data"
  ON usuariooutr
  FOR UPDATE
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all users"
  ON usuariooutr
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuariooutr u
      WHERE u.user_id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for proposta_outr
CREATE POLICY "Users can view their own proposals"
  ON proposta_outr
  FOR SELECT
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can create proposals"
  ON proposta_outr
  FOR INSERT
  WITH CHECK (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own proposals"
  ON proposta_outr
  FOR UPDATE
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own proposals"
  ON proposta_outr
  FOR DELETE
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all proposals"
  ON proposta_outr
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuariooutr u
      WHERE u.user_id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create indexes
CREATE INDEX idx_usuariooutr_email ON usuariooutr(email);
CREATE INDEX idx_usuariooutr_cargo_id ON usuariooutr(cargo_id);
CREATE INDEX idx_usuariooutr_status ON usuariooutr(status);
CREATE INDEX idx_proposta_outr_cliente_id ON proposta_outr(cliente_id);
CREATE INDEX idx_proposta_outr_plano_id ON proposta_outr(plano_id);
CREATE INDEX idx_proposta_outr_status ON proposta_outr(status);
CREATE INDEX idx_proposta_outr_dt_inicio ON proposta_outr(dt_inicio);