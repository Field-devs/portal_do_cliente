import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { 
  Mail, 
  User, 
  Phone, 
  Percent, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

interface CommercialAffiliateFormProps {
  initialData?: {
    cliente_afiliado_id: string;
    nome: string;
    email: string;
    telefone: number;
    desconto: number;
    comissao: number;
    vencimento: string;
    status: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CommercialAffiliateForm({ initialData, onSuccess, onCancel }: CommercialAffiliateFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    nome: initialData?.nome || '',
    telefone: initialData?.telefone ? formatPhoneNumber(initialData.telefone) : '',
    desconto: initialData?.desconto.toString() || '',
    comissao: initialData?.comissao.toString() || '',
    vencimento: initialData?.vencimento ? new Date(initialData.vencimento).toISOString().split('T')[0] : '',
    status: initialData?.status ?? true
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function formatPhoneNumber(phone: number): string {
    const phoneStr = phone.toString().padStart(11, '0');
    return phoneStr.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    // Name validation
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }

    // Phone validation
    const phoneDigits = formData.telefone.replace(/\D/g, '');
    if (!formData.telefone) {
      errors.telefone = 'Telefone é obrigatório';
    } else if (phoneDigits.length !== 11) {
      errors.telefone = 'Telefone deve ter 11 dígitos';
    }

    // Discount validation
    const discount = Number(formData.desconto);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      errors.desconto = 'Desconto deve ser entre 0 e 100%';
    }

    // Commission validation
    const commission = Number(formData.comissao);
    if (isNaN(commission) || commission < 0 || commission > 100) {
      errors.comissao = 'Comissão deve ser entre 0 e 100%';
    }

    // Date validation
    if (!formData.vencimento) {
      errors.vencimento = 'Data de vencimento é obrigatória';
    } else {
      const expirationDate = new Date(formData.vencimento);
      const today = new Date();
      if (expirationDate <= today) {
        errors.vencimento = 'Data de vencimento deve ser futura';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateCouponCode = () => {
    const prefix = 'AFF';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Apply masks
    if (name === 'telefone') {
      // Remove tudo que não é número
      const numbersOnly = value.replace(/\D/g, '');
      
      // Limita a 11 dígitos
      const truncated = numbersOnly.slice(0, 11);
      
      // Aplica a máscara (XX) XXXXX-XXXX
      formattedValue = truncated
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.pessoas_id) return;

    setLoading(true);
    setError(null);

    try {
      const phoneNumber = Number(formData.telefone.replace(/\D/g, ''));
      
      if (initialData) {
        // Update existing affiliate
        const { error: updateError } = await supabase
          .from('cliente_afiliado')
          .update({
            email: formData.email,
            nome: formData.nome,
            telefone: phoneNumber,
            desconto: Number(formData.desconto),
            comissao: Number(formData.comissao),
            vencimento: formData.vencimento,
            status: formData.status
          })
          .eq('cliente_afiliado_id', initialData.cliente_afiliado_id);

        if (updateError) throw updateError;
      } else {
        // Create new affiliate
        const couponCode = generateCouponCode();
        
        const { error: insertError } = await supabase
          .from('cliente_afiliado')
          .insert([{
            email: formData.email,
            nome: formData.nome,
            telefone: phoneNumber,
            desconto: Number(formData.desconto),
            comissao: Number(formData.comissao),
            vencimento: formData.vencimento,
            codigo_cupom: couponCode,
            pessoas_user_id: user.pessoas_id,
            status: formData.status
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Editar Afiliado' : 'Novo Afiliado Comercial'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome Completo
            </label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            {formErrors.nome && (
              <p className="mt-1 text-sm text-red-600">{formErrors.nome}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            {formErrors.telefone && (
              <p className="mt-1 text-sm text-red-600">{formErrors.telefone}</p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Digite apenas números (DDD + número)
            </p>
          </div>

          {/* Desconto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Percentual de Desconto
            </label>
            <div className="mt-1 relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="desconto"
                value={formData.desconto}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            {formErrors.desconto && (
              <p className="mt-1 text-sm text-red-600">{formErrors.desconto}</p>
            )}
          </div>

          {/* Comissão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Taxa de Comissão
            </label>
            <div className="mt-1 relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="comissao"
                value={formData.comissao}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            {formErrors.comissao && (
              <p className="mt-1 text-sm text-red-600">{formErrors.comissao}</p>
            )}
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Vencimento
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="vencimento"
                value={formData.vencimento}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            {formErrors.vencimento && (
              <p className="mt-1 text-sm text-red-600">{formErrors.vencimento}</p>
            )}
          </div>

          {/* Add Status Toggle for Edit Mode */}
          {initialData && (
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.status ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.status ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formData.status ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          )}

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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {initialData ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                initialData ? 'Salvar Alterações' : 'Criar Afiliado'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}