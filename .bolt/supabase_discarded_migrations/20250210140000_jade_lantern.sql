-- Create cliente_afiliado table with proper structure
CREATE TABLE IF NOT EXISTS cliente_afiliado (
  cliente_afiliado_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES usuariooutr(user_id) ON DELETE CASCADE,
  creator_id uuid REFERENCES usuariooutr(user_id),
  email text NOT NULL UNIQUE,
  nome text NOT NULL,
  telefone text NOT NULL,
  desconto numeric NOT NULL CHECK (desconto BETWEEN 0 AND 100),
  comissao numeric NOT NULL CHECK (comissao BETWEEN 0 AND 100),
  codigo_cupom text NOT NULL UNIQUE,
  vencimento timestamptz NOT NULL,
  dt_criacao timestamptz DEFAULT now(),
  status boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE cliente_afiliado ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own affiliate data"
  ON cliente_afiliado
  FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all affiliates"
  ON cliente_afiliado
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuariooutr u
      WHERE u.user_id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create indexes
CREATE INDEX idx_cliente_afiliado_user_id ON cliente_afiliado(user_id);
CREATE INDEX idx_cliente_afiliado_creator_id ON cliente_afiliado(creator_id);
CREATE INDEX idx_cliente_afiliado_codigo_cupom ON cliente_afiliado(codigo_cupom);
CREATE INDEX idx_cliente_afiliado_status ON cliente_afiliado(status);