import { useState } from "react";
import ProposalFormPlano from "./Proposal.Form.Plano";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import FormProps from "../../Models/FormProps";


export default function ProposalForm({onSuccess, onCancel, id}) : FormProps {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      {step === 0 && <ProposalFormPlano id={id} />}
      {step === 1 && <ProposalFormCliente id={id} />}
      <div className="flex justify-between mt-4">
        {step > 0 && <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleBack}>Voltar</button>}
        {step == 0 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Clientes</button>}
        {step == 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Confirmar</button>}
      </div>
    </>
  );
}