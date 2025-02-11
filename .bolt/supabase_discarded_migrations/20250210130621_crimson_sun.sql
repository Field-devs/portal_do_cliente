-- Create usuarios table first
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  senha text,
  nome text NOT NULL,
  telefone text,
  foto_perfil text,
  cargo_id integer NOT NULL,
  dt_criacao timestamptz DEFAULT now(),
  status boolean DEFAULT true
);

-- Create plano table
CREATE TABLE IF NOT EXISTS plano (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  status boolean NOT NULL DEFAULT true,
  dt_criacao timestamptz NOT NULL DEFAULT now()
);

-- Create proposta table
CREATE TABLE IF NOT EXISTS proposta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES usuarios(id),
  plano_id uuid REFERENCES plano(id),
  email_empresa text NOT NULL,
  wallet_id text NOT NULL,
  nome_empresa text NOT NULL,
  cnpj text NOT NULL,
  responsavel text NOT NULL,
  cpf text NOT NULL,
  telefone text NOT NULL,
  valor_total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  dt_atualizacao timestamptz
);

-- Enable Row Level Security
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposta ENABLE ROW LEVEL SECURITY;

-- Create policies for usuarios
CREATE POLICY "Users can view their own data"
  ON usuarios
  FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data"
  ON usuarios
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users"
  ON usuarios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for plano
CREATE POLICY "Anyone can view plans"
  ON plano
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage plans"
  ON plano
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for proposta
CREATE POLICY "Users can view their own proposals"
  ON proposta
  FOR SELECT
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can create proposals"
  ON proposta
  FOR INSERT
  WITH CHECK (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own proposals"
  ON proposta
  FOR UPDATE
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own proposals"
  ON proposta
  FOR DELETE
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all proposals"
  ON proposta
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cargo_id ON usuarios(cargo_id);
CREATE INDEX idx_usuarios_status ON usuarios(status);

CREATE INDEX idx_plano_status ON plano(status);

CREATE INDEX idx_proposta_cliente_id ON proposta(cliente_id);
CREATE INDEX idx_proposta_plano_id ON proposta(plano_id);
CREATE INDEX idx_proposta_status ON proposta(status);
CREATE INDEX idx_proposta_dt_criacao ON proposta(dt_criacao);

-- Insert default admin user
INSERT INTO usuarios (
  id,
  email,
  senha,
  nome,
  cargo_id,
  status
) VALUES (
  gen_random_uuid(),
  'gabriel.mauro@fieldcorp.com.br',
  crypt('741129Dmv!', gen_salt('bf')),
  'Gabriel Mauro',
  1, -- Super Admin
  true
);