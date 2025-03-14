import React, { useState } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import {
  FileText,
  Loader2,
  Save,
  UserCheck
} from 'lucide-react';

import { OUTR_BLACK_IMAGE_URL } from '../../../utils/consts';
import ProposalFormConfirmClient from './Proposal.Form.Confirm.Client';
import { AskDialog } from '../../../components/Dialogs/Dialogs';
import Cliente from '../../../Models/Cliente';

interface CommercialAffiliateFormProps {
  id: string;
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

// Common CSS classes
const iconGroupClass = "flex items-center space-x-3 mb-6";

export default function ProposalFormConfirm({ id, onCancel, initialData }: CommercialAffiliateFormProps) {
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState<Cliente>({});

  // Common CSS classes
  const labelClass = "block text-sm font-medium text-black";
  const inputClass = "pl-12 block w-full border border-gray-700/50 bg-white text-black focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors";
  const iconGroupClass = "flex items-center space-x-3 mb-6";
  const iconGroupTitleClass = "h-6 w-6 text-blue-400";
  const iconInputClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";


  const handleSubmit = async (e: React.FormEvent) => {
    let response = await AskDialog("Deseja realmente confirmar esta proposta? Voce não poderá mais editar esta proposta depois de confirmada.", "Confirmar Proposta", "Sim", "Não");
    //e.preventDefault();
  };

  return (
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
            <h3 className="text-lg font-medium text-blue-800">
              Resumo da Proposta
            </h3>
          </div>

          
        </div>

        <ProposalFormConfirmClient sender={cliente} />
        <ProposalFormConfirmClient sender={cliente} IsFinan={true} />

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