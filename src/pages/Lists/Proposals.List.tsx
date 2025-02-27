import { useState, useEffect } from 'react';
import Proposta from '../../Models/Propostas';
import { formatPhone, formatCNPJCPF } from '../../utils/formatters';
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
  XCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePlanos } from '../../hooks/usePlanos';
import { ModalForm } from '../../components/Modal/Modal';
import ProposalForm from '../Forms/ProposalForm';
import ActionsButtons from '../../components/ActionsData';
import SwitchFrag from '../../components/Fragments/SwitchFrag';

export default function ProposalsList() {
  const [propid, setPropId] = useState<string | null>(null);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [OpenProposal, setOpenProposal] = useState(false);
  const [active, SetActive ] = useState(true);

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

  const HandleOpenProposal = () => {
    setOpenProposal(true);
  };

  const handleChange = (checked: boolean) => {
    console.log(active);
    SetActive(checked ? true : false);
  };

  const handleEdit = (row : string) => {
    setPropId(row);
    HandleOpenProposal();
  };

  const filteredProposals = propostas.filter(() => {
    return propostas;
  });

  if (loading || planosLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <>
      <ModalForm
        isOpen={OpenProposal}
        onClose={() => setOpenProposal(false)}
        title="Nova Proposta"
        maxWidth='2xl'
      >
        <ProposalForm 
          id={propid ?? ''}
          onCancel={() => setOpenProposal(false)}
        />
        
      </ModalForm>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={titleClass}>Propostas</h1>
          <button
            onClick={() => HandleOpenProposal()}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Proposta
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Total Proposals */}
          <div className={`${cardClass} p-3`}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <FileText className={iconClass} />
              </div>
              <span className={badgeClass}>Total</span>
            </div>
            <h3 className="text-base font-medium text-light-text-primary dark:text-white mb-1">Total</h3>
            <p className={metricValueClass}>{propostas.length}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>+12.5% este mês</span>
            </div>
          </div>

          {/* Pending Proposals */}
          <div className={`${cardClass} p-3`}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <Clock className={iconClass} />
              </div>
              <span className={badgeClass}>Aguardando</span>
            </div>
            <h3 className="text-base font-medium text-light-text-primary dark:text-white mb-1">Pendentes</h3>
            <p className={metricValueClass}>
              {propostas.filter(p => p.status === 'PE').length}
            </p>
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>Aguardando aprovação</span>
            </div>
          </div>

          {/* Accepted Proposals */}
          <div className={`${cardClass} p-3`}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <CheckCircle className={iconClass} />
              </div>
              <span className={badgeClass}>Aceitas</span>
            </div>
            <h3 className="text-base font-medium text-light-text-primary dark:text-white mb-1">Aceitas</h3>
            <p className={metricValueClass}>
              {propostas.filter(p => p.status === 'AC').length}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>+8.3% vs último mês</span>
            </div>
          </div>

          {/* Rejected Proposals */}
          <div className={`${cardClass} p-3`}>
            <div className="flex items-center justify-between mb-4">
              <div className={iconContainerClass}>
                <XCircle className={iconClass} />
              </div>
              <span className={badgeClass}>Recusadas</span>
            </div>
            <h3 className="text-base font-medium text-light-text-primary dark:text-white mb-1">Recusadas</h3>
            <p className={metricValueClass}>
              {propostas.filter(p => p.status === 'RC').length}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span className={metricSubtextClass}>-2.1% vs último mês</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={`${cardClass} p-3 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-12 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 rounded-xl text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full px-4 py-2 pl-12 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 rounded-xl text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="accepted">Aceitas</option>
                  <option value="rejected">Recusadas</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Proposals Table */}
        <div className={`bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm rounded-lg p-0 overflow-hidden border border-[#E5E5E5] dark:border-gray-700/50 shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50">
              <thead>
                <tr className="bg-light-secondary dark:bg-[#0F172A]/60">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[100px]">
                    Data
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[120px]">
                    CNPJ/CPF
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[150px]">
                    Cliente
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[150px]">
                    Email
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[80px]">
                    Validade
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[100px]">
                    Valor
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[100px]">
                  Status
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[80px]">
                    Ações
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[80px]">
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
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {new Date(proposta.dt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {formatCNPJCPF(proposta.cnpjcpf)}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                        {proposta.nome}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {proposta.email}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center text-sm">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {proposta.validade} {proposta.validade === 1 ? 'Dia' : 'Dias'}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                      <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(proposta.total)}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
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
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="flex justify-center">
                        <ActionsButtons onRead={() => handleEdit(proposta.id)} />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center text-sm">
                      <SwitchFrag checked={active} onChange={handleChange} />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}