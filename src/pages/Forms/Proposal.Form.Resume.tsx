import { useState } from "react";
import { User, Copy, X, CheckCircle, FileText } from 'lucide-react';
import { Proposta, PropostaDTO } from "../../Models/Propostas";
import { formatCurrency } from "../../utils/formatters";

export default function ProposalFormResume({ id, proposta, finish, setProposta }: { id: string, finish : boolean, proposta: PropostaDTO, setProposta: (data: PropostaDTO) => void }) {
  const [copied, setCopied] = useState(false);

  // Common CSS classes
  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-2xl font-bold text-light-text-primary dark:text-white mb-6";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const valueClass = "text-lg font-medium text-light-text-primary dark:text-white";
  const sectionClass = "mt-6 space-y-4";
  const buttonClass = "px-4 py-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";

  const copyToClipboard = async () => {
    try {
      const url = window.location.href.replace('/portal/proposals', '') + `/confirmation/${id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <div className={cardClass}>
      <h2 className={titleClass}>Resumo da Proposta</h2>

      <div className={sectionClass}>
        <div>
          <label className={labelClass}>Plano Escolhido</label>
          <p className={valueClass}>{proposta.plano_nome}</p>
        </div>

        <div>
          <label className={labelClass}>Valor Total</label>
          <p className={valueClass}>{formatCurrency(proposta.total)}</p>
        </div>

        <div>
          <label className={labelClass}>Add-ons</label>
          <p className={valueClass}>{formatCurrency(proposta.total_addons)}</p>
        </div>

        <div className="flex justify-end pt-6">
          {finish && (
            <button
              type="button"
              onClick={copyToClipboard}
              className={`${buttonClass} ${copied ? 'bg-green-50 text-green-600' : 'bg-brand text-white hover:bg-brand/90'}`}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}