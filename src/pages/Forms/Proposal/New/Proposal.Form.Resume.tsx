import { useState, useEffect } from "react";
import { User, Copy, X, CheckCircle, FileText, Package } from 'lucide-react';
import { Proposta, PropostaDTO } from "../../../../Models/Propostas";
import { formatCurrency } from "../../../../utils/formatters";
import { supabase } from "../../../../lib/supabase";
import PlanAddon from "../../../../Models/Plan.Addon";

export default function ProposalFormResume({ id, proposta, finish, setProposta }: { id: string, finish : boolean, proposta: PropostaDTO, setProposta: (data: PropostaDTO) => void }) {
  const [copied, setCopied] = useState(false);
  const [addonsData, setAddonsData] = useState<Record<string, PlanAddon>>({});
  
  // Common CSS classes
  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-2xl font-bold text-light-text-primary dark:text-white mb-6";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const valueClass = "text-lg font-medium text-light-text-primary dark:text-white";
  const sectionClass = "mt-6 space-y-4";
  const buttonClass = "px-4 py-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";

  useEffect(() => {
    const fetchAddonsData = async () => {
      if (proposta.addons && proposta.addons.length > 0) {
        const addonIds = proposta.addons.map(addon => addon.addon_id);
        const { data, error } = await supabase
          .from('plano_addon')
          .select('*')
          .in('id', addonIds);

        if (error) {
          console.error('Error fetching addons:', error);
          return;
        }

        const addonsMap = data.reduce((acc, addon) => {
          acc[addon.id] = addon;
          return acc;
        }, {});

        setAddonsData(addonsMap);
      }
    };

    fetchAddonsData();
  }, [proposta.addons]);

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
        {/* Basic Plan Information */}
        <div>
          <label className={labelClass}>Plano Base</label>
          <div className="bg-light-secondary dark:bg-[#0F172A]/60 p-4 rounded-lg">
            <p className={valueClass}>{proposta.plano_nome}</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Caixas de Entrada:</span>
                <p className="text-base text-gray-700 dark:text-gray-300">{proposta.caixas_entrada_qtde}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Atendentes:</span>
                <p className="text-base text-gray-700 dark:text-gray-300">{proposta.atendentes_qtde}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Automações:</span>
                <p className="text-base text-gray-700 dark:text-gray-300">{proposta.automacoes_qtde}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {proposta.kanban && (
                <span className="px-2 py-1 text-xs font-medium bg-brand/10 text-brand rounded-full">
                  Kanban
                </span>
              )}
              {proposta.suporte_humano && (
                <span className="px-2 py-1 text-xs font-medium bg-brand/10 text-brand rounded-full">
                  Suporte Humano
                </span>
              )}
              {proposta.whatsapp_oficial && (
                <span className="px-2 py-1 text-xs font-medium bg-brand/10 text-brand rounded-full">
                  WhatsApp Oficial
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Addons Section */}
        {proposta.addons && proposta.addons.length > 0 && (
          <div>
            <label className={labelClass}>Add-ons Selecionados</label>
            <div className="space-y-2">
              {proposta.addons.map((addon, index) => {
                const addonDetails = addonsData[addon.addon_id];
                return (
                  <div 
                    key={index}
                    className="bg-light-secondary dark:bg-[#0F172A]/60 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-brand mr-3" />
                      <div>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                          {addonDetails?.nome || 'Carregando...'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantidade: {addon.qtde}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-brand">
                        {formatCurrency(addonDetails?.valor * addon.qtde || 0)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(addonDetails?.valor || 0)} por unidade
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="mt-6 bg-light-secondary dark:bg-[#0F172A]/60 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-700 dark:text-gray-300">{formatCurrency(proposta.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Add-ons:</span>
              <span className="text-gray-700 dark:text-gray-300">{formatCurrency(proposta.total_addons)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Desconto:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {proposta.desconto}% ({formatCurrency(proposta.cupom_desconto_valor)})
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Total:</span>
              <span className="text-xl font-bold text-brand">{formatCurrency(proposta.total)}</span>
            </div>
          </div>
        </div>

        {/* Copy Link Button */}
        {finish && (
          <div className="flex justify-end pt-6">
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
          </div>
        )}
      </div>
    </div>
  );
}