import { useState } from "react";
import ProposalFormPlano from "./Proposal.Form.Plano";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import FormProps from "../../Models/FormProps";
import { PropostaDTO } from "../../Models/Propostas";
import ProposalFormResume from "./Proposal.Form.Resume";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../components/AuthProvider";
import { AlertDialog, AskDialog, ErrorDialog } from "../../components/Dialogs/Dialogs";
import { validateEmail } from "../../utils/Validation";

export default function ProposalForm({ id }: FormProps) {
  const [step, setStep] = useState(0);
  const [proposta, setProposta] = useState<PropostaDTO>({ desconto: 0, total: 0 } as PropostaDTO);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (validationForm())
      setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const validationForm = () => {
    if (step === 1) {
      if ((!proposta.nome || proposta.nome.trim() === "") && (!proposta.email || proposta.email.trim() === "")) {
        AlertDialog("Todos os campos são obrigatórios");
        return false;
      }
      if (validateEmail(proposta.email) === false) {
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
      const newproposta = { ...proposta };

      delete newproposta.addons; // Remove o campo addons
      delete newproposta.total; // Remove o campo addons

      const propostaToInsert = { ...newproposta, user_id: user?.id };
      setProposta(propostaToInsert); // Atualiza o estado com o objeto modificado
      const { error: insertError } = await supabase.from("proposta").insert([propostaToInsert]);
      if (insertError) {
        ErrorDialog("Erro ao salvar proposta: " + insertError.message);
        setLoading(false);
        return;
      }
      setProposta(proposta)
      handleNext();
      console.log(proposta);
    }
  };

  return (
    <>
      {/* {loading == true && <CircularWait message="Carregando..." />} */}
      {step === 0 && <ProposalFormPlano proposta={proposta} setProposta={setProposta} />}
      {step === 1 && <ProposalFormCliente proposta={proposta} setProposta={setProposta} />}
      {step === 2 && <ProposalFormResume proposta={proposta} setProposta={setProposta} />}
      <div className="flex justify-end mt-4 space-x-2">
        {step > 0 && <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleBack}>Voltar</button>}
        {step == 0 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Avançar</button>}
        {step == 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Confirmar Proposta</button>}
        {/* {step == 2 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Salvar</button>} */}
      </div>
    </>
  );
}