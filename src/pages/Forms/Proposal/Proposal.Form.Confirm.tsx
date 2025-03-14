import React, { useState } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { supabase } from '../../../lib/supabase';
import {
  Mail,
  User,
  Phone,
  Percent,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
  Save,
  UserCheck
} from 'lucide-react';
import { OUTR_BLACK_IMAGE_URL } from '../../../utils/consts';
import ProposalFormConfirmClient from './Proposal.Form.Confirm.Client';
import { AskDialog } from '../../../components/Dialogs/Dialogs';
import Cliente from '../../../Models/Cliente';

interface CommercialAffiliateFormProps {
  id : string;
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente>({});  


  const handleSubmit = async (e: React.FormEvent) => {
    let response = await AskDialog("Deseja realmente confirmar esta proposta?", "Você não poderá mais alterar esta proposta após confirmar.");
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


        <ProposalFormConfirmClient />
        <ProposalFormConfirmClient IsFinan={true} />


        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-center text-red-400">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
  


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
            type="submit"
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