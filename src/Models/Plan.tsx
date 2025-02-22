
interface Plan {
  id: string;
  nome: string;
  descricao: string;
  user_id: string;
  caixas_entrada: number;
  automacoes: number;
  atendentes: number;
  kanban: boolean;
  suporte_humano: boolean;
  whatsapp_oficial: boolean;

  caixas_entrada_add: number;
  automacoes_add: number;
  atendentes_add: number;
  valor: number;

  unidade: string;

  active: boolean;
  dt_add: string;
}

export default  Plan;