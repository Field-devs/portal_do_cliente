import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '../../components/Interfaces/Uses';
import { useAuth } from '../../components/AuthProvider';

import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Shield,
  Mail,
  Phone,
  Building2,
  Lock,
  User as UserIcon
} from 'lucide-react';

const inputClasses = `pl-10 block w-full rounded-md shadow-sm focus:ring-brand focus:border-brand 
  border-gray-300 dark:border-gray-600 
  bg-white dark:bg-gray-700 
  text-gray-900 dark:text-gray-100 
  placeholder-gray-400 dark:placeholder-gray-500`;

const selectClasses = `pl-10 block w-full rounded-md shadow-sm focus:ring-brand focus:border-brand 
  border-gray-300 dark:border-gray-600 
  bg-white dark:bg-gray-700 
  text-gray-900 dark:text-gray-100`;



export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    nome: 'NEY DIXON',
    email: 'admin1@gmail.com',
    fone: '99982342254',
    cnpj: '12344444478598',
    empresa: 'IMPERSOFT',
    perfil_id: 1,
    perfil_nome: '',
    senha: '102030',
    confirmarSenha: '102030',
    user_id: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('v_users')
        .select('*')
        .order('dt_add', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('users')
          .update({
            nome: formData.nome,
            email: formData.email,
            fone: formData.fone,
            cnpj: formData.cnpj,
            empresa: formData.empresa,
          })
          .eq('id', editingUser.id);
        if (error) throw error;

        setUsers(prev =>
          prev.map(user =>
            user.id === editingUser.id
              ? {
                ...user,
                nome: formData.nome,
                email: formData.email,
                telefone: formData.fone,
                cnpj: formData.cnpj,
                empresa: formData.empresa,
                perfil_id: formData.perfil_id,
                perfil_nome: formData.perfil_nome
              }
              : user
          )
        );
      } else {
        // Verifyy if user already exists in auth
        // const { authData, authError } = await supabase.rpc('fn_user_exists', {
        //   p_mail: formData.email
        // });

        // if (authError?.code?.includes("invalid_credentials"))
        // {
        //   alert("Usuário existente");
        //   return;
        // }


        //Create auth user first
        // const { data: authData, error: authError } = await supabase.auth.signUp({
        //   email: formData.email,
        //   password: formData.senha,
        //   options: {
        //     data: {
        //       full_name: formData.nome
        //     }
        //   }
        // });

        // if (authError) throw authError;

        //if (authData.user) {
          // Create user profile
          console.log(user?.id);
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              email: formData.email,
              user_id: '9dcba8d4-4f0c-4e40-9527-6a3fd5c1ea3f', // Pega o Id do usuario e associa ao user_id
              nome: formData.nome,
              fone: formData.fone,
              cnpj: formData.cnpj,
              empresa: formData.empresa,
              perfil_id: formData.perfil_id,
              user_ref_id: user?.id,  
              active: true
            }]);

          if (insertError) {
            throw insertError;
          }
        //}
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error managing user:', error);
      alert('Erro ao gerenciar usuário. Por favor, tente novamente.');
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ status: false })
        .eq('pessoas_id', selectedUserId);

      if (error) throw error;

      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUserId
            ? { ...user, active: false }
            : user
        )
      );
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      fone: '',
      cnpj: '',
      empresa: '',
      perfil_id: 5,
      perfil_nome: '',
      senha: '',
      confirmarSenha: '',
      user_id: ''
    });
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cnpj?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.perfil_id === roleFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.status) ||
      (statusFilter === 'inactive' && !user.status);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestão de Contas</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Conta
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className={selectClasses}
              >
                <option value="all">Todos os Perfis</option>
                <option value="1">Super Admin</option>
                <option value="2">Admin</option>
                <option value="3">AVA Admin</option>
                <option value="4">AVA</option>
                <option value="5">Cliente</option>
                <option value="6">Afiliado</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className={selectClasses}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.nome}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {user.perfil_nome}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.empresa || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                      {user.f_status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.dt_add).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setFormData({
                            nome: user.nome,
                            email: user.email,
                            fone: user.fone || '',
                            cnpj: user.cnpj || '',
                            empresa: user.empresa || '',
                            perfil_id: user.perfil_id,
                            perfil_nome: user.perfil_nome || '',
                            user_id: user.id,
                            senha: '',
                            confirmarSenha: ''
                          });
                          setIsFormOpen(true);
                        }}
                        className="group p-2 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        <Edit className="h-5 w-5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
                      </button>
                      {user.status && (
                        <button
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingUser ? 'Editar Conta' : 'Nova Conta'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome Completo
                  </label>
                  <div className="mt-1 relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefone
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.fone}
                      onChange={(e) => setFormData({ ...formData, fone: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CNPJ
                  </label>
                  <div className="mt-1 relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Empresa
                  </label>
                  <div className="mt-1 relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Perfil
                  </label>
                  <div className="mt-1 relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.perfil_id}
                      disabled={editingUser}
                      onChange={(e) => setFormData({ ...formData, perfil_id: Number(e.target.value) })}
                      className={selectClasses}
                      required
                    >
                      <option value="1">Super Admin</option>
                      <option value="2">Admin</option>
                      <option value="3">AVA Admin</option>
                      <option value="4">AVA</option>
                      <option value="5">Cliente</option>
                      <option value="6">Afiliado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Fields (only for new users) */}
              {!editingUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Senha
                    </label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        className={inputClasses}
                        required={!editingUser}
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirmar Senha
                    </label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.confirmarSenha}
                        onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                        className={inputClasses}
                        required={!editingUser}
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90"
                >
                  {editingUser ? 'Salvar Alterações' : 'Criar Conta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar a INATIVAÇÃO</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tem certeza que deseja INATIVAR esta conta? Esta ação pode ser revertida posteriormente.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUserId(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Desativar
              </button>


            </div>
          </div>
        </div>
      )}
    </div>
  );
}