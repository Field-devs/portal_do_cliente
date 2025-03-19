import { useEffect, useState } from "react";
import FormProps from "../../Models/FormProps";
import getDefaultPropostaDTO, { Proposta, PropostaDTO } from "../../Models/Propostas";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../components/AuthProvider";
import { AlertDialog, AskDialog, ErrorDialog } from "../../components/Dialogs/Dialogs";
import { validateEmail } from "../../utils/Validation";
import ProposalFormPlano from "./Proposal.Form.Plano";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import ProposalFormResume from "./Proposal.Form.Resume";

export default function ProposalForm({ id, onCancel }: FormProps) {
  const [step, setStep] = useState(0);

  const [propostaDTO, setPropostaDTO] = useState<PropostaDTO>(getDefaultPropostaDTO() as PropostaDTO);    
  const [idproposta, setIdProposta] = useState();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const mapPropostaToDTO = (proposta: Proposta): PropostaDTO => {
    const { id, dt, dt_add, dt_update, user_add, user_update, status, ...propostaDTO } = proposta;
    return propostaDTO;
  };

  useEffect(() => {
    if (!id) return;
    const fetchProposta = async () => {
      let { data: proposta, error } = await supabase.from('proposta').select('*').eq('id', id).single();
      if (error) {
        ErrorDialog("Erro ao carregar proposta: " + error.message);
      }
      if (proposta) {
        setIdProposta(proposta.id);
        const propostaDTO = mapPropostaToDTO(proposta); // Mapeia os dados
        setPropostaDTO(propostaDTO); // Atualiza o estado global
      }
      console.log("Proposta", propostaDTO);
    };
    fetchProposta();
  }, [id]);

  const handleNext = () => {
    if (validationForm())
      setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const validationForm = () => {
    if (step === 1) {
      if ((!propostaDTO.emp_nome || propostaDTO.emp_nome.trim() === "") && (!propostaDTO.emp_email || propostaDTO.emp_email.trim() === "")) {
        AlertDialog("Todos os campos são obrigatórios");
        return false;
      }
      if (validateEmail(propostaDTO.emp_email) === false) {
        AlertDialog("Email inválido");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validationForm() === false) return;
    let response = await AskDialog("Deseja realmente salvar a proposta?", "Salvar Proposta");
    if (response.value === true) {
      setLoading(true);
      const newproposta = { ...propostaDTO };
      delete newproposta.addons; // Remove o campo addons
      delete newproposta.total; // Remove o campo addons

      // Remover o % de desconto
      if (newproposta.desconto) {
        newproposta.desconto = parseFloat(newproposta.desconto.toString().replace('%', ''));
      }
      const propostaToInsert = { ...newproposta, user_id: user?.id };
      setPropostaDTO(propostaToInsert); // Atualiza o estado com o objeto modificado

      const { data: insertData, error: insertError } = await supabase.from("proposta").insert([propostaToInsert]).select("id");
      if (insertData) {
        setIdProposta(insertData[0].id);
      }

      if (insertError) {
        ErrorDialog("Erro ao salvar proposta: " + insertError.message);
        setLoading(false);
        return;
      }
      setPropostaDTO(propostaDTO)
      handleNext();
    }
  };

  return (
    <>
      {/* {loading == true && <CircularWait message="Carregando..." />} */}
      {step === 0 && <ProposalFormPlano proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {step === 1 && <ProposalFormCliente proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {step === 2 && <ProposalFormResume proposta={propostaDTO} setProposta={setPropostaDTO} />}
      <div className="flex justify-between mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600/40 transition-colors rounded-lg"
        >
          Cancelar
        </button>
        <div className="flex space-x-2">
        {(step > 0 && step < 2) && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600/40 transition-colors rounded-lg"
          >
            Voltar
          </button>
        )}
        {step == 0 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Avançar</button>}
        {step == 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Enviar proposta</button>}
        </div>
        {/* {step == 2 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Salvar</button>} */}
      </div>
    </>
  );
}