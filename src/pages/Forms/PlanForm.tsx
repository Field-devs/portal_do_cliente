import React, { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Bot,
  HeadphonesIcon,
  Layout,
  Phone,
  DollarSign,
  AlertCircle,
  Loader2,
  Save,
  Package,
  FileText
} from 'lucide-react';

interface PlanFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    nome: string;
    descricao: string;
    valor: number;
    caixas_entrada: number;
    atendentes: number;
    automacoes: number;
    suporte_humano: boolean;
    kanban: boolean;
    whatsapp_oficial: boolean;
  };
}

export default function PlanForm({ onSuccess, onCancel, initialData }: PlanFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    descricao: initialData?.descricao || '',
    valor: initialData?.valor || 0,
    caixas_entrada: initialData?.caixas_entrada || 1,
    atendentes: initialData?.atendentes || 1,
    automacoes: initialData?.automacoes || 1,
    suporte_humano: initialData?.suporte_humano || false,
    kanban: initialData?.kanban || true,
    whatsapp_oficial: initialData?.whatsapp_oficial || false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const planData = {
        ...formData,
        user_id: user.id,
        active: true
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('plano')
          .update(planData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('plano')
          .insert([planData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving plan:', error);
      setError('Erro ao salvar plano. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const cardClass = "bg-white dark:bg-[#1E293B]/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg";
  const inputClass = "pl-12 block w-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#0F172A]/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-brand-50 dark:bg-blue-400/10 p-3 rounded-xl">
            <Package className="h-6 w-6 text-brand dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Informações do Plano
          </h3>
        </div>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className={labelClass}>
              Nome do Plano
            </label>
            <div className="mt-1 relative">
              <FileText className={iconClass} />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClass}>
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={3}
              className={`${inputClass} pl-4`}
            />
          </div>

          {/* Valor */}
          <div>
            <label className={labelClass}>
              Valor Base
            </label>
            <div className="mt-1 relative">
              <DollarSign className={iconClass} />
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-brand-50 dark:bg-blue-400/10 p-3 rounded-xl">
            <Package className="h-6 w-6 text-brand dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recursos Inclusos
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caixas de Entrada */}
          <div>
            <label className={labelClass}>
              Caixas de Entrada
            </label>
            <div className="mt-1 relative">
              <Package className={iconClass} />
              <input
                type="number"
                name="caixas_entrada"
                value={formData.caixas_entrada}
                onChange={handleInputChange}
                min="1"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Atendentes */}
          <div>
            <label className={labelClass}>
              Atendentes
            </label>
            <div className="mt-1 relative">
              <Users className={iconClass} />
              <input
                type="number"
                name="atendentes"
                value={formData.atendentes}
                onChange={handleInputChange}
                min="1"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Automações */}
          <div>
            <label className={labelClass}>
              Automações
            </label>
            <div className="mt-1 relative">
              <Bot className={iconClass} />
              <input
                type="number"
                name="automacoes"
                value={formData.automacoes}
                onChange={handleInputChange}
                min="1"
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-brand-50 dark:bg-blue-400/10 p-3 rounded-xl">
            <Package className="h-6 w-6 text-brand dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recursos Adicionais
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-4 bg-white dark:bg-[#0F172A]/60 border border-gray-200 dark:border-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]/40 transition-colors group">
            <input
              type="checkbox"
              checked={formData.suporte_humano}
              onChange={() => handleToggleChange('suporte_humano')}
              className="h-5 w-5 rounded border-gray-200 dark:border-gray-700/50 text-brand focus:ring-brand focus:ring-offset-0 bg-white dark:bg-[#0F172A]/60 transition-colors"
            />
            <div className="flex items-center space-x-3">
              <HeadphonesIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                Suporte Humano
              </span>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 bg-white dark:bg-[#0F172A]/60 border border-gray-200 dark:border-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]/40 transition-colors group">
            <input
              type="checkbox"
              checke d={formData.kanban}
              onChange={() => handleToggleChange('kanban')}
              className="h-5 w-5 rounded border-gray-200 dark:border-gray-700/50 text-brand focus:ring-brand focus:ring-offset-0 bg-white dark:bg-[#0F172A]/60 transition-colors"
            />
            <div className="flex items-center space-x-3">
              <Layout className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                Kanban
              </span>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 bg-white dark:bg-[#0F172A]/60 border border-gray-200 dark:border-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]/40 transition-colors group">
            <input
              type="checkbox"
              checked={formData.whatsapp_oficial}
              onChange={() => handleToggleChange('whatsapp_oficial')}
              className="h-5 w-5 rounded border-gray-200 dark:border-gray-700/50 text-brand focus:ring-brand focus:ring-offset-0 bg-white dark:bg-[#0F172A]/60 transition-colors"
            />
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                WhatsApp Oficial
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 dark:bg-[#0F172A]/60 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-[#0F172A]/40 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-xl transition-colors flex items-center"
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
              {initialData ? 'Atualizar Plano' : 'Criar Plano'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}