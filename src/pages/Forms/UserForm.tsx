import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';
import {
  AlertCircle,
  Loader2,
  Save,
  Mail,
  User,
  Lock,
  Building2,
  CreditCard,
  Shield
} from 'lucide-react';
import { set } from 'date-fns';

interface UserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    nome: string;
    email: string;
    empresa?: string;
    cnpj?: string;
    perfil_id: number;
  };
}

export default function UserForm({ onSuccess, onCancel, initialData }: UserFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileList, setProfileList] = useState<string[] | null>([]);

  const [formData, setFormData] = useState({
    firstName: initialData?.nome.split(' ')[0] || '',
    lastName: initialData?.nome.split(' ').slice(1).join(' ') || '',
    email: initialData?.email || '',
    empresa: initialData?.empresa || '',
    cnpj: initialData?.cnpj || '',
    perfil_id: initialData?.perfil_id || 5,
    password: '',
    confirmPassword: ''
  });

  const cardClass = "bg-white dark:bg-[#1E293B]/70 backdrop-blur-sm p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg";
  const inputClass = "mt-1 block w-full border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#0F172A]/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('perfil').select('*');
      if (error) {
        console.error('Error fetching profiles:', error);
        setProfileList(null);
      } else {
        setProfileList(data);
      }
    };
    fetchProfiles();
  }, []);

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Nome completo é obrigatório');
      return false;
    }

    if (!formData.email) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    if (!initialData) {
      if (!formData.password) {
        setError('Senha é obrigatória');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return false;
      }

      // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      // if (!passwordRegex.test(formData.password)) {
      //   setError('A senha deve ter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais');
      //   return false;
      // }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const userData = {
        nome: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        empresa: formData.empresa || null,
        cnpj: formData.cnpj || null,
        perfil_id: formData.perfil_id,
        active: true
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('users')
          .update(userData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create auth user first
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: userError } = await supabase
            .from('users')
            .insert([{
              ...userData,
              user_id: authData.user.id
            }]);

          if (userError) throw userError;
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Erro ao salvar usuário. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-gray-200 dark:border-gray-700/50 rounded-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-400/10 p-3 rounded-lg">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Informações Básicas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nome
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Sobrenome
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
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
                className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          {/* Profile Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Tipo de Perfil
            </label>
            <div className="mt-1 relative">
              <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="perfil_id"
                value={formData.perfil_id}
                onChange={handleInputChange}
                className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                required
              >
                {profileList && profileList.map(profile => (
                  <option key={profile.id} value={profile.nome}>
                    {profile.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-gray-200 dark:border-gray-700/50 rounded-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-400/10 p-3 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Informações da Empresa
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nome da Empresa
            </label>
            <div className="mt-1 relative">
              <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* CNPJ */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              CNPJ
            </label>
            <div className="mt-1 relative">
              <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Section (only for new users) */}
      {!initialData && (
        <div className="bg-white dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-gray-200 dark:border-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-400/10 p-3 rounded-lg">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Senha
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Confirmar Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
          className="px-4 py-2 bg-gray-100 dark:bg-[#0F172A]/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#0F172A]/40 transition-colors rounded-lg"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand hover:bg-brand/90 text-white transition-colors flex items-center rounded-lg"
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
              {initialData ? 'Atualizar Usuário' : 'Criar Usuário'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}