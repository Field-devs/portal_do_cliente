import React, { useState, useRef } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { 
  Mail, 
  Phone, 
  User, 
  Camera, 
  Loader2,
  ChevronRight,
  Edit2
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.NOME?.split(' ')[0] || '',
    lastName: user?.NOME?.split(' ').slice(1).join(' ') || '',
    email: user?.EMAIL || '',
    phone: user?.TELEFONE || '',
    photo: user?.FOTO_PERFIL || null
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      setFormData(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Handle form submission logic here
      // Update user profile in Supabase
      setIsEditing(false);
    } catch (err) {
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-sm text-brand hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold">
                  {formData.firstName.charAt(0)}
                </div>
              )}
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full hover:bg-brand/90"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-2 py-1 border rounded-md"
                      placeholder="Nome"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-2 py-1 border rounded-md"
                      placeholder="Sobrenome"
                    />
                  </div>
                ) : (
                  `${formData.firstName} ${formData.lastName}`
                )}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-1 border rounded-md"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white">{formData.email}</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefone
              </label>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-1 border rounded-md"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white">
                    {formData.phone || '-'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

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

          {/* Account Settings */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Configurações da Conta
            </h4>
            <div className="space-y-4">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300">Alterar Senha</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300">Notificações</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300">Privacidade</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}