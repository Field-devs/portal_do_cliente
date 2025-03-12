import { useEffect, useState } from "react";
import ProposalFormPlano from "./Proposal.Form.Plano";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import FormProps from "../../Models/FormProps";
import Proposta from "../../Models/Propostas";
import { set } from "date-fns";


export default function ProposalForm({id} : FormProps) {
  const [step, setStep] = useState(0);
  const [proposta, setProposta] = useState<Proposta>({} as Proposta);
  
  const handleNext = () => {
    //console.log(proposta);
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };


  return (
    <>
      {step === 0 && <ProposalFormPlano proposta={proposta} setProposta={setProposta} />}
      {step === 1 && <ProposalFormCliente proposta={proposta} setProposta={setProposta} />}
      <div className="flex justify-between mt-4">
        {step > 0 && <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleBack}>Voltar</button>}
        {step == 0 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Clientes</button>}
        {step == 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Confirmar</button>}
      </div>
    </>
  );
}