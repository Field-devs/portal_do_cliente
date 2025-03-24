import { useEffect, useState } from "react";
import FormProps from "../../../../Models/FormProps";
import getDefaultPropostaDTO, { Proposta, PropostaDTO } from "../../../../Models/Propostas";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../components/AuthProvider";
import { AlertDialog, AskDialog, ErrorDialog } from "../../../../components/Dialogs/Dialogs";
import { validateEmail } from "../../../../utils/Validation";
import ProposalFormPlano from "./Proposal.Form.Plano";
import { TEST_MODE_MOCK as TEST_DISABLE_DATA } from "../../../../utils/consts";
import ProposalFormCliente from "./Proposal.Form.Cliente";
import ProposalFormFinish from "./Proposal.Form.Finish";
import ProposalFormResume from "./Proposal.Form.Resume";

export default function ProposalForm({ id, onCancel }: FormProps) {
  const [step, setStep] = useState(0);
  const [propostaDTO, setPropostaDTO] = useState<PropostaDTO>(getDefaultPropostaDTO());
  //const [propostaDTO, setPropostaDTO] = useState<PropostaDTO>({active: true} as PropostaDTO);

  const [idproposta, setIdProposta] = useState();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [stepLimit] = useState(3);


  useEffect(() => {
    setPropostaDTO({ ...propostaDTO, active: false });
  }, []);


  useEffect(() => {
    console.clear();
    console.log("Plano", propostaDTO.plano_id);
    console.log("SubTotal", propostaDTO.subtotal);
    console.log("Total", propostaDTO.total);
    console.log("CUPOM / Desconto", propostaDTO.cupom, propostaDTO.cupom_desconto)
  }, [propostaDTO]);



  useEffect(() => {
    if (!id) return;
    const fetchProposta = async () => {
      let { data: proposta, error } = await supabase.from('proposta').select('*').eq('id', id).single();
      if (error) {
        ErrorDialog("Erro ao carregar proposta: " + error.message);
      }
      if (proposta) {
        setIdProposta(proposta.id);
        setPropostaDTO(propostaDTO); // Atualiza o estado global
      }
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
    if (step === 2) {
      if ((!propostaDTO.emp_nome || propostaDTO.emp_nome.trim() === "") && (!propostaDTO.emp_email || propostaDTO.emp_email.trim() === "")) {
        AlertDialog("Todos os campos são obrigatórios");
        return false;
      }
      if (propostaDTO.total <= 5) {
        AlertDialog("O Valor da proposta não pode ser menor ou igual a 5");
        return false;
      }
      if (validateEmail(propostaDTO.emp_email) === false) {
        AlertDialog("Email inválido");
        return false;
      }
    }
    return true;
  };

  const setPropostaToInsert = (proposta: Proposta): PropostaDTO => {
    let desconto = parseFloat(proposta.desconto.toString().replace('%', ''));
    const propostaToInsert = { ...proposta, desconto: desconto, user_id: user?.id };
    let addons = propostaToInsert.addons;
    return propostaToInsert;
  };

  const handleSubmit = async () => {
    if (validationForm() === false) return;
    // let response = await AskDialog("Deseja realmente salvar a proposta?", "Salvar Proposta");

    const propostaToInsert = setPropostaToInsert(propostaDTO);

    if (TEST_DISABLE_DATA === false) {
      // Extrai o addons e Remove o Addons do objeto propostaToInsert
      let addons = propostaToInsert.addons;
      delete propostaToInsert.addons;

      let { data: insertData, error: insertError } = await supabase.from("proposta").insert([propostaToInsert]).select("id");
      if (insertData) {
        setIdProposta(insertData[0].id);
        // set in addons proposta_id 
        if (addons) {
          addons = addons.map((addon) => ({
            ...addon,
            proposta_id: insertData[0].id,
          }));
        }
        let { data: insertData, error: insertError } = await supabase.from("proposta").insert([propostaToInsert]).select("id");

        if (addons) {
          const addonsToInsert = addons.map((addon) => ({
            idproposta: insertData[0].id,
            idaddon: addon.addon_id,
            valor: addon.unit,
          }));
          await supabase.from("proposta_addons").insert(addonsToInsert);
        }
      }

      if (insertError) {
        ErrorDialog("Erro ao salvar proposta: " + insertError.message);
        setLoading(false);
        return;
      }
    }
    setFinish(true);
    setPropostaDTO(propostaToInsert)
    if (step < stepLimit)
      handleNext();
  };



  return (
    <>
      {step === 0 && <ProposalFormPlano proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {/* {step === 1 && <ProposalFormResume finish={finish} id={idproposta} proposta={propostaDTO} setProposta={setPropostaDTO} />} 
      {step === 2 && <ProposalFormCliente proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {step === stepLimit && <ProposalFormFinish />} */}

      <div className="flex justify-between mt-4">

        {finish == false && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Cancelar
          </button>
        )}

        {finish == false && (
          <div className="flex space-x-2">
            {(step > 0 && step < stepLimit) && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleBack}>Voltar</button>}
            {step < stepLimit - 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>Avançar</button>}
            {step == stepLimit - 1 && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Enviar Proposta</button>}
          </div>
        )}

        {finish && (
          <div className="flex space-x-2">
          </div>
        )}
        {finish && (
          <div className="flex space-x-2">
            <button onClick={onCancel} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" >Sair</button>
          </div>
        )}

      </div >
    </>
  );
}