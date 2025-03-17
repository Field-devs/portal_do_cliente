interface Proposta {
  id?: string; // uuid
  user_id: string; // uuid
  dt: string; // TIMESTAMP (ISO 8601 string)
  perfil_id: string;
  plano_id: string; // uuid
  plano_nome: string;


  emp_cnpj: string | null;
  emp_nome: string;
  emp_email: string;
  emp_fone: string;
  emp_cep: string | null;
  emp_logradouro: string | null;
  emp_bairro: string | null;
  emp_cidade: string | null;
  emp_uf: string | null;

  resp_cpf: string | null;
  resp_nome: string;
  resp_email: string;
  resp_fone: string;

  fina_cpf: string | null;
  fina_nome: string;
  fina_email: string;
  fina_fone: string;


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
  validade: number | 15;
  mail_send: boolean;
  pay: boolean;
  active: boolean;
  dt_add: string; // TIMESTAMP (ISO 8601 string)
  dt_update: string | null; // TIMESTAMP (ISO 8601 string)
  user_add: string | null;
  user_update: string | null;

  status : string;

}

interface PropostaDTO {
  user_id: string; // uuid
  dt: string; // TIMESTAMP (ISO 8601 string)
  perfil_id: string;
  plano_id: string; // uuid
  plano_nome: string;


  emp_cnpj: string | null;
  emp_nome: string;
  emp_email: string;
  emp_fone: string;
  emp_cep: string | null;
  emp_logradouro: string | null;
  emp_bairro: string | null;
  emp_cidade: string | null;
  emp_uf: string | null;

  resp_cpf: string | null;
  resp_nome: string;
  resp_email: string;
  resp_fone: string;

  fina_cpf: string | null;
  fina_nome: string;
  fina_email: string;
  fina_fone: string;


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
  validade: number | 15;
  mail_send: boolean;
  pay: boolean;
  active: boolean;
  dt_add: string; // TIMESTAMP (ISO 8601 string)
  dt_update: string | null; // TIMESTAMP (ISO 8601 string)
  user_add: string | null;
  user_update: string | null;
  status : string;
}


export type { Proposta, PropostaDTO };