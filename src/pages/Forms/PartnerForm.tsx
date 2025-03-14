import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Building2,
  Users,
  UserCheck,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";

  useEffect(() => {
    fetchClientes();
  }, [activeTab]);

  const fetchClientes = async () => {
    try {
      //if (activeTab === 'commercial') {


      const { data, error } = await supabase
        .from('cliente')
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
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-brand hover:bg-brand/90 text-white transition-colors"
        >
            <Plus className="h-5 w-5 mr-2" />
            {activeTab === 'commercial' ? 'Novo AVA' : 'Novo Afiliado'}
          </button>
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
              onClick={() => setActiveTab('commercial')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'commercial'
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
                  className="w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px]"
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