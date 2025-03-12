interface Proposta {
  id?: string; // uuid
  user_id: string; // uuid
  dt: string; // TIMESTAMP (ISO 8601 string)
  perfil_id: string;
  plano_id: string; // uuid
  plano_nome: string;
  nome: string;
  nasc: string | null; // date (ISO 8601 string)
  fone: string;
  email: string;
  endereco: string | null;
  cnpjcpf: string | null;
  nome_finan: string | null;
  fone_finan: string | null;
  email_finan: string | null;
  endereco_finan: string | null;
  cnpj_cpf_finan: string | null;
  caixas_entrada_qtde: number;
  atendentes_qtde: number;
  automacoes_qtde: number;
  kanban: boolean;
  suporte_humano: boolean;
  whatsapp_oficial: boolean;
  total: number;
  total_addons: number;
  validade: number;
  mail_send: boolean;
  pay: boolean;
  status: 'PE' | 'AC' | 'AP' | 'RC' | 'EX';
  active: boolean;
  dt_add: string; // TIMESTAMP (ISO 8601 string)
  dt_update: string | null; // TIMESTAMP (ISO 8601 string)
  user_add: string | null;
  user_update: string | null;
}

interface PropostaDTO {
  user_id: string; // uuid
  dt: string; // TIMESTAMP (ISO 8601 string)
  perfil_id: string;
  plano_id: string; // uuid
  plano_nome: string;
  nome: string;
  nasc: string | null; // date (ISO 8601 string)
  fone: string;
  email: string;
  endereco: string | null;
  cnpjcpf: string | null;
  nome_finan: string | null;
  fone_finan: string | null;
  email_finan: string | null;
  endereco_finan: string | null;
  cnpj_cpf_finan: string | null;
  caixas_entrada_qtde: number;
  atendentes_qtde: number;
  automacoes_qtde: number;
  kanban: boolean;
  suporte_humano: boolean;
  whatsapp_oficial: boolean;
  subtotal: number | 0;
  desconto: number | 0;
  total: number | 0;
  total_addons: number | 0;
  validade: number;
  mail_send: boolean;
  pay: boolean;
  active: boolean;
  dt_add: string; // TIMESTAMP (ISO 8601 string)
  dt_update: string | null; // TIMESTAMP (ISO 8601 string)
  user_add: string | null;
  user_update: string | null;
}


export type {Proposta, PropostaDTO};