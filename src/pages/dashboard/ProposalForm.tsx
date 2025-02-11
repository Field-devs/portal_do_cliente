import React, { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { X, AlertCircle, Loader2, Check, Building2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

type ClientType = 'cf' | 'ava';

const clientTypes = [
  { id: 'cf', label: 'Cliente Final', Icon: Users },
  { id: 'ava', label: 'AVA', Icon: Building2 }
] as const;

export default function ProposalForm({ onSuccess, onCancel, plans, addons }: ProposalFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [clientType, setClientType] = useState<ClientType>('cf');

  const [formData, setFormData] = useState({
    nome_empresa: '',
    cnpj: '',
    responsavel: '',
    cpf: '',
    telefone: '',
    email_empresa: '',
    email_empresarial: '',
    wallet_id: '',
    plano_id: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Apply masks for specific fields
    let maskedValue = value;
    
    if (name === 'cnpj') {
      maskedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 18);
    } else if (name === 'cpf') {
      maskedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
    } else if (name === 'telefone') {
      maskedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const calculateTotal = () => {
    const selectedPlan = plans.find(p => p.id === formData.plano_id);
    if (!selectedPlan) return 0;

    const addonsTotal = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.valor || 0);
    }, 0);

    return selectedPlan.valor + addonsTotal;
  };

  const validateStep1 = () => {
    if (!clientType) {
      setError('Selecione o tipo de cliente');
      return false;
    }

    if (!formData.nome_empresa || !formData.cnpj || !formData.responsavel || 
        !formData.cpf || !formData.telefone || !formData.email_empresa || 
        !formData.email_empresarial || !formData.wallet_id) {
      setError('Todos os campos são obrigatórios');
      return false;
    }

    // Validate CNPJ format
    if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      setError('CNPJ inválido');
      return false;
    }

    // Validate CPF format
    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF inválido');
      return false;
    }

    // Validate phone format
    if (formData.telefone.replace(/\D/g, '').length < 10) {
      setError('Telefone inválido');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email_empresa) || !emailRegex.test(formData.email_empresarial)) {
      setError('Email inválido');
      return false;
    }

    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.plano_id) {
      setError('Selecione um plano');
      return false;
    }

    setError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    setError(null);

    try {
      const total = calculateTotal();

      const { error } = await supabase
        .from('proposta_outr')
        .insert([{
          ...formData,
          cliente_id: user?.id,
          valor: total,
          status: 'pending',
          tipo_cliente: clientType
        }]);

      if (error) throw error;

      onSuccess();
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError('Erro ao criar proposta. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de Cliente
        </label>
        <div className="grid grid-cols-2 gap-4">
          {clientTypes.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setClientType(id as ClientType)}
              className={`flex items-center justify-center p-4 border rounded-lg ${
                clientType === id
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Nome da Empresa', name: 'nome_empresa', type: 'text' },
          { label: 'CNPJ', name: 'cnpj', type: 'text', placeholder: '00.000.000/0000-00' },
          { label: 'Nome do Responsável', name: 'responsavel', type: 'text' },
          { label: 'CPF do Responsável', name: 'cpf', type: 'text', placeholder: '000.000.000-00' },
          { label: 'Telefone', name: 'telefone', type: 'text', placeholder: '(00) 00000-0000' },
          { label: 'Email da Empresa', name: 'email_empresa', type: 'email' },
          { label: 'Email Empresarial', name: 'email_empresarial', type: 'email' },
          { label: 'Wallet ID', name: 'wallet_id', type: 'text' }
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90"
        >
          Próximo
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Plano</h3>
        <div className="grid grid-cols-1 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                formData.plano_id === plan.id
                  ? 'border-brand bg-brand/5'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <input
                type="radio"
                id={`plan-${plan.id}`}
                name="plano_id"
                value={plan.id}
                checked={formData.plano_id === plan.id}
                onChange={handleInputChange}
                className="sr-only"
              />
              <label htmlFor={`plan-${plan.id}`} className="flex-1 cursor-pointer">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {plan.nome}
                </h3>
                {plan.descricao && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {plan.descricao}
                  </p>
                )}
                <div className="mt-2 space-y-1">
                  {[
                    `${plan.caixas_entrada} Caixa(s) de Entrada`,
                    `${plan.atendentes} Atendentes`,
                    `${plan.automacoes} Automações`,
                    plan.kanban && 'Kanban Incluído',
                    plan.whatsapp_oficial && 'WhatsApp Oficial Incluído'
                  ]
                    .filter(Boolean)
                    .map((feature, index) => (
                      <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {feature}
                      </p>
                    ))}
                </div>
                <p className="mt-2 text-lg font-medium text-brand">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(plan.valor)}
                  <span className="text-sm text-gray-500">/mês</span>
                </p>
              </label>
              {formData.plano_id === plan.id && (
                <Check className="h-5 w-5 text-brand" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add-ons</h3>
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
                id={`addon-${addon.id}`}
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
              <label htmlFor={`addon-${addon.id}`} className="flex-1 cursor-pointer">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {addon.nome}
                </h3>
                {addon.descricao && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {addon.descricao}
                  </p>
                )}
                <p className="mt-2 text-brand font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(addon.valor)}
                  <span className="text-sm text-gray-500">/mês</span>
                </p>
              </label>
              {selectedAddons.includes(addon.id) && (
                <Check className="h-5 w-5 text-brand" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">Valor Total:</p>
          <p className="text-2xl font-bold text-brand">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(calculateTotal())}
            <span className="text-sm text-gray-500">/mês</span>
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 flex items-center"
          disabled={loading}
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
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nova Proposta - {currentStep === 1 ? 'Dados Cadastrais' : 'Plano e Add-ons'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm flex items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </form>
      </div>
    </div>
  );
}