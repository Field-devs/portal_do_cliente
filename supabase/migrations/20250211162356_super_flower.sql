-- Create sequences
CREATE SEQUENCE IF NOT EXISTS pessoas_user_id_seq;

-- Create tables in order of dependencies

-- Cargo table
CREATE TABLE public.cargo (
  cargo_id bigint PRIMARY KEY,
  cargo text
);

-- Estado table
CREATE TABLE public.estado (
  estado_id bigint PRIMARY KEY,
  estado text,
  sigla text
);

-- Cidade table
CREATE TABLE public.cidade (
  cidade_id bigint PRIMARY KEY,
  cidade text,
  estado_id bigint NOT NULL,
  CONSTRAINT cidade_estado_fk FOREIGN KEY (estado_id) REFERENCES estado(estado_id)
);

-- Bairro table
CREATE TABLE public.bairro (
  bairro_id bigint PRIMARY KEY,
  bairro text,
  cidade_cidade_id bigint NOT NULL,
  CONSTRAINT bairro_cidade_fk FOREIGN KEY (cidade_cidade_id) REFERENCES cidade(cidade_id)
);

-- Logradouro table
CREATE TABLE public.logradouro (
  logradouro_id bigint PRIMARY KEY,
  logradouro text,
  nr_cep character varying(20),
  bairro_id bigint NOT NULL,
  CONSTRAINT logradouro_bairro_fk FOREIGN KEY (bairro_id) REFERENCES bairro(bairro_id)
);

-- Tipo Responsavel table
CREATE TABLE public.tipo_responsavel (
  tipo_responsavel_id bigint PRIMARY KEY,
  tipo_responsavel text
);

-- Responsavel Financeiro table
CREATE TABLE public.responsavel_financeiro (
  responsavel_id bigint PRIMARY KEY,
  cpf character varying(20),
  nome_completo text,
  telefone character varying(20),
  email text,
  data__nascimento timestamp without time zone,
  tipo_responsavel_id bigint NOT NULL,
  CONSTRAINT responsavel_financeiro_tipo_responsavel_fk FOREIGN KEY (tipo_responsavel_id) REFERENCES tipo_responsavel(tipo_responsavel_id)
);

-- Pessoas table
CREATE TABLE public.pessoas (
  pessoas_id bigint PRIMARY KEY DEFAULT nextval('pessoas_user_id_seq'),
  email text NOT NULL,
  senha text,
  nome text,
  telefone character varying(20),
  foto_perfil text,
  dt_criacao timestamp without time zone,
  status boolean,
  cargo_id bigint,
  CONSTRAINT pessoas_cargo_fk FOREIGN KEY (cargo_id) REFERENCES cargo(cargo_id)
);

-- OUTR table
CREATE TABLE public.outr (
  outr_id bigint PRIMARY KEY,
  cnpj character varying(20),
  email text,
  wallet_id text,
  pessoas_user_id bigint NOT NULL,
  CONSTRAINT outr_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id)
);

-- AVA table
CREATE TABLE public.ava (
  ava_id bigint PRIMARY KEY,
  cnpj character varying(20),
  nome_empresa text,
  email text,
  wallet_id text,
  responsavel_financeiro_responsavel_id bigint NOT NULL,
  responsavel_responsavel_id bigint NOT NULL,
  pessoas_user_id bigint NOT NULL,
  CONSTRAINT ava_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id),
  CONSTRAINT ava_responsavel_financeiro_fk FOREIGN KEY (responsavel_financeiro_responsavel_id) REFERENCES responsavel_financeiro(responsavel_id),
  CONSTRAINT ava_responsavel_fk FOREIGN KEY (responsavel_responsavel_id) REFERENCES responsavel_financeiro(responsavel_id)
);

-- Cliente Final table
CREATE TABLE public.cliente_final (
  cliente_final_id bigint PRIMARY KEY,
  cnpj character varying(20),
  nome_empresa text,
  responsavel_financeiro_responsavel_id bigint NOT NULL,
  responsavel_responsavel_id bigint NOT NULL,
  wallet_id text NOT NULL,
  pessoas_user_id bigint NOT NULL,
  CONSTRAINT cliente_final_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id),
  CONSTRAINT cliente_final_responsavel_financeiro_fk FOREIGN KEY (responsavel_financeiro_responsavel_id) REFERENCES responsavel_financeiro(responsavel_id),
  CONSTRAINT cliente_final_responsavel_fk FOREIGN KEY (responsavel_responsavel_id) REFERENCES responsavel_financeiro(responsavel_id)
);

-- Cliente Afiliado table
CREATE TABLE public.cliente_afiliado (
  cliente_afiliado_id bigint PRIMARY KEY,
  codigo_cupom text NOT NULL,
  desconto numeric(28,2) NOT NULL,
  comissao numeric(28,2),
  vencimento timestamp without time zone,
  telefone character varying(20),
  email text,
  pessoas_user_id bigint NOT NULL,
  CONSTRAINT cliente_afiliado_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id)
);

