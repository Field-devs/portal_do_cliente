import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Building2,
  Users,
  UserCheck,
  Copy,
  CheckCircle,
  UserPlus,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ModalForm } from '../../components/Modal/Modal';
import CommercialAffiliateForm from './CommercialAffiliateForm';
import AVAForm from './AVAForm';
import CircularWait from '../../components/CircularWait';

type PartnerType = 'CF' | 'AVA' | 'AF';

interface Partner {
  id: string;
  nome: string;
  email: string;
  fone: string;
  tipo: string;
  active: boolean;
}

export default function PartnerForm() {
  const [activeTab, setActiveTab] = useState<PartnerType>('CF');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const tabClass = (active: boolean) => `flex items-center px-4 py-2 rounded-lg transition-colors ${active
    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
    : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
  }`;
  const inputClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
  const selectClass = "pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px] rounded-lg shadow-sm";

  useEffect(() => {
    fetchPartners();
  }, [activeTab]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('type', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPartner = () => {
    setEditingPartner(null);
    setShowForm(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingPartner(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    fetchPartners();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Parceiros" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Parceiros</h1>
        <button
          onClick={handleNewPartner}
          className="btn-primary flex items-center rounded-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          {activeTab === 'AVA' ? 'Novo AVA' : 'Novo Afiliado'}
        </button>
      </div>

      {/* Tabs and Search */}
      <div className={cardClass}>
        <div className="flex flex-col space-y-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('CF')}
              className={tabClass(activeTab === 'CF')}
            >
              <Users className="h-5 w-5 mr-2" />
              Clientes Finais
            </button>
            <button
              onClick={() => setActiveTab('AVA')}
              className={tabClass(activeTab === 'AVA')}
            >
              <Building2 className="h-5 w-5 mr-2" />
              AVAs
            </button>
            <button
              onClick={() => setActiveTab('AF')}
              className={tabClass(activeTab === 'AF')}
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Afiliados Comerciais
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className={selectClass}
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

      {/* Partner List */}
      <div className={`${cardClass} mt-6 overflow-hidden`}>
        <div className="overflow-x-auto">
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
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {partners.map((partner) => (
                <tr
                  key={partner.id}
                  className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                      {partner.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {partner.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {partner.fone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      partner.active
                        ? 'badge-success'
                        : 'badge-error'
                    }`}>
                      {partner.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEditPartner(partner)}
                      className="text-brand hover:text-brand/80 transition-colors"
                    >
                      <UserPlus className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partner Form Modal */}
      <ModalForm
        isOpen={showForm}
        onClose={handleFormClose}
        title={editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
        icon={<UserPlus className="h-5 w-5" />}
        maxWidth="2xl"
      >
        {activeTab === 'AVA' ? (
          <AVAForm
            initialData={editingPartner}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        ) : (
          <CommercialAffiliateForm
            initialData={editingPartner}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        )}
      </ModalForm>
    </div>
  );
}