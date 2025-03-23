import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileText,
  Loader2, 
  DollarSign,
  Package,
  Save,
  AlertCircle
} from 'lucide-react';

import { useTheme } from '../../../../components/ThemeProvider';
import { AskDialog } from '../../../../components/Dialogs/Dialogs';
import CircularWait from '../../../../components/CircularWait';
import { Proposta } from '../../../../Models/Propostas';
import ProposalFormConfirmClient from './Proposal.Form.Confirm.Client';

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
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
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
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      setShowErrors(true);
      setTimeout(() => {
        setShowErrors(false);
      }, 5000); // Hide after 5 seconds
      return;
    }

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

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    // Validate Company Data
    if (!proposta.emp_cnpj) errors.push("CNPJ da empresa é obrigatório");
    if (!proposta.emp_nome) errors.push("Nome da empresa é obrigatório");
    if (!proposta.emp_email) errors.push("Email da empresa é obrigatório");
    if (!proposta.emp_fone) errors.push("Telefone da empresa é obrigatório");
    if (!proposta.emp_cep) errors.push("CEP da empresa é obrigatório");
    if (!proposta.emp_logradouro) errors.push("Logradouro da empresa é obrigatório");
    if (!proposta.emp_bairro) errors.push("Bairro da empresa é obrigatório");
    if (!proposta.emp_cidade) errors.push("Cidade da empresa é obrigatório");
    if (!proposta.emp_uf) errors.push("UF da empresa é obrigatório");

    // Validate Responsible Person Data
    if (!proposta.resp_cpf) errors.push("CPF do responsável é obrigatório");
    if (!proposta.resp_nome) errors.push("Nome do responsável é obrigatório");
    if (!proposta.resp_email) errors.push("Email do responsável é obrigatório");
    if (!proposta.resp_fone) errors.push("Telefone do responsável é obrigatório");

    // Validate Financial Responsible Data
    if (!proposta.fin_cpf) errors.push("CPF do responsável financeiro é obrigatório");
    if (!proposta.fin_nome) errors.push("Nome do responsável financeiro é obrigatório");
    if (!proposta.fin_email) errors.push("Email do responsável financeiro é obrigatório");
    if (!proposta.fin_fone) errors.push("Telefone do responsável financeiro é obrigatório");

    return errors;
  };

  return (
    loading ? <CircularWait messagefull="Confirmando a Proposta..." small={false} /> :
    finish ? <RegistrationSuccess /> :
    notFound ? <ProposalFinishError /> :
      <div className="flex justify-center items-center mt-20">
        {formErrors.length > 0 && showErrors && (
          <div className="fixed top-4 right-4 z-50 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg shadow-lg p-4 max-w-md">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-red-800 dark:text-red-200 font-medium">
                Por favor, preencha todos os campos obrigatórios
              </h3>
            </div>
            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-1">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl" >
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-12">
            <img 
              src={logoUrl}
              alt="Logo" 
              className="w-48 h-48 mb-6"
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


          {/* Resumo da Proposta */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Plano Selecionado
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Nome do Plano:</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{proposta.plano_nome}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Caixas de Entrada:</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{proposta.caixas_entrada_qtde}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Atendentes:</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{proposta.atendentes_qtde}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Automações:</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{proposta.automacoes_qtde}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Valores
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal:</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposta.subtotal)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Add-ons:</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposta.total_addons)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Desconto:</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {proposta.desconto}%
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total:</span>
                    <p className="text-2xl font-bold text-brand dark:text-brand-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposta.total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Package className="h-5 w-5" />
                <span>Recursos Inclusos:</span>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {proposta.kanban && (
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 bg-brand rounded-full"></span>
                    <span>Kanban</span>
                  </div>
                )}
                {proposta.suporte_humano && (
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 bg-brand rounded-full"></span>
                    <span>Suporte Humano</span>
                  </div>
                )}
                {proposta.whatsapp_oficial && (
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 bg-brand rounded-full"></span>
                    <span>WhatsApp Oficial</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
          {/* Formulariode de sequencias */}
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