interface Cliente {
  id?: string;
  user_id: string;
  perfil_id: number;
  cnpjcpf?: string;
  nome: string;
  fone: string;
  email: string;
  cep?: string;
  nasc?: string;
  logradouro?: string;
  numero?: number;
  bairro?: string;
  cidade?: string;
  uf?: string;
  referencia?: string;

  fin_cnpjcpf?: string;
  fin_nome: string;
  fin_fone: string;
  fin_email: string;
  fin_cep?: string;
  fin_logradouro: string;
  fin_numero?: number;
  fin_bairro: string;
  fin_cidade: string;
  fin_uf: string;
  fin_referencia?: string;

  wallet_id?: string;
  cupom?: string;
  desconto: number;
  comissao: number;
  vencimento?: string;

  active: boolean;
  dt_add?: string;
  dt_update?: string;
  user_add?: string;
  user_update?: string;
}

export default Cliente;