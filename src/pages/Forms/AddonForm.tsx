import React, { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';
import { AlertCircle, Loader2, Save, DollarSign, Package, FileText } from 'lucide-react';

interface AddonFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    nome: string;
    valor: number;
    qtd: number;
    active: boolean;
    dt_add: string;
  };
}

export default function AddonForm({ onSuccess, onCancel, initialData }: AddonFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    descricao: initialData?.nome || '',
    valor: initialData?.valor || 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome do add-on é obrigatório');
      return false;
    }

    if (formData.valor <= 0) {
      setError('Valor deve ser maior que zero');
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
      const addonData = {
        nome: formData.nome,
        descricao: formData.descricao,
        valor: formData.valor,
        user_id: user.id,
        active: true,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('plano_addon')
          .update(addonData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('plano_addon')
          .insert([addonData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving addon:', error);
      setError('Erro ao salvar add-on. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-[#1E293B]/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-400/10 p-3 rounded-xl">
            <Package className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Informações do Add-on
          </h3>
        </div>

        {/* Nome do Add-on */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Nome do Add-on
          </label>
          <div className="mt-1 relative">
            <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="pl-12 block w-full rounded-xl border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-xl border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors resize-none px-4 py-2"
          />
        </div>

        {/* Valor */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300">
            Valor
          </label>
          <div className="mt-1 relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="pl-12 block w-full rounded-xl border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-400">Valor por unidade</p>
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
          onClick={handleSubmit}
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
              {initialData ? 'Atualizar Add-on' : 'Criar Add-on'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}