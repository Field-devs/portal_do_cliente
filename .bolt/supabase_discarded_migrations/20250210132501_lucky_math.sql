-- Create usuario table if it doesn't exist
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

-- Rename table to lowercase if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'PROPOSTA_OUTR') THEN
    ALTER TABLE "PROPOSTA_OUTR" RENAME TO propostas_outr;
  END IF;
END $$;

-- Create propostas_outr table with correct structure
CREATE TABLE IF NOT EXISTS propostas_outr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES usuario(id),
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
ALTER TABLE propostas_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_outr ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own proposals"
  ON propostas_outr
  FOR SELECT
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can create proposals"
  ON propostas_outr
  FOR INSERT
  WITH CHECK (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own proposals"
  ON propostas_outr
  FOR UPDATE
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own proposals"
  ON propostas_outr
  FOR DELETE
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all proposals"
  ON propostas_outr
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_propostas_outr_cliente_id ON propostas_outr(cliente_id);
CREATE INDEX IF NOT EXISTS idx_propostas_outr_plano_id ON propostas_outr(plano_id);
CREATE INDEX IF NOT EXISTS idx_propostas_outr_status ON propostas_outr(status);
CREATE INDEX IF NOT EXISTS idx_propostas_outr_dt_inicio ON propostas_outr(dt_inicio);
CREATE INDEX IF NOT EXISTS idx_usuario_cargo_id ON usuario(cargo_id);
CREATE INDEX IF NOT EXISTS idx_plano_outr_status ON plano_outr(status);