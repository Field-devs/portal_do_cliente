import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';


import {
  Mail,
  Phone,
  User,
  Camera,
  Loader2,
  Edit2,
  AlertCircle,
  CheckCircle,
  X,
  Lock,
  Building2,
  CreditCard
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const DEFAULT_AVATARS = [
  'https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/f0ox8dmw82jbx0s2w686ioyk/blocks/flm69ulnpr4b67h01xj47t14/DALL·E 2025-02-07 11.13.12 - A vibrant nature scene inspired by Brazilian modernism. The landscape features rolling green hills, oversized tropical plants, and a bright blue sky. _resultado.png',
  'https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/vxxbc2o3tnyo8ub0k1muog8b/blocks/flm69ulnpr4b67h01xj47t14/DALL·E 2025-02-07 11.13.39 - A surreal and colorful nature scene inspired by Brazilian modernism. The landscape features rolling hills, lush oversized tropical plants, and a brigh_resultado.png',
  'https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/nc55e09j550mc3fpifs3iiap/blocks/flm69ulnpr4b67h01xj47t14/Gemini_Generated_Image_33q76d33q76d33q7_resultado.png',
  'https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/lfixyv779fwk3y09zpdx096y/blocks/flm69ulnpr4b67h01xj47t14/Gemini_Generated_Image_e9z11me9z11me9z1_resultado.png',
  'https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/iv734529009a3ha4si1pmnqz/blocks/flm69ulnpr4b67h01xj47t14/Gemini_Generated_Image_rmjurvrmjurvrmju_resultado.png'
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(user?.foto_perfil || null);

  const [formData, setFormData] = useState({
    firstName: user?.nome?.split(' ')[0] || '',
    lastName: user?.nome?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.telefone || '',
    cnpj: user?.cnpj || '',
    empresa: user?.empresa || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePhotoSelect = async (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoSelector(false);

    try {
      await updateUser({
        ...user,
        foto_perfil: photoUrl
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Error updating profile photo:', err);
      setError('Erro ao atualizar foto de perfil');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Todos os campos de senha são obrigatórios');
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setError('A nova senha deve ter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais');
      return false;
    }

    return true;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setSuccess(true);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erro ao atualizar senha. Verifique sua senha atual e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log(formData);
    try {
      // Atualizar na Tabela de auth.users
      await updateUser({
        nome: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || null
        //cnpj: formData.cnpj || null,
        //empresa: formData.empresa || null
      });

      // Atualizar em Pessoas
      let PessoaData = {
        nome: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        telefone: formData.phone || null,
        cnpj: formData.cnpj || null,
        empresa: formData.empresa || null
      };
      // Atualiza na base SupaBase
      await supabase.from('pessoas').update(PessoaData).eq('pessoas_id', user?.pessoas_id);

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand focus:border-brand transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const readOnlyClasses = "text-gray-900 dark:text-white py-2";

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-100 rounded-md transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-brand text-white flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-gray-700 shadow-lg">
                  {user?.nome?.charAt(0) || '?'}
                </div>
              )}
              <button
                onClick={() => setShowPhotoSelector(true)}
                className="absolute bottom-0 right-0 bg-brand dark:bg-dark-button-edit text-white p-2 rounded-full hover:bg-brand/90 dark:hover:bg-dark-button-editHover transition-colors shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Photo Selector Modal */}
          {showPhotoSelector && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
                    Escolha uma foto de perfil
                  </h3>
                  <button
                    onClick={() => setShowPhotoSelector(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {DEFAULT_AVATARS.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handlePhotoSelect(avatar)}
                      className={`relative rounded-lg overflow-hidden hover:ring-2 hover:ring-brand dark:hover:ring-dark-button-edit transition-all ${selectedPhoto === avatar ? 'ring-2 ring-brand dark:ring-dark-button-edit' : ''
                        }`}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {selectedPhoto === avatar && (
                        <div className="absolute inset-0 bg-brand/20 dark:bg-dark-button-edit/20 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm flex items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="text-green-600 text-sm flex items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              <CheckCircle className="h-4 w-4 mr-2" />
              {isChangingPassword ? 'Senha atualizada com sucesso!' : 'Perfil atualizado com sucesso!'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Nome</label>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  {isEditing ? (
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Nome"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Sobrenome"
                      />
                    </div>
                  ) : (
                    <span className={readOnlyClasses}>
                      {`${formData.firstName} ${formData.lastName}`}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClasses}>Email</label>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                  ) : (
                    <span className={readOnlyClasses}>{formData.email}</span>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClasses}>Telefone</label>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                  ) : (
                    <span className={readOnlyClasses}>
                      {formData.phone || '-'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClasses}>CNPJ</label>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                  ) : (
                    <span className={readOnlyClasses}>
                      {formData.cnpj || '-'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClasses}>Empresa</label>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                  ) : (
                    <span className={readOnlyClasses}>
                      {formData.empresa || '-'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Password Change Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Alterar Senha
                </h3>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center px-4 py-2 text-sm bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90 rounded-md transition-colors dark:bg-[#FF8C00] dark:text-white dark:hover:bg-[#FF8C00]/80 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className={labelClasses}>Senha Atual</label>
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Nova Senha</label>
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Confirmar Nova Senha</label>
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas e minúsculas, números e caracteres especiais.
                  </p>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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
                          Alterando...
                        </>
                      ) : (
                        'Alterar Senha'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}