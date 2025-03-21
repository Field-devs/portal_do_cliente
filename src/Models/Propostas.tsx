import PropostaAddon from "./Propostas.Addon";

interface Proposta {
  id?: string; // uuid
  user_id: string; // uuid
  dt: string; // TIMESTAMP (ISO 8601 string)
  perfil_id?: string | null; // uuid
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

  resp_cpf?: string | null;
  resp_nome?: string;
  resp_email?: string;
  resp_fone?: string;

  fin_cpf?: string | null;
  fin_nome?: string;
  fin_email?: string;
  fin_fone?: string;


  caixas_entrada_qtde: number | 0;
  atendentes_qtde: number | 0;
  automacoes_qtde: number | 0;
  kanban: boolean | true;
  suporte_humano: boolean | true;
  whatsapp_oficial: boolean | true;

  cupom?: string | null; // uuid
  cupom_desconto: number | 0; // uuid

  subtotal: number | 0;
  desconto: number | 0;
  total_addons: number | 0;
  total: number | 0;

  validade: number | 15;
  mail_send: boolean | false;
  pay: boolean | false;
  dt_add: string; // TIMESTAMP (ISO 8601 string)
  dt_update: string | null; // TIMESTAMP (ISO 8601 string)
  user_add: string | null;
  user_update: string | null;

  status: string | 'PE';

  cob_pay_link?: string | null; // uuid

  addons?: PropostaAddon[]; // Array de addons, referência para a tabela 'plano_addon'
  active: boolean | true;

}
// DTO
type PropostaDTO = Omit<Proposta, 'id' | 'dt' | 'dt_add' | 'dt_update' | 'user_add' | 'user_update' | 'status'>;

let getDefaultPropostaDTO = (): PropostaDTO => ({
  perfil_id: "",
  plano_id: "",
  plano_nome: "",
  user_id: "", // uuid

  emp_cnpj: null,
  emp_nome: "",
  emp_email: "",
  emp_fone: "",
  emp_cep: null,
  emp_logradouro: null,
  emp_bairro: null,
  emp_cidade: null,
  emp_uf: null,

  resp_cpf: null,
  resp_nome: "",
  resp_email: "",
  resp_fone: "",

  fin_cpf: null,
  fin_nome: "",
  fin_email: "",
  fin_fone: "",

  caixas_entrada_qtde: 0,
  atendentes_qtde: 0,
  automacoes_qtde: 0,
  kanban: true,
  suporte_humano: true,
  whatsapp_oficial: true,

  cupom: null,
  cupom_desconto: 0,

  subtotal: 0,
  desconto: 0,
  total_addons: 0,
  total: 0,

  validade: 15,
  mail_send: false,
  pay: false,
  active: true

});


export default getDefaultPropostaDTO;
export type { Proposta, PropostaDTO, getDefaultPropostaDTO };