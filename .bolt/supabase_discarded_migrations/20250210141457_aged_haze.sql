-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create usuario table
CREATE TABLE usuario (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE plano_outr (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  caixas_entrada integer NOT NULL DEFAULT 1,
  whatsapp_oficial boolean NOT NULL DEFAULT false,
  atendentes integer NOT NULL DEFAULT 1,
  automacoes integer NOT NULL DEFAULT 1,
  status boolean NOT NULL DEFAULT true,
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  usuario_id uuid REFERENCES usuario(id)
);

-- Create addon table
CREATE TABLE addon (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  tipo text DEFAULT 'quantity',
  status boolean NOT NULL DEFAULT true,
  dt_criacao timestamptz NOT NULL DEFAULT now(),
  usuario_id uuid REFERENCES usuario(id)
);

-- Create cliente_afiliado table
CREATE TABLE cliente_afiliado (
  cliente_afiliado_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES usuario(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES usuario(id),
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

-- Create outrpropostas table
CREATE TABLE outrpropostas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_final_cliente_final_id uuid REFERENCES usuario(id),
  ava_ava_id uuid REFERENCES usuario(id),
  plano_outr_plano_outr_id uuid REFERENCES plano_outr(id),
  addon_outr_addon_outr_id uuid,
  addon_id uuid REFERENCES addon(id),
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

-- Enable Row Level Security
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_afiliado ENABLE ROW LEVEL SECURITY;
ALTER TABLE outrpropostas ENABLE ROW LEVEL SECURITY;

-- Create policies for usuario
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

-- Create policies for plano_outr
CREATE POLICY "Anyone can view plans"
  ON plano_outr
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage plans"
  ON plano_outr
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for addon
CREATE POLICY "Anyone can view addons"
  ON addon
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage addons"
  ON addon
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for cliente_afiliado
CREATE POLICY "Users can view their own affiliate data"
  ON cliente_afiliado
  FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all affiliates"
  ON cliente_afiliado
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create policies for outrpropostas
CREATE POLICY "Users can view their own proposals"
  ON outrpropostas
  FOR SELECT
  USING (cliente_final_cliente_final_id::text = auth.uid()::text);

CREATE POLICY "Users can create proposals"
  ON outrpropostas
  FOR INSERT
  WITH CHECK (cliente_final_cliente_final_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own proposals"
  ON outrpropostas
  FOR UPDATE
  USING (cliente_final_cliente_final_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own proposals"
  ON outrpropostas
  FOR DELETE
  USING (cliente_final_cliente_final_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all proposals"
  ON outrpropostas
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_cargo_id ON usuario(cargo_id);
CREATE INDEX idx_usuario_status ON usuario(status);

CREATE INDEX idx_plano_outr_status ON plano_outr(status);
CREATE INDEX idx_plano_outr_usuario_id ON plano_outr(usuario_id);

CREATE INDEX idx_addon_status ON addon(status);
CREATE INDEX idx_addon_usuario_id ON addon(usuario_id);

CREATE INDEX idx_cliente_afiliado_user_id ON cliente_afiliado(user_id);
CREATE INDEX idx_cliente_afiliado_creator_id ON cliente_afiliado(creator_id);
CREATE INDEX idx_cliente_afiliado_codigo_cupom ON cliente_afiliado(codigo_cupom);
CREATE INDEX idx_cliente_afiliado_status ON cliente_afiliado(status);

CREATE INDEX idx_outrpropostas_cliente_id ON outrpropostas(cliente_final_cliente_final_id);
CREATE INDEX idx_outrpropostas_ava_id ON outrpropostas(ava_ava_id);
CREATE INDEX idx_outrpropostas_plano_id ON outrpropostas(plano_outr_plano_outr_id);
CREATE INDEX idx_outrpropostas_addon_id ON outrpropostas(addon_id);
CREATE INDEX idx_outrpropostas_status ON outrpropostas(status);
CREATE INDEX idx_outrpropostas_dt_inicio ON outrpropostas(dt_inicio);

-- Insert sample users
INSERT INTO usuario (id, email, senha, nome, cargo_id, status) VALUES
(uuid_generate_v4(), 'admin@example.com', crypt('admin123', gen_salt('bf')), 'Admin', 1, true),
(uuid_generate_v4(), 'manager@example.com', crypt('manager123', gen_salt('bf')), 'Manager', 2, true),
(uuid_generate_v4(), 'ava@example.com', crypt('ava123', gen_salt('bf')), 'AVA User', 3, true),
(uuid_generate_v4(), 'client@example.com', crypt('client123', gen_salt('bf')), 'Client', 4, true);

-- Insert sample plans
INSERT INTO plano_outr (nome, descricao, valor, caixas_entrada, whatsapp_oficial, atendentes, automacoes, status) VALUES
('Básico', 'Plano ideal para pequenas empresas', 99.90, 1, false, 2, 5, true),
('Profissional', 'Para empresas em crescimento', 199.90, 3, true, 5, 10, true),
('Enterprise', 'Solução completa para grandes empresas', 499.90, 10, true, 15, 30, true);

-- Insert sample addons
INSERT INTO addon (nome, descricao, valor, status) VALUES
('Caixa Extra', 'Adicione mais uma caixa de entrada', 29.90, true),
('Atendente Plus', 'Adicione um atendente extra', 49.90, true),
('Automação Pro', 'Pacote com 5 automações adicionais', 39.90, true),
('WhatsApp Business', 'Integração com WhatsApp Business API', 99.90, true);

-- Insert sample commercial affiliates
INSERT INTO cliente_afiliado (
  cliente_afiliado_id,
  user_id,
  creator_id,
  email,
  nome,
  telefone,
  desconto,
  comissao,
  codigo_cupom,
  vencimento,
  status
) 
SELECT 
  uuid_generate_v4(),
  u.id,
  a.id,
  'affiliate1@example.com',
  'Affiliate One',
  '(11) 99999-9999',
  10.0,
  5.0,
  'AFF001',
  now() + interval '1 year',
  true
FROM usuario u 
CROSS JOIN usuario a
WHERE u.cargo_id = 4 
AND a.cargo_id = 1 
LIMIT 1;

-- Insert sample proposals
INSERT INTO outrpropostas (
  cliente_final_cliente_final_id,
  ava_ava_id,
  plano_outr_plano_outr_id,
  valor,
  email_empresa,
  email_empresarial,
  nome_empresa,
  cnpj,
  responsavel,
  cpf,
  telefone,
  wallet_id
)
SELECT
  c.id as cliente_id,
  a.id as ava_id,
  p.id as plano_id,
  p.valor,
  'empresa@example.com',
  'comercial@example.com',
  'Empresa Exemplo LTDA',
  '12.345.678/0001-90',
  'João Responsável',
  '123.456.789-00',
  '(11) 99999-9999',
  'WALLET123'
FROM usuario c
CROSS JOIN usuario a
CROSS JOIN plano_outr p
WHERE c.cargo_id = 4
AND a.cargo_id = 3
LIMIT 1;