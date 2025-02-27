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
import CommercialAffiliateForm from './CommercialAffiliateForm';
import { formatPhone, formatCNPJCPF } from '../../utils/formatters';

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

export default function PartnerForm() {
  const [activeTab, setActiveTab] = useState<PartnerType>('cf');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-light-border dark:border-gray-700/50";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-xl";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full";

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
        .order('dt_add', { ascending: false });

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
        .eq('perfil_id', activeTab === 'cf' ? 5 : 4)
        .order('dt_add', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        {activeTab === 'commercial' && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-xl transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Afiliado
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
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'cf'
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Clientes Finais
            </button>
            <button
              onClick={() => setActiveTab('ava')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'ava'
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              <Building2 className="h-5 w-5 mr-2" />
              AVAs
            </button>
            <button
              onClick={() => setActiveTab('commercial')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'commercial'
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


    </div>
  );
}