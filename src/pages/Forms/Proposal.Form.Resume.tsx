import { useState } from "react";
import { User, Copy, X, CheckCircle } from 'lucide-react';
import Proposta from "../../Models/Propostas";

export default function ProposalFormResume({ proposta, setProposta }: { proposta: Proposta, setProposta: (data: Proposta) => void }) {
  const [copied, setCopied] = useState(false);


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const cardClass = "bg-white dark:bg-[#1E293B]/70 backdrop-blur-sm p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg";
  const inputClass = "pl-12 block w-full border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#0F172A]/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";
  const buttonClass = "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors";

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-50 dark:bg-blue-400/10 p-3 rounded-xl">
              <User className="h-6 w-6 text-brand dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Resumo da Proposta
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700/50 pb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Plano Escolhido</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{"--"}</p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700/50 pb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Valor</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0)}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={copyToClipboard}
              className={`${buttonClass} ${copied ? 'bg-green-50 text-green-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300`}
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
          </div>
        </div>
      </div>


    </div>
  );
}
