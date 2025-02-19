import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import {
  Users,
  Inbox,
  Bot,
  HeadphonesIcon,
  Layout,
  MessageSquare,
  AlertCircle,
  Loader2,
  Save,
  Phone
} from 'lucide-react';
import Plan from '../Models/Plan';

interface PlanFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Plan;
}

export default function PlanForm({ onSuccess, onCancel, initialData }: PlanFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    descricao: '',
    valor: initialData?.valor || 1,
    caixas_entrada: initialData?.caixas_entrada || 1,
    atendentes: initialData?.atendentes || 1,
    automacoes: initialData?.automacoes || 1,
    suporte_humano: initialData?.suporte_humano || false,
    kanban: initialData?.kanban || false,
    whatsapp_oficial: initialData?.whatsapp_oficial || false,
    active: initialData?.active || true
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

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome do plano é obrigatório');
      return false;
    }

    if (formData.valor <= 0) {
      setError('Valor deve ser maior que zero');
      return false;
    }

    if (formData.caixas_entrada < 1) {
      setError('Número de caixas de entrada deve ser pelo menos 1');
      return false;
    }

    if (formData.atendentes < 1) {
      setError('Número de atendentes deve ser pelo menos 1');
      return false;
    }

    if (formData.automacoes < 1) {
      setError('Número de automações deve ser pelo menos 1');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    console.log(user);
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      if (initialData?.id) {
        // Update existing plan
        const { error } = await supabase
          .from('plano')
          .update({
            nome: formData.nome,
            descricao: formData.descricao,
            valor: formData.valor,
            caixas_entrada: formData.caixas_entrada,
            atendentes: formData.atendentes,
            automacoes: formData.automacoes,
            suporte_humano: formData.suporte_humano ? 1 : 0,
            kanban: formData.kanban,
            whatsapp_oficial: formData.whatsapp_oficial,
            active: true
          })
          .eq('id', initialData.id);

        if (error) throw error;
      }
      else {

        // Create new plan
        const { error } = await supabase
          .from('plano')
          .insert([{
            nome: formData.nome,
            descricao: formData.descricao,
            valor: formData.valor,
            caixas_entrada: formData.caixas_entrada,
            atendentes: formData.atendentes,
            automacoes: formData.automacoes,
            suporte_humano: formData.suporte_humano ? 1 : 0,
            kanban: formData.kanban,
            whatsapp_oficial: formData.whatsapp_oficial,
            active: true
          }]);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Nome do Plano */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome do Plano
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Valor
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Valor por unidade</p>
        </div>
      </div>

      {/* Resource Limits */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recursos</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Caixas de Entrada
            </label>
            <div className="mt-1 relative">
              <Inbox className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="caixas_entrada"
                value={formData.caixas_entrada}
                onChange={handleInputChange}
                min="1"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Atendentes
            </label>
            <div className="mt-1 relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="atendentes"
                value={formData.atendentes}
                onChange={handleInputChange}
                min="1"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Automações
            </label>
            <div className="mt-1 relative">
              <Bot className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="automacoes"
                value={formData.automacoes}
                onChange={handleInputChange}
                min="1"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recursos Adicionais</h3>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.suporte_humano}
              onChange={() => handleToggleChange('suporte_humano')}
              className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
            />
            <div className="flex items-center space-x-2">
              <HeadphonesIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Suporte Humano</span>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.kanban}
              onChange={() => handleToggleChange('kanban')}
              className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
            />
            <div className="flex items-center space-x-2">
              <Layout className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Kanban</span>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.whatsapp_oficial}
              onChange={() => handleToggleChange('whatsapp_oficial')}
              className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
            />
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">WhatsApp Oficial</span>
            </div>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm flex items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {/* Action Buttons */}
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
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Atualizar Plano' : 'Criar Plano'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}