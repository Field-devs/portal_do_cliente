import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPhone } from '../../utils/formatters';
import ActionsButtons from '../../components/ActionsData';
import { UpdateSingleField } from '../../utils/supageneric';
import ComboFrag from '../../components/Fragments/ComboFrag';
import { useAuth } from '../../components/AuthProvider';
import CircularWait from '../../components/CircularWait';

export default function SignatureList() {
  const { user, profile: role, signOut } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'cancelled' | 'suspended'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'lastMonth' | 'thisYear'>('all');

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-xl";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full";

  const optContract = [
    { key: "AT", label: "Ativo" },
    { key: "IN", label: "Inativo" },
    { key: "CA", label: "Cancelado" },
    { key: "SP", label: "Suspenso" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('v_contrato')
        .select('*')
        .eq('empresa_id', user?.id)
        .order("id")
        ;

      if (error) throw error;
      setContracts(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30';
      case 'pendente':
        return 'bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30';
      case 'cancelado':
        return 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30';
      case 'suspenso':
        return 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30';
      default:
        return 'bg-gray-50 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30';
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch =
      contract.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.fone && contract.fone.includes(searchTerm));

    const matchesStatus =
      statusFilter === 'all' ||
      contract.status_title.toLowerCase() === statusFilter;

    const matchesDate = () => {
      if (dateFilter === 'all') return true;

      const contractDate = new Date(contract.dt);
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      switch (dateFilter) {
        case 'thisMonth':
          return contractDate >= firstDayOfMonth;
        case 'lastMonth':
          return contractDate >= firstDayOfLastMonth && contractDate < firstDayOfMonth;
        case 'thisYear':
          return contractDate >= firstDayOfYear;
        default:
          return true;
      }
    };

    return matchesSearch && matchesStatus && matchesDate();
  });


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Contratos" />
      </div>
    );
  }

  const handleStatusChange = async (id: string, status: string) => {
    //console.log("handleStatusChange", id, status);
    let response = await UpdateSingleField("contrato", "id", id, "status", status);
    return response;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Assinaturas</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Contracts */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <CheckCircle className={iconClass} />
            </div>
            <span className={badgeClass}>Total Atual</span>
          </div>
          <h3 className={metricTitleClass}>Assinaturas Ativas</h3>
          <p className={metricValueClass}>
            {contracts.filter(c => c.status_title.toLowerCase() === 'ativo').length}
          </p>
          <div className="flex items-center mt-2">
            <Users className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Clientes ativos</span>
          </div>
        </div>

        {/* Pending Contracts */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Clock className={iconClass} />
            </div>
            <span className={badgeClass}>Aguardando</span>
          </div>
          <h3 className={metricTitleClass}>Assinaturas Pendentes</h3>
          <p className={metricValueClass}>
            {contracts.filter(c => c.status_title.toLowerCase() === 'pendente').length}
          </p>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Em análise</span>
          </div>
        </div>

        {/* Suspended Contracts */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <XCircle className={iconClass} />
            </div>
            <span className={badgeClass}>Suspensos</span>
          </div>
          <h3 className={metricTitleClass}>Assinaturas Suspensas</h3>
          <p className={metricValueClass}>
            {contracts.filter(c => c.status_title.toLowerCase() === 'suspenso').length}
          </p>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Aguardando regularização</span>
          </div>
        </div>

        {/* Cancelled Contracts */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <XCircle className={iconClass} />
            </div>
            <span className={badgeClass}>Cancelados</span>
          </div>
          <h3 className={metricTitleClass}>Assinaturas Canceladas</h3>
          <p className={metricValueClass}>
            {contracts.filter(c => c.status_title.toLowerCase() === 'cancelado').length}
          </p>
          <div className="flex items-center mt-2">
            <Users className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Clientes inativos</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={cardClass}>
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
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px]"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="pending">Pendentes</option>
                <option value="suspended">Suspensos</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px]"
              >
                <option value="all">Todas as Datas</option>
                <option value="thisMonth">Este Mês</option>
                <option value="lastMonth">Mês Passado</option>
                <option value="thisYear">Este Ano</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className={`${cardClass} mt-6`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50">
            <thead>
              <tr className="bg-light-secondary dark:bg-[#0F172A]/60">
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wide">
                  Consumo
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-1/6">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                      {contract.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-light-text-secondary dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2" />
                        {contract.email}
                      </div>
                      <div className="flex items-center text-light-text-secondary dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2" />
                        {formatPhone(contract.fone)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {contract.plano_nome}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      -
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <ComboFrag
                        options={optContract}
                        value={contract.status}
                        onChange={(value: string) => handleStatusChange(contract.id, value)}
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
  );
}