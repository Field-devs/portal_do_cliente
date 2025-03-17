import { ErrorDialog } from "../../../components/Dialogs/Dialogs";
import { supabase } from "../../../lib/supabase";
import { Proposta } from "../../../Models/Propostas";

async function GetProposal(id: string): Promise<Proposta | undefined> {
  const { data, error } = await supabase
    .rpc('fn_proposta_confirm', { p_id: id })
    .single();
  if (error) {
    ErrorDialog("Erro ao buscar proposta");
  }
  if (data) {
    return data as Proposta;
  }
  return undefined;
}

// Save 
async function SaveProposal(proposta: Proposta) {
  const { data, error } = await supabase
    .from('proposta')
    .update(proposta)
    .eq('id', proposta.id);
  if (error) {
     ErrorDialog("Erro ao salvar proposta");
  }
  if (data) {
    return data;
  }
  return undefined;
}

export { GetProposal, SaveProposal }
  