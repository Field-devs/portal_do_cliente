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
  UserCheck,
  MonitorX
} from 'lucide-react';
import Cliente from '../../Models/Cliente';

interface AVAFormProps {
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

const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
const inputClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
const iconGroupClass = "flex items-center space-x-3 mb-6";
const iconGroupTitleClass = "h-6 w-6 text-brand dark:text-blue-400";
const iconInputClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

export default function AVAForm({ onSuccess, onCancel, initialData }: AVAFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Cliente>({
    tipo: 'AVA',
    user_id: user?.id || '',
    email: initialData?.email || 'jose@gmail.com ',
    nome: initialData?.nome || 'JOSE DA SILVA2',
    fone: initialData?.fone ? formatPhoneNumber(initialData.fone) : '99999999999',
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
      const fone = Number(formData.fone.replace(/\D/g, ''));
      if (initialData) {
        const { error: updateError } = await supabase
          .from('cliente')
          .update({
            email: formData.email,
            nome: formData.nome,
            fone: fone,
            desconto: Number(formData.desconto),
            comissao: Number(formData.comissao),
            vencimento: formData.vencimento,
            active: formData.active
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {

        const couponCode = generateCouponCode();

        const { error: insertError } = await supabase
          .from('cliente')
          .insert([{
            tipo: 'AVA',
            nome: formData.nome,
            fone: fone,
            email: formData.email,
            endereco: formData.endereco,
            cnpj: formData.cnpj,
            desconto: formData.desconto,
            comissao: formData.comissao,
            // vencimento: formData.vencimento,
            cupom: couponCode,
            user_id: user?.id,
            active: formData.active
          }]);

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

  const generateCouponCode = () => {
    const prefix = 'AFF';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informacoes Basicas */}
        <div className={cardClass}>
          <div className={iconGroupClass}>
            <div className="bg-blue-400/10 p-3 rounded-xl">
              <UserCheck className={iconGroupTitleClass} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Informações do Cliente
            </h3>
          </div>

          <div className="grid grid-cols-12 md:grid-cols-12 gap-6">
            {/* CNPJ */}
            <div className='col-span-5 md:col-span-5'>
              <label className="block text-sm font-medium text-gray-300">
                CNPJ
              </label>
              <div className="mt-1 relative">
                <MonitorX className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Nome */}
            <div className='col-span-7 md:col-span-7'>
              <label className="block text-sm font-medium text-gray-300">
                Nome
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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

            {/* Fone */}
            <div className='col-span-6 md:col-span-6'>
              <label className="block text-sm font-medium text-gray-300">
                Fone
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="telefone"
                  value={formData.fone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className='col-span-6 md:col-span-6'>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Endereco */}
            <div className='col-span-12 md:col-span-12'>
              <label className="block text-sm font-medium text-gray-300">
                Endereço
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 flex items-center text-red-600 dark:text-red-400 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-light-secondary dark:bg-[#0F172A]/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#0F172A]/40 transition-colors rounded-lg"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary flex items-center rounded-lg"
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
                {initialData ? 'Confirmar' : 'Confirmar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}