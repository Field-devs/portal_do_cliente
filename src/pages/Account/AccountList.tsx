import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';
import { ModalForm } from '../../components/Modal/Modal';
import SearchFilter from '../../components/SearchFilter';
import UserForm from '../Forms/UserForm';
import {
  Search,
  Filter,
  Plus,
  Shield,
  Mail,
  Phone,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  ChevronRight
} from 'lucide-react';
import ActionsButtons from '../../components/ActionsData';
import { UpdateSingleField } from '../../utils/supageneric';
import { User } from '../../Models/Uses';
import CircularWait from '../../components/CircularWait';
import '../../Styles/animations.css';

function AccountList() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-lg";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg";

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

  const handleFormClose = () => {
    setEditingUser(null);
    setShowUserForm(false);
  };

  const handleEdit = () => {
    const selectedUser = users.find(u => u.id === user?.id);
    if (selectedUser) {
      setEditingUser(selectedUser);
    }
    setShowUserForm(true);
  };


  const handleOnLock = async (id: string, status: boolean) => {
    let response = await UpdateSingleField("users", "id", id, "active", !status);
    return response;
  };



  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cnpj?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.perfil_id === roleFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.active) ||
      (statusFilter === 'inactive' && !user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Usuários" />
      </div>
    );
  }


  return (

    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`${titleClass} title-fade-in`}>Usuários</h1>
        <button
          onClick={() => setShowUserForm(true)}
          className="btn-primary flex items-center rounded-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Usuário
        </button>
      </div>

      <ModalForm
        isOpen={showUserForm}
        onClose={handleFormClose}
        title={editingUser ? `Editar Usuário: ${editingUser.nome}` : "Nova Conta"}
        maxWidth="2xl"
      >
        <UserForm
          initialData={editingUser ? {
            id: editingUser.id,
            nome: editingUser.nome,
            email: editingUser.email || '',
            empresa: editingUser.empresa || '',
            cnpj: editingUser.cnpj || '',
            fone: editingUser.fone || '',
            perfil_id: editingUser.perfil_id
          } : undefined}
          onSuccess={() => {
            handleFormClose();
            fetchUsers();
          }}
          onCancel={handleFormClose}
        />
      </ModalForm>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
        {/* Total Users */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Users className={iconClass} />
            </div>
            <span className={badgeClass}>Total</span>
          </div>
          <h3 className={metricTitleClass}>Total de Usuários</h3>
          <p className={metricValueClass}>{users.length}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>+12.5% este mês</span>
          </div>
        </div>

        {/* Active Users */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <CheckCircle className={iconClass} />
            </div>
            <span className={badgeClass}>Ativos</span>
          </div>
          <h3 className={metricTitleClass}>Usuários Ativos</h3>
          <p className={metricValueClass}>
            {users.filter(u => u.active).length}
          </p>
          <div className="flex items-center mt-2">
            <Users className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Acessando o sistema</span>
          </div>
        </div>

        {/* Pending Users */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Clock className={iconClass} />
            </div>
            <span className={badgeClass}>Pendentes</span>
          </div>
          <h3 className={metricTitleClass}>Usuários Pendentes</h3>
          <p className={metricValueClass}>
            {users.filter(u => !u.active).length}
          </p>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Aguardando ativação</span>
          </div>
        </div>

        {/* Recent Users */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <TrendingUp className={iconClass} />
            </div>
            <span className={badgeClass}>Recentes</span>
          </div>
          <h3 className={metricTitleClass}>Novos Usuários</h3>
          <p className={metricValueClass}>
            {users.filter(u => {
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              return new Date(u.dt_add) > oneWeekAgo;
            }).length}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Últimos 7 dias</span>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <SearchFilter
          searchPlaceholder="Buscar por nome, email ou CNPJ..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={[
            { value: 'all', label: 'Todos os Status' },
            { value: 'active', label: 'Ativos' },
            { value: 'inactive', label: 'Inativos' }
          ]}
          filterValue={statusFilter}
          onFilterChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
        />
      </div>

      <div className={`${cardClass} mt-6 overflow-hidden fade-in`}>
        <div className="relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-l from-gray-100/80 dark:from-gray-800/80 to-transparent pointer-events-none flex items-center justify-end pr-2 transition-opacity duration-300 ease-in-out opacity-100 z-10">
            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 animate-pulse" />
          </div>
          <div className="overflow-x-auto" onScroll={(e) => {
            const target = e.currentTarget;
            const indicator = target.previousElementSibling as HTMLElement;
            if (indicator) {
              const scrollPercentage = (target.scrollLeft + target.clientWidth) / target.scrollWidth;
              indicator.style.opacity = scrollPercentage >= 0.95 ? '0' : '1';
            }
          }}>
          <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-light-secondary dark:bg-[#0F172A]/60 rounded-t-lg">
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.foto ? (
                        <img
                          src={user.foto}
                          alt={user.nome}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                          <span className="text-lg font-medium">{user.nome.charAt(0)}</span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-base font-medium text-light-text-primary dark:text-white">
                          {user.nome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-light-text-secondary dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-light-text-secondary dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2" />
                        {user.fone || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-info">
                      {user.perfil_nome}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {new Date(user.dt_add).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">

                      <ActionsButtons
                        onEdit={() => {
                          setEditingUser(user);
                          setShowUserForm(true);
                        }}
                        onLocker={user.perfil_id == 1 ? null : async () => handleOnLock(user.id, user.active)}
                        active={user.active}
                      />

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AccountList;