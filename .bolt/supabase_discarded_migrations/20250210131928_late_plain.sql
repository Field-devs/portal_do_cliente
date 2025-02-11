-- Update users table to add missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS cargo_id integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dt_criacao timestamptz DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS status boolean DEFAULT true;

-- Create plano_outr table if it doesn't exist
CREATE TABLE IF NOT EXISTS plano_outr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  caixas_entrada integer NOT NULL DEFAULT 1,
  automacoes integer NOT NULL DEFAULT 1,
  atendentes integer NOT NULL DEFAULT 1,
  kanban boolean NOT NULL DEFAULT false,
  suporte_humano integer NOT NULL DEFAULT 0,
  valor numeric NOT NULL DEFAULT 0,
  unidade text DEFAULT 'mensal',
  status boolean NOT NULL DEFAULT true,
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  usuario_id uuid REFERENCES users(id),
  tipo_cliente text DEFAULT 'standard'
);

-- Create addon table if it doesn't exist
CREATE TABLE IF NOT EXISTS addon (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  valor numeric NOT NULL DEFAULT 0,
  unidade text DEFAULT 'mensal',
  qtd integer NOT NULL DEFAULT 1,
  status boolean NOT NULL DEFAULT true,
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  tipo_cliente text DEFAULT 'standard',
  usuario_id uuid REFERENCES users(id)
);

-- Create proposta_outr table if it doesn't exist
CREATE TABLE IF NOT EXISTS proposta_outr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dt_inicio timestamptz NOT NULL DEFAULT now(),
  dt_fim timestamptz,
  valor numeric NOT NULL DEFAULT 0,
  status boolean NOT NULL DEFAULT true,
  cliente_id uuid REFERENCES users(id),
  ava_id uuid REFERENCES users(id),
  plano_id uuid REFERENCES plano_outr(id),
  addon_id uuid REFERENCES addon(id),
  email_empresa text NOT NULL,
  email_empresarial text NOT NULL,
  nome_empresa text NOT NULL,
  cnpj text NOT NULL,
  responsavel text NOT NULL,
  cpf text NOT NULL,
  telefone text NOT NULL,
  wallet_id text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE plano_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposta_outr ENABLE ROW LEVEL SECURITY;

-- Create policies for plano_outr
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
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND cargo_id IN (1, 2)
    )
  );

-- Create policies for addon
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
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND cargo_id IN (1, 2)
    )
  );

-- Create policies for proposta_outr
CREATE POLICY "Users can view their own proposals"
  ON proposta_outr
  FOR SELECT
  TO authenticated
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all proposals"
  ON proposta_outr
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND cargo_id IN (1, 2)
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plano_outr_status ON plano_outr(status);
CREATE INDEX IF NOT EXISTS idx_addon_status ON addon(status);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_cliente_id ON proposta_outr(cliente_id);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_plano_id ON proposta_outr(plano_id);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_status ON proposta_outr(status);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_dt_inicio ON proposta_outr(dt_inicio);