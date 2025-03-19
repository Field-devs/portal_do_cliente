import { useEffect, useState } from "react";
import ProposalFormPlano from "./Proposal.Form.Plano";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import FormProps from "../../Models/FormProps";
import { Proposta, PropostaDTO } from "../../Models/Propostas";
import ProposalFormResume from "./Proposal.Form.Resume";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../components/AuthProvider";
import { AlertDialog, AskDialog, ErrorDialog } from "../../components/Dialogs/Dialogs";
import { validateEmail } from "../../utils/Validation";

export default function ProposalForm({ id }: FormProps) {
  const [step, setStep] = useState(0);

  const [propostaDTO, setPropostaDTO] = useState<PropostaDTO>({
    desconto: 0, total: 0, validade: 15
  } as PropostaDTO);

  const [idproposta, setIdProposta] = useState();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  function MapperPropostaDTO(proposta: Proposta) {
    setPropostaDTO({
      emp_nome: proposta.emp_nome,
      emp_email: proposta.emp_email,
      validade: proposta.validade,
      desconto: proposta.desconto,
    });
  }

  useEffect(() => {
    const fetchProposta = async () => {
      let { data: proposta, error } = await supabase.from('proposta').select('*').eq('id', id).single();
      proposta = proposta as PropostaDTO;
      if (error) {
        ErrorDialog("Erro ao carregar proposta: " + error.message);
      }
      if (proposta) {
        MapperPropostaDTO(proposta);
        setIdProposta(proposta.id);
      }
      console.log(propostaDTO);
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
      console.log(propostaDTO);
    }
  };

  return (
    <>
      {/* {loading == true && <CircularWait message="Carregando..." />} */}
      {step === 0 && <ProposalFormPlano proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {step === 1 && <ProposalFormCliente proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {step === 2 && <ProposalFormResume idProposta={idproposta} proposta={propostaDTO} setProposta={setPropostaDTO} />}
      <div className="flex justify-end mt-4 space-x-2">
        {(step > 0 && step < 2) && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600/40 transition-colors rounded-lg"
          >
            Voltar
          </button>
        )}
        {step == 0 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Avançar</button>}
        {step == 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Confirmar Proposta</button>}
        {/* {step == 2 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Salvar</button>} */}
      </div>
    </>
  );
}