-- PF Cliente Afiliado table
CREATE TABLE public.pf_cliente_afiliado (
  pf_cliente_afiliado_id bigint PRIMARY KEY,
  cpf character varying(20),
  nome_completo text,
  data_nascimento timestamp without time zone,
  cliente_afiliado_id bigint NOT NULL,
  cpnj numeric,
  CONSTRAINT pf_cliente_afiliado_cliente_afiliado_fk FOREIGN KEY (cliente_afiliado_id) REFERENCES cliente_afiliado(cliente_afiliado_id)
);

-- Plano OUTR table
CREATE TABLE public.plano_outr (
  plano_outr_id bigint PRIMARY KEY,
  nome text,
  descricao text,
  caixas_entrada numeric(28,2),
  automacoes numeric(28,2),
  atendentes numeric(28,2),
  kanban boolean,
  suporte_humano numeric(28,2),
  valor numeric(28,2),
  unidade text,
  status boolean,
  dt_criacao timestamp without time zone,
  pessoas_user_id bigint NOT NULL,
  tipo_cliente text,
  CONSTRAINT plano_outr_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id)
);

-- Addon table
CREATE TABLE public.addon (
  addon_id bigint PRIMARY KEY DEFAULT nextval('pessoas_user_id_seq'),
  nome text,
  valor numeric(28,2),
  unidade text,
  qtd numeric(28,2),
  status boolean,
  dt_criacao timestamp without time zone,
  tipo_cliente text,
  pessoas_user_id bigint NOT NULL,
  CONSTRAINT addon_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id)
);

-- Addon AVA table
CREATE TABLE public.addon_ava (
  addon_ava_id bigint PRIMARY KEY,
  nome text,
  valor numeric(28,2),
  unidade text,
  qtd numeric(28,2),
  status boolean,
  dt_criacao timestamp without time zone,
  pessoas_user_id bigint NOT NULL,
  CONSTRAINT addon_ava_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id)
);

-- Plano AVA table
CREATE TABLE public.plano_ava (
  plano_ava_id bigint PRIMARY KEY,
  ava_id bigint NOT NULL,
  nome_plano text,
  valor numeric(28,2),
  unidade text,
  descricao text,
  data_criacao timestamp without time zone,
  status boolean,
  CONSTRAINT plano_ava_ava_fk FOREIGN KEY (ava_id) REFERENCES ava(ava_id)
);

-- Plano Caracteristica table
CREATE TABLE public.plano_caracteristica (
  plano_caracteristica_id bigint PRIMARY KEY,
  caracteristica text
);

-- Plano Caracteristica QTD table
CREATE TABLE public.plano_caracteristica_qtd (
  plano_caracteristica_qtd_id bigint PRIMARY KEY,
  plano_ava_id bigint NOT NULL,
  qtd_caracteristica numeric(28,2),
  plano_caracteristica_id bigint NOT NULL,
  CONSTRAINT plano_caracteristica_qtd_plano_ava_fk FOREIGN KEY (plano_ava_id) REFERENCES plano_ava(plano_ava_id),
  CONSTRAINT plano_caracteristica_qtd_plano_caracteristica_fk FOREIGN KEY (plano_caracteristica_id) REFERENCES plano_caracteristica(plano_caracteristica_id)
);

-- Status Pagamento table
CREATE TABLE public.status_pagamento (
  status_pagamemnto_id bigint PRIMARY KEY,
  status text
);

-- Relacao Financeira table
CREATE TABLE public.relacao_financeira (
  relacao_financeira_id bigint PRIMARY KEY,
  relacao_financeira text
);

-- Pagamentos table
CREATE TABLE public.pagamentos (
  pagamentos_id bigint PRIMARY KEY,
  valor numeric(28,2),
  forma_pagamento text,
  vencimento timestamp without time zone,
  relacao_financeira_id bigint NOT NULL,
  ava_id bigint NOT NULL,
  outr_id bigint NOT NULL,
  cliente_final_id bigint NOT NULL,
  status_pagamemnto_id bigint NOT NULL,
  CONSTRAINT pagamentos_relacao_financeira_fk FOREIGN KEY (relacao_financeira_id) REFERENCES relacao_financeira(relacao_financeira_id),
  CONSTRAINT pagamentos_ava_fk FOREIGN KEY (ava_id) REFERENCES ava(ava_id),
  CONSTRAINT pagamentos_outr_fk FOREIGN KEY (outr_id) REFERENCES outr(outr_id),
  CONSTRAINT pagamentos_cliente_final_fk FOREIGN KEY (cliente_final_id) REFERENCES cliente_final(cliente_final_id),
  CONSTRAINT pagamentos_status_pagamento_fk FOREIGN KEY (status_pagamemnto_id) REFERENCES status_pagamento(status_pagamemnto_id)
);

