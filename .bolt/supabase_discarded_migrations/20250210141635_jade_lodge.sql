-- Create usuario table first
CREATE TABLE IF NOT EXISTS usuario (
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

-- Create plano_outr table
CREATE TABLE IF NOT EXISTS plano_outr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  caixas_entrada integer NOT NULL DEFAULT 1,
  whatsapp_oficial boolean NOT NULL DEFAULT false,
  atendentes integer NOT NULL DEFAULT 1,
  automacoes integer NOT NULL DEFAULT 1,
  status boolean NOT NULL DEFAULT true,
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  dt_atualizacao timestamptz
);

-- Create addon table
CREATE TABLE IF NOT EXISTS addon (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  status boolean NOT NULL DEFAULT true,
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  dt_atualizacao timestamptz
);

-- Create proposta_outr table
CREATE TABLE IF NOT EXISTS proposta_outr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES usuario(id),
  plano_id uuid REFERENCES plano_outr(id),
  email_empresa text NOT NULL,
  wallet_id text NOT NULL,
  valor_total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  dt_atualizacao timestamptz
);

-- Enable Row Level Security
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposta_outr ENABLE ROW LEVEL SECURITY;

-- Create policies for usuario table
CREATE POLICY "Users can view their own data"
  ON usuario
  FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data"
  ON usuario
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users"
  ON usuario
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for plano_outr table
CREATE POLICY "Anyone can view plans"
  ON plano_outr
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage plans"
  ON plano_outr
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for addon table
CREATE POLICY "Anyone can view addons"
  ON addon
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage addons"
  ON addon
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for proposta_outr table
CREATE POLICY "Users can view their own proposals"
  ON proposta_outr
  FOR SELECT
  TO authenticated
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all proposals"
  ON proposta_outr
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_cargo_id ON usuario(cargo_id);
CREATE INDEX IF NOT EXISTS idx_usuario_status ON usuario(status);

CREATE INDEX IF NOT EXISTS idx_plano_outr_status ON plano_outr(status);
CREATE INDEX IF NOT EXISTS idx_addon_status ON addon(status);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_cliente_id ON proposta_outr(cliente_id);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_plano_id ON proposta_outr(plano_id);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_status ON proposta_outr(status);