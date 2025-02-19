
interface Plan {
  id: string;
  nome: string;
  descricao: string;

  caixas_entrada: number;
  automacoes: number;
  atendentes: number;
  kanban: boolean;
  suporte_humano: boolean;
  whatsapp_oficial: boolean;

  valor: number;
  unidade: string;

  active: boolean;
  dt_add: string;
}

export default  Plan;