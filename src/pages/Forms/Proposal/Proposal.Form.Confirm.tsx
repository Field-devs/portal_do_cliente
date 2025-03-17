import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileText,
  Loader2,
  Save
} from 'lucide-react';

import { OUTR_BLACK_IMAGE_URL } from '../../../utils/consts';
import ProposalFormConfirmClient from './Proposal.Form.Confirm.Client';
import { AskDialog } from '../../../components/Dialogs/Dialogs';
import CircularWait from '../../../components/CircularWait';
import { GetProposal, SaveProposal } from './Proposal.Form.Confirm.Logical';
import { Proposta } from '../../../Models/Propostas';

interface CommercialAffiliateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    nome: string;
    email: string;
    fone: number;
    desconto: number;
    comissao: number;
    vencimento: string;
    active: boolean;
  };
}

export default function ProposalFormConfirm({ onCancel, initialData }: CommercialAffiliateFormProps) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [proposta, setProposta] = useState<Proposta>({} as Proposta);

  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      try {
        let response = await GetProposal(id);
        if (response) {
          setProposta(response);
        }
      } catch (error) {
        console.error("Failed to fetch proposal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  // Common CSS classes
  const iconGroupClass = "flex items-center space-x-3 mb-6";
  const iconGroupTitleClass = "h-6 w-6 text-blue-400";

  const handleSubmit = async (e: React.FormEvent) => {
    let response = await AskDialog("Deseja realmente confirmar esta proposta? Voce não poderá mais editar esta proposta depois de confirmada.", "Confirmar Proposta", "Sim", "Não");
    setLoading(true);
    SaveProposal(proposta);
    setLoading(false);
    //e.preventDefault();
  };

  return (
    loading ? <CircularWait messagefull="Confirmando a Proposta..." small={false} /> :

      <div className="flex justify-center items-center mt-20">

        <form onSubmit={handleSubmit} className="space-y-6 max-w-8xl" >
          {/* Cabecalho 1 */}
          <div className={iconGroupClass}>
            <img src={OUTR_BLACK_IMAGE_URL} alt="Logo" width="48" height="48" />
            <h4 className="text-2xl font-medium text-blue-800">
              CONFIRMAÇÃO DE PROPOSTA
            </h4>
          </div>

          {/* Informacoes Basicas */}
          <div className="bg-white backdrop-blur-sm p-10 border border-gray-700/50">

            {/* Cabecalho 1 */}
            <div className={iconGroupClass}>
              <div className="bg-blue-400/10 p-3 rounded-xl">
                <FileText className={iconGroupTitleClass} />
              </div>
              <h3 className="text-2xl font-medium text-blue-800">
                Resumo da Proposta
              </h3>
            </div>


          </div>

          <ProposalFormConfirmClient Tipo='EMP' sender={proposta} setSender={setProposta} />
          <ProposalFormConfirmClient Tipo='RES' sender={proposta} setSender={setProposta}  />
          <ProposalFormConfirmClient Tipo='FIN' sender={proposta} setSender={setProposta} />

          {/* Termo de Adesao */}
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                required
              />
              <span className="ml-2 text-sm text-black">
                Eu li e aceito o{" "}
                <a
                  href="#"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // Logic to open the form to show the terms
                  }}
                >
                  Termo de Adesão
                </a>
              </span>
            </label>
          </div>

          {/* Action Buttons */}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-[#0F172A]/60 text-black hover:bg-[#0F172A]/40 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              //type="submit"
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600/80 text-white transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {initialData ? 'Confirmar' : 'Confirmar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
  );
}