-- Insert sample users with different roles
INSERT INTO public."USER" (name, email) VALUES
  ('João Silva', 'joao.silva@example.com'),
  ('Maria Santos', 'maria.santos@example.com'),
  ('Pedro Oliveira', 'pedro.oliveira@example.com'),
  ('Ana Costa', 'ana.costa@example.com'),
  ('Carlos Ferreira', 'carlos.ferreira@example.com');

-- Insert sample plans
INSERT INTO plano_outr (nome, descricao, valor, caixas_entrada, whatsapp_oficial, atendentes, automacoes, status) VALUES
  ('Básico', 'Plano ideal para pequenas empresas', 99.90, 1, false, 2, 5, true),
  ('Profissional', 'Para empresas em crescimento', 199.90, 3, true, 5, 10, true),
  ('Enterprise', 'Solução completa para grandes empresas', 499.90, 10, true, 15, 30, true),
  ('Custom', 'Plano personalizado para necessidades específicas', 999.90, 20, true, 30, 50, true);

-- Insert sample addons
INSERT INTO addon (nome, descricao, valor, status) VALUES
  ('Caixa Extra', 'Adicione mais uma caixa de entrada', 29.90, true),
  ('Atendente Plus', 'Adicione um atendente extra', 49.90, true),
  ('Automação Pro', 'Pacote com 5 automações adicionais', 39.90, true),
  ('WhatsApp Business', 'Integração com WhatsApp Business API', 99.90, true),
  ('Relatórios Avançados', 'Dashboard e relatórios detalhados', 79.90, true);

-- Insert sample commercial affiliates
INSERT INTO cliente_afiliado (
  user_user_id,
  email,
  nome,
  telefone,
  desconto,
  comissao,
  codigo_cupom,
  vencimento,
  status
) VALUES
  (
    (SELECT id FROM public."USER" WHERE email = 'joao.silva@example.com' LIMIT 1),
    'afiliado1@example.com',
    'Parceiro Comercial 1',
    '(11) 98765-4321',
    10.0,
    15.0,
    'PARC10OFF',
    NOW() + INTERVAL '1 year',
    true
  ),
  (
    (SELECT id FROM public."USER" WHERE email = 'maria.santos@example.com' LIMIT 1),
    'afiliado2@example.com',
    'Parceiro Comercial 2',
    '(11) 91234-5678',
    15.0,
    20.0,
    'PARC15OFF',
    NOW() + INTERVAL '1 year',
    true
  );

-- Insert sample proposals
INSERT INTO proposta_outr (
  cliente_id,
  plano_id,
  valor,
  status,
  email_empresa,
  email_empresarial,
  nome_empresa,
  cnpj,
  responsavel,
  cpf,
  telefone,
  wallet_id
) VALUES
  (
    (SELECT id FROM public."USER" WHERE email = 'pedro.oliveira@example.com' LIMIT 1),
    (SELECT id FROM plano_outr WHERE nome = 'Básico' LIMIT 1),
    99.90,
    'pending',
    'empresa1@example.com',
    'financeiro@empresa1.com',
    'Empresa Teste 1 LTDA',
    '12.345.678/0001-90',
    'Pedro Oliveira',
    '123.456.789-00',
    '(11) 3456-7890',
    'wallet_123'
  ),
  (
    (SELECT id FROM public."USER" WHERE email = 'ana.costa@example.com' LIMIT 1),
    (SELECT id FROM plano_outr WHERE nome = 'Profissional' LIMIT 1),
    199.90,
    'accepted',
    'empresa2@example.com',
    'financeiro@empresa2.com',
    'Empresa Teste 2 LTDA',
    '98.765.432/0001-10',
    'Ana Costa',
    '987.654.321-00',
    '(11) 2345-6789',
    'wallet_456'
  ),
  (
    (SELECT id FROM public."USER" WHERE email = 'carlos.ferreira@example.com' LIMIT 1),
    (SELECT id FROM plano_outr WHERE nome = 'Enterprise' LIMIT 1),
    499.90,
    'pending',
    'empresa3@example.com',
    'financeiro@empresa3.com',
    'Empresa Teste 3 LTDA',
    '45.678.901/0001-23',
    'Carlos Ferreira',
    '456.789.012-34',
    '(11) 4567-8901',
    'wallet_789'
  );