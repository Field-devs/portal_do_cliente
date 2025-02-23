
interface Proposta {
  Id: string; 
  dt: string; 
  cliente_id: number;
  plano_id: number; 
  plano_nome: string;

  // Dados do Plano
  caixas_entrada: number;
  atendentes: number; 
  automacoes: number; 
  valor: number; 

  // Opções
  kanban: boolean; 
  suporte_humano: boolean; 
  whatsapp_oficial: boolean; 

  // Valores Adicionais Customizados
  caixas_entrada_qtde: number; 
  caixas_entrada_unit: number; 
  atendentes_qtde: number; 
  atendentes_unit: number; 
  automacoes_qtde: number; 
  automacoes_unit: number; 

  total: number;

  // Validade de 1 Dia
  validade: number; //  validade integer not null default 1,

  // Indica que foi enviado ou nao por email
  mail_send: boolean; 
  // PE = Pendente, AC - Aceita, RC - Recusada, EX - Expirado
  status: string; 
  status_title: string; // from view v_proposta

  // Usuario Proprietário
  user_id: string; //  user_id uuid not null references public.users (id),

  // Guarda Informacoes sobre a data de criacao e atualizacao do registro
  //dt_add: string; 
  //dt_update?: string;
  //user_add?: string;
  //user_update?: string;

  // Dados Basico do Cliente 
  nome: string;      
  cnpj: string;      
  email: string;     
  fone: string;      
}

export default Proposta;