import { useState } from "react";
import ProposalFormPlano from "./Proposal.Form.Plano";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import FormProps from "../../Models/FormProps";
import { PropostaDTO } from "../../Models/Propostas";
import ProposalFormResume from "./Proposal.Form.Resume";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../components/AuthProvider";
import { AlertDialog } from "../../components/Dialogs/Dialogs";


export default function ProposalForm({ id }: FormProps) {
  const [step, setStep] = useState(0);
  const [proposta, setProposta] = useState<PropostaDTO>({} as PropostaDTO);
  const { user } = useAuth();


  const handleNext = () => {
    if (validationForm())
      setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const validationForm = () => {
    if ((!proposta.nome || proposta.nome.trim() === "") && (!proposta.email || proposta.email.trim() === "") && (step == 1))  {
      AlertDialog("Todos os campos são obrigatórios");
      return false;
    }
    return true;
  };


  const handleSubmit = async () => {
    const newproposta = { ...proposta };
    delete newproposta["addons"];
    setProposta({ ...newproposta, user_id: user?.id });
    console.log(proposta);
    const { error: insertError } = await supabase.from("proposta").insert([proposta]);
  };



  return (
    <>
      {step === 0 && <ProposalFormPlano proposta={proposta} setProposta={setProposta} />}
      {step === 1 && <ProposalFormCliente proposta={proposta} setProposta={setProposta} />}
      {step === 2 && <ProposalFormResume proposta={proposta} setProposta={setProposta} />}
      <div className="flex justify-between mt-4">
        {step > 0 && <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleBack}>Voltar</button>}
        {step == 0 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Clientes</button>}
        {step == 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Confirmar</button>}
        {step == 2 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Salvar</button>}
      </div>
    </>
  );
}