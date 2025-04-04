import React, { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';
import { 
  Mail, 
  User, 
  Phone, 
  Percent, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Loader2,
  Save,
  Building2,
  UserCheck
} from 'lucide-react';
import Cliente from '../../Models/Cliente';

interface CommercialAffiliateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    emp_nome: string;
    emp_email: string;
    emp_fone: number;
    desconto: number;
    comissao: number;
    vencimento: string;
    active: boolean;
  };
}

const cardClass = "bg-[#1E293B] p-6 rounded-xl";
const labelClass = "block text-sm font-medium text-gray-300 mb-2";
const inputClass = "w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg";
const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";
const iconGroupTitleClass = "h-6 w-6 text-brand dark:text-blue-400";
const buttonClass = "px-6 py-2.5 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";

export default function CommercialAffiliateForm({ onSuccess, onCancel, initialData }: CommercialAffiliateFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  console.log('Initial Data:', initialData);

  const generateCouponCode = () => {
    const prefix = 'AFF';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const [formData, setFormData] = useState<Cliente>({
    user_id: user?.id || '',
    perfil_id: 6,
    cupom: generateCouponCode(),
    emp_nome: initialData?.emp_nome ? initialData.emp_nome : '',
    emp_email: initialData?.emp_email ? initialData.emp_email : '',
    emp_fone: initialData?.emp_fone ? formatPhoneNumber(initialData.emp_fone) : '99999999999',
    desconto: initialData?.desconto ?? 5,
    comissao: initialData?.comissao ?? 10,
    vencimento: initialData?.vencimento ? new Date(initialData.vencimento).toISOString().split('T')[0] : '',
    active: initialData?.active ?? true
  });

  function formatPhoneNumber(phone: number): string {
    const phoneStr = phone.toString().padStart(11, '0');
    return phoneStr.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fone = Number(formData.emp_fone.replace(/\D/g, ''));
      if (initialData) {
        const { error: updateError } = await supabase
          .from('cliente')
          .update({
            emp_email: formData.emp_email,
            emp_nome: formData.emp_nome,
            emp_fone: fone,
            desconto: Number(formData.desconto),
            comissao: Number(formData.comissao),
            vencimento: formData.vencimento,
            active: formData.active
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('cliente')
          .insert(formData);

        if (insertError) throw insertError;
      }

      onSuccess();
    } catch (err) {
      console.error('Error managing affiliate:', err);
      setError(`Erro ao ${initialData ? 'atualizar' : 'criar'} afiliado. Por favor, tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 fade-in">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-400/10 p-3 rounded-xl">
            <UserCheck className={iconGroupTitleClass} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Informações do Afiliado
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className={labelClass}>
              Nome
            </label>
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                name="emp_nome"
                value={formData.emp_nome}
                onChange={handleInputChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              Email
            </label>
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                name="emp_email"
                value={formData.emp_email}
                className={inputClass}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className={labelClass}>
              Telefone
            </label>
            <div className="relative">
              <Phone className={iconClass} />
              <input
                type="tel"
                name="emp_fone"
                value={formData.emp_fone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className={labelClass}>
              Data de Vencimento
            </label>
            <div className="relative">
              <Calendar className={iconClass} />
              <input
                type="date"
                name="vencimento"
                value={formData.vencimento}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="mt-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-400/10 p-3 rounded-xl">
            <Building2 className={iconGroupTitleClass} />
          </div>
          <h3 className="text-lg font-medium text-white">
            Configurações de Comissão
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Desconto */}
          <div>
            <label className={labelClass}>
              Percentual de Desconto
            </label>
            <div className="relative">
              <Percent className={iconClass} />
              <input
                type="number"
                name="desconto"
                value={formData.desconto}
                onChange={handleInputChange}
                className={inputClass}
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>
          </div>

          {/* Comissão */}
          <div>
            <label className={labelClass}>
              Taxa de Comissão
            </label>
            <div className="relative">
              <Percent className={iconClass} />
              <input
                type="number"
                name="comissao"
                value={formData.comissao}
                onChange={handleInputChange}
                className={inputClass}
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center text-red-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-[#0F172A] text-gray-300 hover:bg-[#0F172A]/80 transition-colors rounded-lg"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-brand text-white hover:bg-brand/90 transition-colors rounded-lg flex items-center"
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
              {initialData ? 'Atualizar Afiliado' : 'Criar Afiliado'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}