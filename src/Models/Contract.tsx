
interface Contract {
  id: string;
  contrato_ref_id: string | null;
  proposta_id: string;
  user_id: string;
  dt: string;
  plano_id: string;
  plano_nome: string;
  status: string;
  dt_add: string;
  dt_update: string | null;
  user_add: string | null;
  user_update: string | null;
  status_title: string;
  tipo: string;
  nome: string;
  fone: string;
  email: string;
  endereco: string;
  cnpj: string;
  cupom: string;
  desconto: string;
  comissao: string;
  vencimento: string;
}

export default Contract;