-- Contas Pagar AVA table
CREATE TABLE public.contas_pagar_ava (
  contas_pagar_ava_id bigint PRIMARY KEY,
  valor numeric(28,2),
  forma_pagamento text,
  vencimento timestamp without time zone,
  ava_id bigint NOT NULL,
  CONSTRAINT contas_pagar_ava_ava_fk FOREIGN KEY (ava_id) REFERENCES ava(ava_id)
);

-- Contas Pagar CF table
CREATE TABLE public.contas_pagar_cf (
  contas_pagar_cf_id bigint PRIMARY KEY,
  valor numeric(28,2),
  forma_pagamento text,
  vencimento timestamp without time zone,
  cliente_final_id bigint NOT NULL,
  ava_id bigint NOT NULL,
  CONSTRAINT contas_pagar_cf_cliente_final_fk FOREIGN KEY (cliente_final_id) REFERENCES cliente_final(cliente_final_id),
  CONSTRAINT contas_pagar_cf_ava_fk FOREIGN KEY (ava_id) REFERENCES ava(ava_id)
);

-- End AVA table
CREATE TABLE public.end_ava (
  end_ava_id bigint PRIMARY KEY,
  nr_end text,
  ds_complemento text,
  st_end text,
  logradouro_id bigint NOT NULL,
  ava_id bigint NOT NULL,
  CONSTRAINT end_ava_logradouro_fk FOREIGN KEY (logradouro_id) REFERENCES logradouro(logradouro_id),
  CONSTRAINT end_ava_ava_fk FOREIGN KEY (ava_id) REFERENCES ava(ava_id)
);

-- End Cliente Final table
CREATE TABLE public.end_cliente_final (
  end_cliente_final_id bigint PRIMARY KEY,
  nr_end text,
  ds_complemento text,
  st_end text,
  logradouro_id bigint NOT NULL,
  cliente_final_id bigint NOT NULL,
  CONSTRAINT end_cliente_final_logradouro_fk FOREIGN KEY (logradouro_id) REFERENCES logradouro(logradouro_id),
  CONSTRAINT end_cliente_final_cliente_final_fk FOREIGN KEY (cliente_final_id) REFERENCES cliente_final(cliente_final_id)
);

-- Proposta OUTR table
CREATE TABLE public.proposta_outr (
  proposta_id bigint PRIMARY KEY,
  dt_inicio timestamp without time zone,
  dt_fim timestamp without time zone,
  valor numeric(28,2),
  status boolean,
  cliente_final_id bigint NOT NULL,
  ava_id bigint NOT NULL,
  plano_outr_id bigint NOT NULL,
  addon_outr_id bigint NOT NULL,
  addon_id bigint NOT NULL,
  pessoas_user_id bigint NOT NULL,
  CONSTRAINT proposta_outr_cliente_final_fk FOREIGN KEY (cliente_final_id) REFERENCES cliente_final(cliente_final_id),
  CONSTRAINT proposta_outr_ava_fk FOREIGN KEY (ava_id) REFERENCES ava(ava_id),
  CONSTRAINT proposta_outr_plano_outr_fk FOREIGN KEY (plano_outr_id) REFERENCES plano_outr(plano_outr_id),
  CONSTRAINT proposta_outr_addon_outr_fk FOREIGN KEY (addon_outr_id) REFERENCES addon(addon_id),
  CONSTRAINT proposta_outr_addon_fk FOREIGN KEY (addon_id) REFERENCES addon(addon_id),
  CONSTRAINT proposta_outr_pessoas_fk FOREIGN KEY (pessoas_user_id) REFERENCES pessoas(pessoas_id)
);

-- Proposta AVA CF table
CREATE TABLE public.proposta_ava_cf (
  proposta_id bigint PRIMARY KEY,
  ava_id bigint NOT NULL,
  cliente_final_id bigint NOT NULL,
  dt_inicio timestamp without time zone,
  dt_fim timestamp without time zone,
  valor numeric(28,2),
  status boolean,
  plano_ava_id bigint NOT NULL,
  addon_ava_id bigint NOT NULL,
  CONSTRAINT proposta_ava_cf_ava_fk FOREIGN KEY (ava_id) REFERENCES ava(ava_id),
  CONSTRAINT proposta_ava_cf_cliente_final_fk FOREIGN KEY (cliente_final_id) REFERENCES cliente_final(cliente_final_id),
  CONSTRAINT proposta_ava_cf_plano_ava_fk FOREIGN KEY (plano_ava_id) REFERENCES plano_ava(plano_ava_id),
  CONSTRAINT proposta_ava_cf_addon_ava_fk FOREIGN KEY (addon_ava_id) REFERENCES addon_ava(addon_ava_id)
);

-- Enable Row Level Security
ALTER TABLE public.pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bairro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logradouro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_responsavel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsavel_financeiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ava ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliente_final ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliente_afiliado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pf_cliente_afiliado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon_ava ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_ava ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_caracteristica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_caracteristica_qtd ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relacao_financeira ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar_ava ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar_cf ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.end_ava ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.end_cliente_final ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposta_outr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposta_ava_cf ENABLE ROW LEVEL SECURITY;