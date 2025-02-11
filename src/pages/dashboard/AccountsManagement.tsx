import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Check,
  Mail,
  Phone,
  Building2,
  User,
  Lock,
  Calendar,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  user_id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cnpj: string | null;
  empresa: string | null;
  cargo_id: number;
  status: boolean;
  dt_criacao: string;
}

const userTypes = [
  { id: 5, label: 'Cliente Final' },
  { id: 1, label: 'Super Admin OUTR' },
  { id: 2, label: 'Admin OUTR' },
  { id: 3, label: 'Admin AVA' },
  { id: 4, label: 'Super Admin AVA' }
];

const inputClasses = `pl-10 block w-full rounded-md shadow-sm focus:ring-brand focus:border-brand 
  border-gray-300 dark:border-gray-600 
  bg-white dark:bg-gray-700 
  text-gray-900 dark:text-gray-100 
  placeholder-gray-400 dark:placeholder-gray-500`;

const selectClasses = `pl-10 block w-full rounded-md shadow-sm focus:ring-brand focus:border-brand 
  border-gray-300 dark:border-gray-600 
  bg-white dark:bg-gray-700 
  text-gray-900 dark:text-gray-100`;

export default function AccountsManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<number | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<number | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
    empresa: '',
    cargo_id: 5,
    senha: '',
    confirmarSenha: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const getRoleBadgeStyles = (cargoId: number) => {
    switch (cargoId) {
      case 1: // Super Admin
        return 'bg-brand text-white';
      case 2: // Admin
        return 'bg-brand/90 text-white';
      case 3: // AVA Admin
        return 'bg-brand/80 text-white';
      case 4: // AVA
        return 'bg-brand/70 text-white';
      case 5: // Cliente
        return 'bg-brand/60 text-white';
      case 6: // Afiliado
        return 'bg-brand/50 text-white';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, typeFilter]);

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from('pessoas')
        .select('*', { count: 'exact' });

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter === 'active');
      }
      if (typeFilter !== 'all') {
        query = query.eq('cargo_id', typeFilter);
      }

      // Apply pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      query = query.range(start, end);

      const { data, count, error } = await query;

      if (error) throw error;
      setUsers(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (formData.telefone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone)) {
      errors.telefone = 'Telefone inválido';
    }

    if (formData.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
      errors.cnpj = 'CNPJ inválido';
    }

    if (!formData.empresa.trim()) {
      errors.empresa = 'Empresa é obrigatória';
    }

    if (!formData.senha) {
      errors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 8) {
      errors.senha = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (formData.senha !== formData.confirmarSenha) {
      errors.confirmarSenha = 'Senhas não coincidem';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;

    // Apply masks
    if (name === 'telefone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2')
        .slice(0, 15);
    } else if (name === 'cnpj') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/g, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/g, '.$1/$2')
        .replace(/(\d{4})(\d)/g, '$1-$2')
        .slice(0, 18);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            full_name: formData.nome
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('pessoas')
          .insert([{
            pessoas_id: authData.user.id,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone || null,
            cnpj: formData.cnpj || null,
            empresa: formData.empresa,
            cargo_id: formData.cargo_id,
            status: true
          }]);

        if (profileError) throw profileError;

        fetchUsers();
        setIsFormOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: 'Erro ao criar usuário. Por favor, tente novamente.'
      }));
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      const { error } = await supabase
        .from('pessoas')
        .update({ status: false })
        .eq('pessoas_id', selectedUserId);

      if (error) throw error;

      setUsers(prev =>
        prev.map(user =>
          user.user_id === selectedUserId
            ? { ...user, status: false }
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
      telefone: '',
      cnpj: '',
      empresa: '',
      cargo_id: 5,
      senha: '',
      confirmarSenha: ''
    });
    setFormErrors({});
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cnpj?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? user.status : !user.status);
    
    const matchesType = typeFilter === 'all' || user.cargo_id === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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
          <Plus className="h-5 w-5 mr-2 text-white" />
          <span className="text-white">Nova Conta</span>
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
                <option value="all">Todos os Cargos</option>
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
                  Cargo
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
                <tr key={user.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getRoleBadgeStyles(user.cargo_id)}`}>
                      {user.cargo_id === 1 ? 'Super Admin' :
                       user.cargo_id === 2 ? 'Admin' :
                       user.cargo_id === 3 ? 'AVA Admin' :
                       user.cargo_id === 4 ? 'AVA' :
                       user.cargo_id === 5 ? 'Cliente' :
                       user.cargo_id === 6 ? 'Afiliado' : 'Desconhecido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.empresa || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(user.dt_criacao), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="group p-2 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                        <Edit className="h-5 w-5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
                      </button>
                      {user.status && (
                        <button
                          onClick={() => {
                            setSelectedUserId(user.user_id);
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* New User Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Novo Usuário
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
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className={`${inputClasses} ${
                        formErrors.nome
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                  </div>
                  {formErrors.nome && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nome}</p>
                  )}
                </div>

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
                      className={`${inputClasses} ${
                        formErrors.email
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefone
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      className={`${inputClasses} ${
                        formErrors.telefone
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {formErrors.telefone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.telefone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CNPJ
                  </label>
                  <div className="mt-1 relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      placeholder="00.000.000/0000-00"
                      className={`${inputClasses} ${
                        formErrors.cnpj
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {formErrors.cnpj && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.cnpj}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Empresa
                  </label>
                  <div className="mt-1 relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className={`${inputClasses} ${
                        formErrors.empresa
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                  </div>
                  {formErrors.empresa && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.empresa}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Usuário
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="cargo_id"
                      value={formData.cargo_id}
                      onChange={handleInputChange}
                      className={selectClasses}
                      required
                    >
                      {userTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Senha
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="senha"
                      value={formData.senha}
                      onChange={handleInputChange}
                      className={`${inputClasses} ${
                        formErrors.senha
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                      minLength={8}
                    />
                  </div>
                  {formErrors.senha && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.senha}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar Senha
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      className={`${inputClasses} ${
                        formErrors.confirmarSenha
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                  </div>
                  {formErrors.confirmarSenha && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirmarSenha}</p>
                  )}
                </div>
              </div>

              {formErrors.submit && (
                <div className="text-red-600 text-sm flex items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {formErrors.submit}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-