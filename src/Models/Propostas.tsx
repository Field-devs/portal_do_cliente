
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
  status: string;
  status_title: string;
}

export default Proposta;