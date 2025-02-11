-- Create proposta table
CREATE TABLE IF NOT EXISTS proposta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES users(id),
  plano_id uuid REFERENCES plano_outr(id),
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
ALTER TABLE proposta ENABLE ROW LEVEL SECURITY;

-- Create policies
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
      SELECT 1 FROM users u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_proposta_cliente_id ON proposta(cliente_id);
CREATE INDEX idx_proposta_plano_id ON proposta(plano_id);
CREATE INDEX idx_proposta_status ON proposta(status);
CREATE INDEX idx_proposta_dt_criacao ON proposta(dt_criacao);