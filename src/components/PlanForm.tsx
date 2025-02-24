import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import {
  Users,
  Inbox,
  DollarSign,
  Bot,
  HeadphonesIcon,
  Layout,
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
    descricao: initialData?.descricao || '',
    caixas_entrada_add: initialData?.caixas_entrada_add || 0,
    automacoes_add: initialData?.automacoes_add || 0,
    atendentes_add: initialData?.atendentes_add || 0,
    valor: initialData?.valor || 1,
    caixas_entrada: initialData?.caixas_entrada || 1,
    atendentes: initialData?.atendentes || 1,
    automacoes: initialData?.automacoes || 1,
    suporte_humano: initialData?.suporte_humano || false,
    kanban: initialData?.kanban || true,
    whatsapp_oficial: initialData?.whatsapp_oficial || false,
    active: initialData?.active || true,
    user_id: user?.id || ''
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
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('plano')
          .update({
            nome: formData.nome,
            descricao: formData.descricao,
            caixas_entrada: formData.caixas_entrada,
            atendentes: formData.atendentes,
            automacoes: formData.automacoes,
            suporte_humano: formData.suporte_humano ? 1 : 0,
            kanban: formData.kanban,
            whatsapp_oficial: formData.whatsapp_oficial,
            valor: formData.valor,
            caixas_entrada_add: formData.caixas_entrada_add,
            automacoes_add: formData.automacoes_add,
            atendentes_add: formData.atendentes_add,
            active: true
          })
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('plano')
          .insert([{
            nome: formData.nome,
            descricao: formData.descricao,
            valor: formData.valor,
            caixas_entrada_add: formData.caixas_entrada_add,
            automacoes_add: formData.automacoes_add,
            atendentes_add: formData.atendentes_add,
            caixas_entrada: formData.caixas_entrada,
            atendentes: formData.atendentes,
            automacoes: formData.automacoes,
            suporte_humano: formData.suporte_humano ? 1 : 0,
            kanban: formData.kanban,
            whatsapp_oficial: formData.whatsapp_oficial,
            active: true,
            user_id: user?.id
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
      {/* Basic Information */}
      <div className="bg-[#1E293B]/70 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Informações Básicas
        </h3>

        {/* Nome do Plano */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Nome do Plano
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full px-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Valor Base
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">R$</span>
            </div>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="block w-full pl-12 pr-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Resource Limits */}
      <div className="bg-[#1E293B]/70 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Recursos Inclusos</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caixas de Entrada */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Caixas de Entrada
            </label>
            <div className="mt-1 relative">
              <Inbox className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="caixas_entrada"
                value={formData.caixas_entrada}
                onChange={handleInputChange}
                min="1"
                className="block w-full pl-12 pr-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Atendentes */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Atendentes
            </label>
            <div className="mt-1 relative">
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="atendentes"
                value={formData.atendentes}
                onChange={handleInputChange}
                min="1"
                className="block w-full pl-12 pr-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Automações */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Automações
            </label>
            <div className="mt-1 relative">
              <Bot className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="automacoes"
                value={formData.automacoes}
                onChange={handleInputChange}
                min="1"
                className="block w-full pl-12 pr-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resource Pricing */}
      <div className="bg-[#1E293B]/70 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Valor Adicional Por</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caixas de Entrada Adicionais */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Caixa de Entrada
            </label>
            <div className="mt-1 relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="caixas_entrada_add"
                value={formData.caixas_entrada_add}
                onChange={handleInputChange}
                className="block w-full pl-12 pr-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                required
                title="Valor Adicional por Caixa de Entrada"
              />
            </div>
          </div>

          {/* Atendentes Adicionais */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Atendente
            </label>
            <div className="mt-1 relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="atendentes_add"
                value={formData.atendentes_add}
                onChange={handleInputChange}
                className="block w-full pl-12 pr-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                required
                title="Valor Adicional por Atendente"
              />
            </div>
          </div>

          {/* Automações Adicionais */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Automação
            </label>
            <div className="mt-1 relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="automacoes_add"
                value={formData.automacoes_add}
                onChange={handleInputChange}
                className="block w-full pl-12 pr-4 py-3 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                required
                title="Valor Adicional por Automação"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-[#1E293B]/70 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Recursos Adicionais</h3>

        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-4 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl cursor-pointer hover:bg-[#0F172A]/40 transition-colors group">
            <input
              type="checkbox"
              checked={formData.suporte_humano}
              onChange={() => handleToggleChange('suporte_humano')}
              className="h-5 w-5 rounded border-gray-700/50 text-blue-500/80 focus:ring-blue-500/50 focus:ring-offset-0 bg-[#0F172A]/60 transition-colors"
            />
            <div className="flex items-center space-x-3">
              <HeadphonesIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
              <span className="text-gray-300 group-hover:text-gray-200 transition-colors">Suporte Humano</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl cursor-pointer hover:bg-[#0F172A]/40 transition-colors group">
            <input
              disabled={true}
              type="checkbox"
              checked={formData.kanban}
              onChange={() => handleToggleChange('kanban')}
              className="h-5 w-5 rounded border-gray-700/50 text-blue-500/80 focus:ring-blue-500/50 focus:ring-offset-0 bg-[#0F172A]/60 transition-colors"
            />
            <div className="flex items-center space-x-3">
              <Layout className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
              <span className="text-gray-300 group-hover:text-gray-200 transition-colors">Kanban</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 bg-[#0F172A]/60 border border-gray-700/50 rounded-xl cursor-pointer hover:bg-[#0F172A]/40 transition-colors group">
            <input
              type="checkbox"
              checked={formData.whatsapp_oficial}
              onChange={() => handleToggleChange('whatsapp_oficial')}
              className="h-5 w-5 rounded border-gray-700/50 text-blue-500/80 focus:ring-blue-500/50 focus:ring-offset-0 bg-[#0F172A]/60 transition-colors"
            />
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
              <span className="text-gray-300 group-hover:text-gray-200 transition-colors">WhatsApp Oficial</span>
            </div>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-[#0F172A]/60 text-gray-300 rounded-xl hover:bg-[#0F172A]/40 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-xl transition-colors flex items-center"
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