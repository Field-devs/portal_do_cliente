import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { 
  X, 
  AlertCircle, 
  Loader2, 
  Check, 
  Building2, 
  Users,
  Plus,
  Minus,
  Calculator,
  Box
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProposalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  plans: Array<{
    id: string;
    nome: string;
    descricao?: string;
    valor: number;
    caixas_entrada: number;
    automacoes: number;
    atendentes: number;
    kanban: boolean;
    whatsapp_oficial: boolean;
  }>;
  addons: Array<{
    id: string;
    nome: string;
    descricao?: string;
    valor: number;
  }>;
}

interface SelectedAddon {
  id: string;
  quantity: number;
}

const inputClasses = `pl-10 block w-full rounded-md shadow-sm focus:ring-brand focus:border-brand 
  border-gray-300 dark:border-gray-600 
  bg-white dark:bg-gray-700 
  text-gray-900 dark:text-gray-100 
  placeholder-gray-400 dark:placeholder-gray-500`;

export default function ProposalForm({ onSuccess, onCancel, plans, addons }: ProposalFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);

  const [formData, setFormData] = useState({
    nome_empresa: '',
    cnpj: '',
    responsavel: '',
    cpf: '',
    telefone: '',
    email_empresa: '',
    email_empresarial: '',
    wallet_id: '',
    plano_outr_id: ''
  });

  const calculateTotal = () => {
    let total = 0;
    
    // Add plan value
    const selectedPlanData = plans.find(p => p.id === formData.plano_outr_id);
    if (selectedPlanData) {
      total += selectedPlanData.valor;
    }
    
    // Add addons value
    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        total += addon.valor;
      }
    });
    
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plano_outr_id) {
      setError('Por favor, selecione um plano');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: proposalError } = await supabase
        .from('proposta_outr')
        .insert([{
          cliente_final_cliente_final_id: user?.pessoas_id,
          ava_ava_id: user?.pessoas_id,
          plano_outr_id: formData.plano_outr_id,
          valor: calculateTotal(),
          status: 'pending',
          ...formData
        }]);

      if (proposalError) throw proposalError;
      onSuccess();
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError('Erro ao criar proposta. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nova Proposta
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Box className="h-5 w-5 mr-2" />
              Selecione o Plano
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                    formData.plano_outr_id === plan.id
                      ? 'border-brand bg-brand/5'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, plano_outr_id: plan.id }))}
                >
                  <input
                    type="radio"
                    name="plano_outr_id"
                    value={plan.id}
                    checked={formData.plano_outr_id === plan.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, plano_outr_id: e.target.value }))}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {plan.nome}
                    </h3>
                    {plan.descricao && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {plan.descricao}
                      </p>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        • {plan.caixas_entrada} Caixa(s) de Entrada
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        • {plan.atendentes} Atendentes
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        • {plan.automacoes} Automações
                      </p>
                      {plan.kanban && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          • Kanban Incluído
                        </p>
                      )}
                      {plan.whatsapp_oficial && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          • WhatsApp Oficial Incluído
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-lg font-medium text-brand">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(plan.valor)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add-ons Opcionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                    selectedAddons.includes(addon.id)
                      ? 'border-brand bg-brand/5'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAddons(prev => [...prev, addon.id]);
                      } else {
                        setSelectedAddons(prev => prev.filter(id => id !== addon.id));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {addon.nome}
                    </h3>
                    {addon.descricao && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {addon.descricao}
                      </p>
                    )}
                    <p className="mt-2 text-lg font-medium text-brand">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(addon.valor)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">Valor Total:</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(calculateTotal())}
                <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 flex items-center"
              //disabled={loading || !formData.plano_outr_id}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Proposta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}