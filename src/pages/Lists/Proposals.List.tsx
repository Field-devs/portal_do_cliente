import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  CalendarRange
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePlanos } from '../../hooks/usePlanos';
import { ModalForm } from '../../components/Modal/Modal';
import ProposalForm from '../Forms/ProposalForm';
import ActionsButtons from '../../components/ActionsData';
import SwitchFrag from '../../components/Fragments/SwitchFrag';
import Proposta from '../../Models/Propostas';
import { formatPhone, formatCNPJCPF } from '../../utils/formatters';

export default function ProposalsList() {
  const [propid, setPropId] = useState<string | null>(null);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [OpenProposal, setOpenProposal] = useState(false);
  const [active, SetActive] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<'1d' | '15d' | '1m' | 'custom'>('1m');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  const { loading: planosLoading } = usePlanos();

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-light-border dark:border-gray-700/50";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-xl";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full";

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    // Update date range based on selected filter
    const now = new Date();
    let start = new Date();
    let end = now;

    switch (dateFilter) {
      case '1d':
        start.setDate(now.getDate() - 1);
        break;
      case '15d':
        start.setDate(now.getDate() - 15);
        break;
      case '1m':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'custom':
        return; // Don't update if custom
    }

    if (dateFilter !== 'custom') {
      setCustomDateRange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
    }
  }, [dateFilter]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('v_proposta')
        .select('*')
        .order('dt', { ascending: false });

      if (error) throw error;
      setPropostas(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseProposal = () => {
    setOpenProposal(false);
  };

  const handleOpenProposal = () => {
    setOpenProposal(true);
  };

  const handleChange = (checked: boolean) => {
    SetActive(checked ? true : false);
  };

  const handleEdit = (row : string) => {
    setPropId(row);
    HandleOpenProposal();
  };

  const filteredProposals = propostas.filter(() => {
    return propostas;
  });
  const handleSort = (type: 'date' | 'name' | 'value') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  const filteredProposals = propostas
    .filter(proposta => {
      // Text search
      const searchMatch = proposta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposta.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposta.cnpjcpf.includes(searchTerm);

      // Status filter
      const statusMatch = statusFilter === 'all' || 
        (statusFilter === 'pending' && proposta.status === 'PE') ||
        (statusFilter === 'accepted' && proposta.status === 'AC') ||
        (statusFilter === 'rejected' && proposta.status === 'RC');

      // Date range filter
      const propostaDate = new Date(proposta.dt);
      const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
      const endDate = customDateRange.end ? new Date(customDateRange.end) : null;
      
      const dateMatch = (!startDate || propostaDate >= startDate) &&
        (!endDate || propostaDate <= endDate);

      return searchMatch && statusMatch && dateMatch;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'date':
          return multiplier * (new Date(a.dt).getTime() - new Date(b.dt).getTime());
        case 'name':
          return multiplier * a.nome.localeCompare(b.nome);
        case 'value':
          return multiplier * (a.total - b.total);
        default:
          return 0;
      }
    });

  if (loading || planosLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[calc(100vw-theme(space.24))] overflow-x-auto">
      <ModalForm
        isOpen={OpenProposal}
        onClose={handleCloseProposal}
        title="Informações da Nova Proposta"
        maxWidth="2xl"
      >
        <ProposalForm id={propid ?? ''} />
        <ProposalForm onClose={handleCloseProposal} />
      </ModalForm>

      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className={titleClass}>Propostas</h1>
          <button
            onClick={handleOpenProposal}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Proposta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <FileText className={iconClass} />
              </div>
              <span className={badgeClass}>Total</span>
            </div>
            <h3 className={metricTitleClass}>Total de Propostas</h3>
            <p className={metricValueClass}>{propostas.length}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>+12.5% este mês</span>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <Clock className={iconClass} />
              </div>
              <span className={badgeClass}>Aguardando</span>
            </div>
            <h3 className={metricTitleClass}>Propostas Pendentes</h3>
            <p className={metricValueClass}>
              {propostas.filter(p => p.status === 'PE').length}
            </p>
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>Aguardando aprovação</span>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <CheckCircle className={iconClass} />
              </div>
              <span className={badgeClass}>Aceitas</span>
            </div>
            <h3 className={metricTitleClass}>Propostas Aceitas</h3>
            <p className={metricValueClass}>
              {propostas.filter(p => p.status === 'AC').length}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>+8.3% vs último mês</span>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <XCircle className={iconClass} />
              </div>
              <span className={badgeClass}>Recusadas</span>
            </div>
            <h3 className={metricTitleClass}>Propostas Recusadas</h3>
            <p className={metricValueClass}>
              {propostas.filter(p => p.status === 'RC').length}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>-2.1% vs último mês</span>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, email ou CNPJ/CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 py-2 w-full"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative w-40">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="select pl-10 py-2 w-full"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="accepted">Aceitas</option>
                  <option value="rejected">Recusadas</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="relative w-48">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [type, order] = e.target.value.split('-');
                    setSortBy(type as typeof sortBy);
                    setSortOrder(order as typeof sortOrder);
                  }}
                  className="select pl-10 py-2 w-full"
                >
                  <option value="date-desc">Data (mais recente)</option>
                  <option value="date-asc">Data (mais antiga)</option>
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="name-desc">Nome (Z-A)</option>
                  <option value="value-desc">Valor (maior-menor)</option>
                  <option value="value-asc">Valor (menor-maior)</option>
                </select>
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <CalendarRange className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-400">Período:</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDateFilter('1d')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    dateFilter === '1d'
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  1 dia
                </button>
                <button
                  onClick={() => setDateFilter('15d')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    dateFilter === '15d'
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  15 dias
                </button>
                <button
                  onClick={() => setDateFilter('1m')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    dateFilter === '1m'
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  1 mês
                </button>
                <button
                  onClick={() => setDateFilter('custom')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    dateFilter === 'custom'
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Personalizado
                </button>
              </div>
              {dateFilter === 'custom' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="input py-1 w-36 text-sm"
                  />
                  <span className="text-gray-400">até</span>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="input py-1 w-36 text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${cardClass} mt-4`}>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-light-border dark:divide-gray-700/50">
              <thead>
                <tr className="bg-light-secondary dark:bg-[#0F172A]/60">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    CNPJ/CPF
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Fone
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Validade
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[20px]">
                    Ativo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
                {filteredProposals.map((proposta) => (
                  <tr
                    key={proposta.id}
                    className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {new Date(proposta.dt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {formatCNPJCPF(proposta.cnpjcpf)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                        {proposta.nome}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {proposta.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {formatPhone(proposta.fone)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {proposta.validade} {proposta.validade === 1 ? 'Dia' : 'Dias'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(proposta.total)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${proposta.status === 'PE'
                          ? 'badge-warning'
                          : proposta.status === 'AC'
                            ? 'badge-success'
                            : 'badge-error'
                          }`}>
                          {proposta.status_title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ActionsButtons onRead={() => handleEdit(proposta.id)} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <SwitchFrag name='active' checked={active} onChange={handleChange} />
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