import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

interface FormDataRegister {
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'super_admin' | 'admin';
  password: string;
  perfil_id: number;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  accountType?: string;
  password?: string;
}

export default function UserRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataRegister>({
    firstName: '',
    lastName: '',
    email: '',
    accountType: 'admin',
    password: '',
    perfil_id: 1,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form data whenever it changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
      isValid = false;
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'Nome deve ter no máximo 50 caracteres';
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
      isValid = false;
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Sobrenome deve ter no máximo 50 caracteres';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }

    // Account Type validation
    if (!formData.accountType) {
      newErrors.accountType = 'Tipo de conta é obrigatório';
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais';
      isValid = false;
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Verifyy if user already exists in auth
      const { data, error } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', formData.email)
      .single();
      if (error) {
        console.error("Usuário já existe", error);
        throw error;
      }
      

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        }
      });

      // if (authError) throw authError;

      if (authData.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            //user_id: authData.user.id,
            user_id: '9dcba8d4-4f0c-4e40-9527-6a3fd5c1ea3f',
            email: formData.email,
            nome: `${formData.firstName} ${formData.lastName}`,
            perfil_id: formData.
            active: true
          }]);

        if (profileError) throw profileError;

        setSuccess(true);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Erro ao criar usuário. Por favor, tente novamente.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Voltar para a página anterior"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </button>

        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Cadastro de Usuário
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Usuário cadastrado com sucesso!
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Redirecionando...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome
                </label>
                <div className="mt-1 relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    maxLength={50}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm ${errors.firstName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    aria-invalid={errors.firstName ? 'true' : 'false'}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                  {errors.firstName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600" id="firstName-error">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sobrenome
                </label>
                <div className="mt-1 relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    maxLength={50}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm ${errors.lastName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    aria-invalid={errors.lastName ? 'true' : 'false'}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                  {errors.lastName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600" id="lastName-error">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm ${errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Conta
                </label>
                <div className="mt-1">
                  <select
                    id="accountType"
                    name="accountType"
                    required
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm ${errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {errors.password}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  A senha deve conter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}