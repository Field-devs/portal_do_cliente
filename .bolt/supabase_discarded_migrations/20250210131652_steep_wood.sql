-- Create proposta_outr table if it doesn't exist
CREATE TABLE IF NOT EXISTS proposta_outr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES users(id),
  plano_id uuid REFERENCES plano_outr(id),
  email_empresa text,
  nome_empresa text,
  cnpj text,
  responsavel text,
  cpf text,
  telefone text,
  valor numeric NOT NULL DEFAULT 0,
  status boolean NOT NULL DEFAULT true,
  dt_inicio timestamptz NOT NULL DEFAULT now(),
  dt_fim timestamptz
);

-- Create plano_outr table if it doesn't exist
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
  dt_criacao timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposta_outr_cliente_id 
  ON proposta_outr(cliente_id);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_plano_id 
  ON proposta_outr(plano_id);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_status 
  ON proposta_outr(status);
CREATE INDEX IF NOT EXISTS idx_proposta_outr_dt_inicio 
  ON proposta_outr(dt_inicio);

-- Enable RLS
ALTER TABLE proposta_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon ENABLE ROW LEVEL SECURITY;

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
      SELECT 1 FROM users u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

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
      SELECT 1 FROM users u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
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
      SELECT 1 FROM users u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );