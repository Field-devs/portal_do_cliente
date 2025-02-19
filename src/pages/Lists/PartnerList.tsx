import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  Edit,
  AlertCircle,
  X,
  Check,
  Mail,
  Phone,
  Calendar,
  Percent,
  DollarSign,
  Building2,
  Users,
  UserCheck,
  Copy,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import CommercialAffiliateForm from '../../components/CommercialAffiliateForm';

type PartnerType = 'cf' | 'ava' | 'commercial';

interface Partner {
  cliente_afiliado_id: string;
  nome: string;
  email: string;
  telefone: number;
  desconto: number;
  comissao: number;
  codigo_cupom: string;
  vencimento: string;
  status: boolean;
  datacriacao: string;
}

export default function PartnerList() {
  const [activeTab, setActiveTab] = useState<PartnerType>('cf');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'commercial') {
      fetchPartners();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('cliente_afiliado')
        .select('*')
        .order('dt_criacao', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('profile_id', activeTab === 'cf' ? 5 : 4) // 5 for CF, 4 for AVA
        .order('dt_criacao', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPartnerId) return;

    try {
      if (activeTab === 'commercial') {
        const { error } = await supabase
          .from('cliente_afiliado')
          .update({ status: false })
          .eq('cliente_afiliado_id', selectedPartnerId);

        if (error) throw error;

        setPartners(prev => prev.map(p =>
          p.cliente_afiliado_id === selectedPartnerId
            ? { ...p, status: false }
            : p
        ));
      } else {
        const { error } = await supabase
          .from('pessoas')
          .update({ status: false })
          .eq('pessoas_id', selectedPartnerId);

        if (error) throw error;

        setUsers(prev => prev.map(u =>
          u.user_id === selectedPartnerId
            ? { ...u, status: false }
            : u
        ));
      }

      setIsDeleteModalOpen(false);
      setSelectedPartnerId(null);
    } catch (error) {
      console.error('Error deactivating partner:', error);
    }
  };

  const handleCopyToClipboard = async (couponCode: string) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setShowCopyTooltip(couponCode);
      setTimeout(() => setShowCopyTooltip(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };

  const formatPhoneNumber = (phone: number | string | null) => {
    if (!phone) return '-';

    // Convert to string and ensure it has 11 digits
    const digits = phone.toString().padStart(11, '0');

    // Format as (XX) XXXXX-XXXX
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  };

  const filteredItems = activeTab === 'commercial'
    ? partners.filter(partner => {
      const matchesSearch =
        partner.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.codigo_cupom.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? partner.status : !partner.status);

      return matchesSearch && matchesStatus;
    })
    : users.filter(user => {
      const matchesSearch =
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? user.status : !user.status);

      return matchesSearch && matchesStatus;
    });

  const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="group p-2 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Editar"
    >
      <Edit className="h-5 w-5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('cf')}
            className={`flex items-center pb-4 px-1 ${activeTab === 'cf'
                ? 'border-b-2 border-brand text-brand dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Clientes Finais
          </button>
          <button
            onClick={() => setActiveTab('ava')}
            className={`flex items-center pb-4 px-1 ${activeTab === 'ava'
                ? 'border-b-2 border-brand text-brand dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Building2 className="h-5 w-5 mr-2" />
            AVAs
          </button>
          <button
            onClick={() => setActiveTab('commercial')}
            className={`flex items-center pb-4 px-1 ${activeTab === 'commercial'
                ? 'border-b-2 border-brand text-brand dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <UserCheck className="h-5 w-5 mr-2" />
            Afiliados Comerciais
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {activeTab === 'cf' ? 'Clientes Finais' :
            activeTab === 'ava' ? 'AVAs' :
              'Afiliados Comerciais'}
        </h1>
        {activeTab === 'commercial' && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Afiliado
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Buscar por nome${activeTab === 'commercial' ? ', email ou código do cupom' : ' ou email'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {activeTab === 'commercial' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Afiliado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cupom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Taxas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vencimento
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Data de Criação
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {activeTab === 'commercial' ? (
                filteredItems.map((partner) => (
                  <tr key={partner.cliente_afiliado_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {partner.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {partner.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPhoneNumber(partner.telefone)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() => handleCopyToClipboard(partner.codigo_cupom)}
                          className="group px-3 py-1.5 inline-flex items-center space-x-2 text-sm leading-5 font-medium rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <span>{partner.codigo_cupom}</span>
                          <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        {showCopyTooltip === partner.codigo_cupom && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Copiado!</span>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Desconto: {partner.desconto}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Comissão: {partner.comissao}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${partner.status
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {partner.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(partner.vencimento), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <EditButton onClick={() => handleEdit(partner)} />
                        {partner.status && (
                          <button
                            onClick={() => {
                              setSelectedPartnerId(partner.cliente_afiliado_id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="group p-2 rounded-lg transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            aria-label="Excluir"
                          >
                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredItems.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPhoneNumber(user.telefone)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status
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
                              setSelectedPartnerId(user.id);
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Partner Form Modal */}
      {isFormOpen && (
        <CommercialAffiliateForm
          initialData={editingPartner}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingPartner(null);
            fetchPartners();
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingPartner(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar desativação</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tem certeza que deseja desativar este {activeTab === 'commercial' ? 'afiliado' : activeTab === 'ava' ? 'AVA' : 'cliente'}? Esta ação pode ser revertida posteriormente.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPartnerId(null);
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