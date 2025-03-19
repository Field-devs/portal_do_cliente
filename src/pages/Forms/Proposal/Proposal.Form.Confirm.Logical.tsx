import { ErrorDialog } from "../../../components/Dialogs/Dialogs";
import { supabase } from "../../../lib/supabase";
import { Proposta, PropostaDTO } from "../../../Models/Propostas";

async function GetProposal(id: string): Promise<Proposta | undefined> {
  const { data, error } = await supabase
    .rpc('fn_proposta_confirm', { p_id: id })
    .single();
  if (error) {
    return undefined;
  }
  if (data) {
    return data as Proposta;
  }
  return undefined;
}

// Save 
async function SaveProposal(proposta: Proposta) {
  const proposMap: Proposta = {
    perfil_id: proposta.perfil_id,
    plano_id: proposta.plano_id,
    plano_nome: proposta.plano_nome,
    emp_cnpj: proposta.emp_cnpj,
    emp_nome: proposta.emp_nome,
    emp_email: proposta.emp_email,
    emp_fone: proposta.emp_fone,
    emp_cep: proposta.emp_cep,
    emp_logradouro: proposta.emp_logradouro,
    emp_bairro: proposta.emp_bairro,
    emp_cidade: proposta.emp_cidade,
    emp_uf: proposta.emp_uf,
    resp_cpf: proposta.resp_cpf,
    resp_nome: proposta.resp_nome,
    resp_email: proposta.resp_email,
    resp_fone: proposta.resp_fone,
    fin_cpf: proposta.fin_cpf,
    fin_nome: proposta.fin_nome,
    fin_email: proposta.fin_email,
    fin_fone: proposta.fin_fone,
    caixas_entrada_qtde: proposta.caixas_entrada_qtde,
    atendentes_qtde: proposta.atendentes_qtde,
    automacoes_qtde: proposta.automacoes_qtde,
    kanban: proposta.kanban,
    suporte_humano: proposta.suporte_humano,
    whatsapp_oficial: proposta.whatsapp_oficial,
    subtotal: proposta.subtotal,
    desconto: proposta.desconto,
    total_addons: proposta.total_addons,
    validade: proposta.validade,
    mail_send: proposta.mail_send,
    pay: proposta.pay,
    active: proposta.active,
    dt_add: proposta.dt_add,
    dt_update: proposta.dt_update,
    user_add: proposta.user_add,
    user_update: proposta.user_update,
    user_id: proposta.user_id,
    dt: proposta.dt,
    status:"AC" // Aceita
  };
  
  const { data, error } = await supabase
    .from('proposta')
    .update(proposMap)
    .eq('id', proposta.id);
  if (error) {
    ErrorDialog("Erro ao salvar proposta");
  }
  else 
  {
    return true;
  }
}


export { GetProposal, SaveProposal }
  