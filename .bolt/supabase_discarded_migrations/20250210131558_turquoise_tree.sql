-- Create plano table
CREATE TABLE IF NOT EXISTS plano (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  caixas_entrada integer NOT NULL DEFAULT 1,
  manter_caixas_atuais boolean NOT NULL DEFAULT false,
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

-- Create proposta table
CREATE TABLE IF NOT EXISTS proposta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES users(id),
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
ALTER TABLE plano ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposta ENABLE ROW LEVEL SECURITY;

-- Create policies for plano table
CREATE POLICY "Anyone can view plans"
  ON plano
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage plans"
  ON plano
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND cargo_id IN (1, 2) -- Super admin and admin
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
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND cargo_id IN (1, 2) -- Super admin and admin
    )
  );

-- Create policies for proposta table
CREATE POLICY "Users can view their own proposals"
  ON proposta
  FOR SELECT
  TO authenticated
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can create proposals"
  ON proposta
  FOR INSERT
  TO authenticated
  WITH CHECK (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own proposals"
  ON proposta
  FOR UPDATE
  TO authenticated
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own proposals"
  ON proposta
  FOR DELETE
  TO authenticated
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all proposals"
  ON proposta
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND cargo_id IN (1, 2) -- Super admin and admin
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plano_status ON plano(status);
CREATE INDEX IF NOT EXISTS idx_addon_status ON addon(status);
CREATE INDEX IF NOT EXISTS idx_proposta_cliente_id ON proposta(cliente_id);
CREATE INDEX IF NOT EXISTS idx_proposta_plano_id ON proposta(plano_id);
CREATE INDEX IF NOT EXISTS idx_proposta_status ON proposta(status);
CREATE INDEX IF NOT EXISTS idx_proposta_dt_criacao ON proposta(dt_criacao);

-- Insert default plans
INSERT INTO plano (nome, descricao, valor, caixas_entrada, whatsapp_oficial, atendentes, automacoes)
VALUES 
  ('Standard', 'Para pequenas empresas', 99.90, 1, false, 3, 5),
  ('Professional', 'Para empresas em crescimento', 199.90, 3, true, 10, 15),
  ('Enterprise', 'Para grandes empresas', 399.90, 10, true, 30, 50);

-- Insert default addons
INSERT INTO addon (nome, descricao, valor)
VALUES 
  ('Caixa de Entrada Adicional', 'Adicione mais caixas de entrada ao seu plano', 49.90),
  ('Atendente Adicional', 'Adicione mais atendentes ao seu plano', 29.90),
  ('Automação Adicional', 'Adicione mais automações ao seu plano', 19.90),
  ('Kanban', 'Adicione funcionalidade Kanban', 79.90);