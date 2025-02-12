export interface User {
  USER_ID: string;
  EMAIL: string;
  NOME: string;
  CARGO_ID: number;
  DT_CRIACAO: string;
  STATUS: boolean;
  FOTO_PERFIL?: string;
}

export interface Address {
  LOGRADOURO: string;
  NUMERO: string;
  COMPLEMENTO?: string;
  BAIRRO: string;
  CIDADE: string;
  ESTADO: string;
  CEP: string;
}

export interface Plan {
  ID: string;
  NOME: string;
  DESCRICAO: string;
  VALOR: number;
  STATUS: boolean;
}

export interface Addon {
  ID: string;
  NOME: string;
  DESCRICAO: string;
  VALOR: number;
  STATUS: boolean;
}

export interface Proposal {
  ID: string;
  CLIENTE_ID: string;
  plano_outr_id: string;
  ADDONS: string[];
  VALOR_TOTAL: number;
  STATUS: string;
  DT_CRIACAO: string;
}

export interface Payment {
  ID: string;
  PROPOSTA_ID: string;
  VALOR: number;
  STATUS: string;
  DT_VENCIMENTO: string;
  DT_PAGAMENTO?: string;
}