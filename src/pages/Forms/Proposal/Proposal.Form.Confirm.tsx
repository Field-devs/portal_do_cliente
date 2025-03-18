import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileText,
  Loader2,
  Save,
} from 'lucide-react';

import { useTheme } from '../../../components/ThemeProvider';
import ProposalFormConfirmClient from './Proposal.Form.Confirm.Client';

import { AskDialog } from '../../../components/Dialogs/Dialogs';
import CircularWait from '../../../components/CircularWait';
import { GetProposal, SaveProposal } from './Proposal.Form.Confirm.Logical';
import { Proposta } from '../../../Models/Propostas';
import RegistrationSuccess from './Proposal.Form.Confirm.Finish';
import ProposalFinishError from './Proposal.Form.Confirm.Error';

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
  const [loading, setLoading] = useState(true);
  const [proposta, setProposta] = useState<Proposta>({} as Proposta);
  const [finish, setFinish] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { theme } = useTheme();

  const logoUrl = theme === 'dark'
    ? "https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/jlhnjs6i00f52ktsmqp3xncx/blocks/cz78pvc8stcisz1y8sq2khj1/OutrVertical_branco.png"
    : "https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/uold9kldsvwixo4di4cesi1e/blocks/cz78pvc8stcisz1y8sq2khj1/VerticalBlack.png";

  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      try {
        let response = await GetProposal(id);
        if (response) {
          setProposta(response);
        }
        else 
        {
          setLoading(false);
          setFinish(false);
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao buscar proposta:', error);
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
    await SaveProposal(proposta).then((response) => {
      if (response) {
        setTimeout(() => {
          setLoading(false);
          setFinish(true);
        }, 2000);
      } 
      else {
        setLoading(false);
      }
        
  })};

  return (
    loading ? <CircularWait messagefull="Confirmando a Proposta..." small={false} /> :
    finish ? <RegistrationSuccess /> :
    notFound ? <ProposalFinishError /> :
      <div className="flex justify-center items-center mt-20">

        <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl" >
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-12">
            <img 
              src={logoUrl}
              alt="Logo" 
              className="w-32 h-32 mb-6"
            />
            <h1 className="text-4xl font-bold text-brand tracking-wider text-center">
              CONFIRMAÇÃO DE PROPOSTA
            </h1>
          </div>

          {/* Informacoes Basicas */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">

            {/* Cabecalho 1 */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-400/10 p-3 rounded-xl">
                <FileText className={iconGroupTitleClass} />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
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
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                required
              />
              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                Eu li e aceito o{" "}
                <a
                  href="https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/hvstcq9bln1xt3x3pzrip009/blocks/cz78pvc8stcisz1y8sq2khj1/Termo%20de%20Ades%C3%A3o%20Wiseapp%20V1.pdf"
                  target='_blank'
                  className="text-brand hover:text-brand/90 dark:text-brand-400 dark:hover:text-brand-400/90 underline"
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
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600/40 transition-colors rounded-lg"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-brand hover:bg-brand/90 text-white transition-colors flex items-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !accepted}
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