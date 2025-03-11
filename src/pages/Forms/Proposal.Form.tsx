import { useState } from "react";
import ProposalFormPlano from "./Proposal.Form.Plano";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import FormProps from "../../Models/FormProps";
import { Proposta } from "../../Models/Propostas";
import { AskDialog } from "../../components/Dialogs/SweetAlert";
import ProposalConfirm from "./ProposalConfirm";
import ProposalFormResume from "./Proposal.Form.Resume";


export default function ProposalForm() : FormProps {
  const [step, setStep] = useState(0);
  const [sender, setProsta] = useState<Proposta>();

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handlePropostaSubmit = (novaProposta : Proposta) => {
    setProsta(novaProposta);
  };

  function handleConfirm(): void {
    AskDialog("Você tem certeza que deseja confirmar a proposta atual ?").then((result) => {
      if (result.isConfirmed) {
        handleNext();
      }
    });
  }

  return (
    <>
      {step === 0 && <ProposalFormPlano onSubmit={handlePropostaSubmit} sender={sender} />}
      {step === 1 && <ProposalFormCliente sender={sender} />}
      {step === 2 && <ProposalFormResume sender={sender} />}
      <div className="flex justify-between mt-4">
        {step > 0 && <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleBack}>Voltar</button>}
        {step == 0 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Clientes</button>}
        {step == 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleConfirm}>Confirmar</button>}
        {step == 2 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleConfirm}>Confirmar</button>}
      </div>
    </>
  );
}