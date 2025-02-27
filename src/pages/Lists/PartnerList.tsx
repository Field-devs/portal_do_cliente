import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Building2,
  Users,
  UserCheck,
  Copy,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import CommercialAffiliateForm from '../Forms/CommercialAffiliateForm';
import { formatPhone, formatCNPJCPF } from '../../utils/formatters';
import { ModalForm } from '../../components/Modal/Modal';

type PartnerType = 'cf' | 'ava' | 'afiliado';

interface Partner {
  id: string;
  nome: string;
  email: string;
  telefone: number;
  desconto: number;
  comissao: number;
  cupom: string;
  vencimento: string;
  active: boolean;
  dt: string;
}

export default function PartnerList() {
  const [activeTab, setActiveTab] = useState<PartnerType>('cf');
  const [client, setClient] = useState<Partner[]>([]);
  const [ava, setAVA] = useState<Partner[]>([]);
  const [afilate, setAfilate] = useState<Partner[]>([]);


  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);
  const [showAfilate, setShowAfilate] = useState<boolean>(false);


  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-light-border dark:border-gray-700/50";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";

  useEffect(() => {
    fetchClientes();
  }, [activeTab]);

  const fetchClientes = async () => {
    try {
      let Tipo = 'CF';
      if (activeTab === 'ava') {
        Tipo = 'AVA';
      }
      else if (activeTab === 'afiliado') {
        Tipo = 'AF';
      }

      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('tipo', Tipo)
        .order('dt_add', { ascending: false });

      if (error) throw error;
      setClient(data || []);
      setAVA(data || []);
      setAfilate(data || []);

    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
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

  const filteredItems = activeTab === 'afiliado'
    ? client.filter(partner => {
      const matchesSearch =
        partner.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.cupom.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? partner.active : !partner.active);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500/80"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Clientes</h1>
        {activeTab != 'cf' && (
          <button
            onClick={() => setShowAfilate(true)}
            className="flex items-center px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-xl transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {activeTab === 'afiliado' ? 'Adicionar Afiliado' : 'Adicionar AVA'}
          </button>
        )}
      </div>

      {/* Search and Tabs */}
      <div className={cardClass}>
        <div className="flex flex-col space-y-6">
          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('cf')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'cf'
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Clientes Finais
            </button>
            <button
              onClick={() => setActiveTab('ava')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'ava'
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
            >
              <Building2 className="h-5 w-5 mr-2" />
              AVAs
            </button>
            <button
              onClick={() => setActiveTab('afiliado')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'afiliado'
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Afiliados Comerciais
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 rounded-xl text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 rounded-xl text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px]"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${cardClass} mt-12`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50">
            <thead>
              <tr className="bg-light-secondary dark:bg-[#0F172A]/60">
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Telefone
                </th>
                {activeTab === 'afiliado' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                      Cupom
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                      Taxas
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Data de Criação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {filteredItems.map((item) => (
                <tr
                  key={activeTab === 'afiliado' ? item.id : item.id}
                  className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                      {item.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {formatPhone(item.telefone?.toString())}
                    </div>
                  </td>
                  {activeTab === 'afiliado' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => handleCopyToClipboard(item.cupom)}
                            className="group px-3 py-1.5 inline-flex items-center space-x-2 text-sm leading-5 font-medium rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 border border-brand-200 dark:border-brand-700/30 transition-colors"
                          >
                            <span>{item.cupom}</span>
                            <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          {showCopyTooltip === item.cupom && (
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
                        <div className="text-base text-light-text-secondary dark:text-gray-300">
                          <div>Desconto: {item.desconto}%</div>
                          <div>Comissão: {item.comissao}%</div>
                        </div>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.status
                      ? 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30'
                      : 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                      }`}>
                      {item.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {/* {format(new Date(item?.datacriacao), 'dd/MM/yyyy')} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commercial Affiliate Form Modal */}
      <ModalForm
        isOpen={showAfilate}
        onClose={() => setShowAfilate(false)}
        title="Titulo"
        maxWidth="2xl"
      >

        <CommercialAffiliateForm
          initialData={editingPartner}
          onSuccess={() => {
            setEditingPartner(null);
            fetchClientes();
          }}
          onCancel={() => {
            setShowAfilate(false);
            setEditingPartner(null);
          }}
        />

      </ModalForm>


    </div>
  );
}