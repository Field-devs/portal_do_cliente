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
import { useCustomSetter, removeNode, onlyNumber } from "../../../../utils/Functions";
import PropostaAddon from "../../../../Models/Propostas.Addon";

export default function ProposalForm({ id, onCancel }: FormProps) {
  const [step, setStep] = useState(-1);
  const [propostaDTO, setPropostaDTO] = useState<PropostaDTO>(getDefaultPropostaDTO());
  const [addons, setAddons] = useState<PropostaAddon[]>();

  const [idproposta, setIdProposta] = useState();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [stepLimit] = useState(3);

  const setValueProposal = useCustomSetter(setPropostaDTO)
  const setValueAddons = useCustomSetter(setAddons)

  useEffect(() => {
    setValueProposal("active", true)
    setValueProposal("user_id", user?.id)

    if (!id) {
      setStep(0); // Inicia o passo
      return;
    }
    // Carrega a proposta
    const fetchProposta = async () => {
      let { data: proposta, error } = await supabase.from('proposta').select('*').eq('id', id).single();
      let { data: propostaAddons, error: errorAddon } = await supabase.from('proposta_addons').select('*').eq('proposta_id', id);

      if (error) {
        ErrorDialog("Erro ao carregar proposta: " + error.message);
      }

      if (proposta) {
        setIdProposta(proposta.id);
        setPropostaDTO(proposta); // Atualiza o estado global
      }

      if (propostaAddons) {
        setValueProposal("addons", propostaAddons);
      }

      setStep(0); // Inicia o passo
    };
    fetchProposta();
  }, []);

  const handleNext = async() => {
    let response = await validationForm();
    if ( response === false) return;
      setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };


  const ValidateMail = async () => {
    // Verifica se o usuario existe pelo email
    let { data: userData, error } = await supabase.from("users").select("*").eq("email", propostaDTO.emp_email);
    if (error) {
      ErrorDialog("Erro ao verificar usuario: " + error.message);
      return false;
    }
    if (userData?.length > 0) {
      AlertDialog("Usuario já existe, favor utilizar outro email");
      return false;
    }
    return true;
  }

  const validationForm = async () => {
    // Planos
    if (step === 0) {
      if (propostaDTO.perfil_id === null || propostaDTO.plano_id === "") {
        AlertDialog("Selecione um Tipo de Cliente");
        return false;
      }
      if (propostaDTO.plano_id === null || propostaDTO.plano_id === "") {
        AlertDialog("Selecione um Plano");
        return false;
      }
    }    
    // Resumo
    else if (step === 1) {
      let _percent = onlyNumber(propostaDTO.desconto);
      setValueProposal("desconto", _percent);
    }
    // Cliente
    else if (step === 2) {
      if ((!propostaDTO.emp_nome || propostaDTO.emp_nome.trim() === "") && (!propostaDTO.emp_email || propostaDTO.emp_email.trim() === "")) {
        AlertDialog("Todos os campos são obrigatórios");
        return false;
      }
      // Verifica se o usuario existe pelo email
      let response = await ValidateMail();
      if (response === false) return false;

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

  const setPropostaToInsert = (proposta: PropostaDTO): PropostaDTO => {
    let _proposta = removeNode(proposta, ["addons", "total", "total_addons", "desconto_valor", "cupom_desconto_valor"]);
    if (proposta.id === null) {
      _proposta = removeNode(_proposta, ["id"]);
    }
    return _proposta;
  };

  const handleSubmit = async () => {
    let response = await validationForm();
    if (response === false) return;
    // Seta o usuario
    const propostaToInsert = setPropostaToInsert(propostaDTO);

    if (TEST_DISABLE_DATA === false) {

      if (propostaToInsert.id === undefined) {
        console.log("Criando nova proposta", propostaToInsert);
        let { data: insertData, error: insertError } = await supabase.from("proposta").insert([propostaToInsert]).select("id");
        if (insertData) {

          if (propostaDTO.addons) {
            setIdProposta(insertData[0].id);
            // proposta_id in all records 
            propostaDTO.addons.forEach((addon) => {
              addon.proposta_id = insertData[0].id;
            });
            await supabase.from("proposta_addons").insert(propostaDTO.addons);
          }
        }

        if (insertError) {
          ErrorDialog("Erro ao salvar proposta: " + insertError.message);
          setLoading(false);
          return;
        }
      }
      else {
        // Atualiza a proposta
        let { data: updateData, error: updateError } = await supabase.from("proposta").update(propostaToInsert).eq("id", propostaToInsert.id).select("id");
        if (updateError) {
          ErrorDialog("Erro ao atualizar proposta: " + updateError.message);
          setLoading(false);
          return;
        }
        else {
          // Remove os addons antigos
          await supabase.from("proposta_addons").delete().eq("proposta_id", propostaToInsert.id);

          // Adiciona os novos addons
          if (propostaDTO.addons.length > 0) {

            // proposta_id in all records 
            propostaDTO.addons.forEach((addon) => {
              addon.proposta_id = updateData[0].id;
            });
            await supabase.from("proposta_addons").insert(propostaDTO.addons);
          }
        }
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
      {step === 1 && <ProposalFormResume finish={finish} id={idproposta} proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {step === 2 && <ProposalFormCliente proposta={propostaDTO} setProposta={setPropostaDTO} />}
      {step === stepLimit && <ProposalFormFinish id={idproposta} />}

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