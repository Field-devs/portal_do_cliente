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
  Shield,
  Phone
} from 'lucide-react';
import { set } from 'date-fns';
import { AlertDialog, ErrorDialog } from '../../components/Dialogs/Dialogs';

interface UserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    nome: string;
    email: string;
    empresa?: string;
    fone:string;
    cnpj?: string;
    perfil_id: number;
  };
}

export default function UserForm({ onSuccess, onCancel, initialData }: UserFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileList, setProfileList] = useState<string[] | null>([]);

  // Style constants
  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";
  const buttonClass = "px-4 py-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";

  const [formData, setFormData] = useState({
    firstName: initialData?.nome.split(' ')[0] || '',
    lastName: initialData?.nome.split(' ').slice(1).join(' ') || '',
    email: initialData?.email || '',
    empresa: initialData?.empresa || '',
    fone: initialData?.fone|| '',

    cnpj: initialData?.cnpj || '',
    perfil_id: initialData?.perfil_id || 5,
    password: '',
    confirmPassword: ''
  });


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
    console.log('initialData', initialData?.perfil_id);
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

  const ValidateMail = async () => {
    // Verifica se o usuario existe pelo email
    let { data: userData, error } = await supabase.from("users").select("*").eq("email", formData.email);
    if (error) {
      ErrorDialog("Erro ao verificar usuario: " + error.message);
      return false;
    }
    if (userData?.length > 0) {
      AlertDialog("Usuario já existe, favor utilizar outro email");
      return false;
    }
    return true;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const userData = {
        nome: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        empresa:  `${formData.firstName} ${formData.lastName}`.trim(),
        fone: formData.fone,
        cnpj: null,
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

        let response = await ValidateMail();
        if (!response) return;


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
      <div className={cardClass}>
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
            <label className={labelClass}>
              Nome
            </label>
            <div className="mt-1 relative">
              <User className={iconClass} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className={labelClass}>
              Sobrenome
            </label>
            <div className="mt-1 relative">
              <User className={iconClass} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
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
            <div className="mt-1 relative">
              <Mail className={iconClass} />
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

          {/* Fone */}
          <div>
            <label className={labelClass}>
              Fone
            </label>
            <div className="mt-1 relative">
              <Phone className={iconClass} />
              <input
                type="fone"
                name="fone"
                value={formData.fone}
                onChange={handleInputChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Profile Type */}
          <div>
            <label className={labelClass}>
              Tipo de Perfil
            </label>
            <div className="mt-1 relative">
              <Shield className={iconClass} />
              <select
                name="perfil_id"
                value={formData.perfil_id}
                onChange={handleInputChange}
                className={inputClass}
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



      {/* Password Section (only for new users) */}
      {!initialData && (
        <div className={cardClass}>
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
              <label className={labelClass}>
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className={iconClass} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>
                Confirmar Senha
              </label>
              <div className="mt-1 relative">
                <Lock className={iconClass} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 flex items-center text-red-600 dark:text-red-400 rounded-lg shadow-sm">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`${buttonClass} bg-gray-100 dark:bg-[#0F172A]/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#0F172A]/40`}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`${buttonClass} bg-brand hover:bg-brand/90 text-white`}
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

function ErrodDialog(arg0: string) {
  throw new Error('Function not implemented.');
}
