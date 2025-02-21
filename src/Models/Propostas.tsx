
interface Proposta {
  id: string;
  cliente_id: string;
  plano_id: string;
  valor: number;
  nome: string;
  email: string;
  fone: string;
  cnpj: string;
  dt: string;
  validade_dias: number;
  status: string;
  status_title: string;
}

export default Proposta;