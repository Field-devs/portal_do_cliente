import { useState, useEffect } from 'react';
import Proposta from '../../Models/Propostas';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Link,
  CreditCard,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePlanos } from '../../hooks/usePlanos';
import { ModalForm } from '../../components/Modal/Modal';
import ProposalForm from '../Forms/Proposal/New/Proposal.Form';
import ActionsButtons from '../../components/ActionsData';
import { UpdateSingleField } from '../../utils/supageneric';
import { useAuth } from '../../components/AuthProvider';
import { AlertDialog, ErrorDialog } from '../../components/Dialogs/Dialogs';
import CircularWait from '../../components/CircularWait';
import { formatPhone } from '../../utils/formatters';
import { AUTO_REFRESH, ProposalStatus } from '../../utils/consts';

export default function ProposalsList() {
  const { user } = useAuth();

  const [propid, setPropId] = useState<string | null>(null);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [planscount, setPlanscount] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [dateFilter, setDateFilter] = useState<'year' | 'month' | '15days' | 'day' | 'custom'>('year');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [OpenProposal, setOpenProposal] = useState(false);
  const [active, SetActive] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { loading: planosLoading } = usePlanos();

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-lg";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg";

  useEffect(() => {
    fetchData();
    if (AUTO_REFRESH) {
      const intervalId = setInterval(fetchData, 60000); // 60000 milliseconds = 1 minute
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, []);

  const fetchData = async () => {
    try {
      // Retorna com as Propostas
      const { data, error } = await supabase
        .from('v_proposta')
        .select('*')
        .eq('user_id', user?.id)
        .order('dt', { ascending: false });

      if (error) throw error;
      setPropostas(data || []);

      // Retorna com os Planos
      const { data: planData, error: planosError } =
        await supabase.from('plano').select('*').eq("user_id", user?.id);
      if (planosError) throw planosError;
      setPlanscount(planData.length);

    } catch (error) {
      ErrorDialog("Erro ao carregar propostas", "Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = propostas.filter((proposta) =>
        proposta.emp_nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPropostas(filtered);
    } else {
      fetchData();
    }
  }, [searchTerm]);

  useEffect(() => {
    const filtered = propostas.filter((proposta) => {
      if (statusFilter === 'all') return true;
      return proposta.status === statusFilter;
    });
    setPropostas(filtered);
  }, [statusFilter]);


  const HandleOpenProposal = () => {
    if (planscount === 0) {
      AlertDialog("Não há planos cadastrados. Por favor, cadastre um plano antes de abrir uma proposta.");
      return;
    }
    setOpenProposal(true);
  };

  const handleOnLock = async (id: string, status: boolean) => {
    let response = await UpdateSingleField("proposta", "id", id, "active", !status);
    return response;
  };


  const handleEdit = (row: string) => {
    setPropId(row);
    HandleOpenProposal();
  };

  const filteredProposals = propostas.filter((proposta) => {
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const fifteenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15);
    const oneDayAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const propostaDate = new Date(proposta.dt);

    switch (dateFilter) {
      case 'year':
        return propostaDate >= oneYearAgo;
      case 'month':
        return propostaDate >= oneMonthAgo;
      case '15days':
        return propostaDate >= fifteenDaysAgo;
      case 'day':
        return propostaDate >= oneDayAgo;
      case 'custom':
        const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
        const endDate = customDateRange.end ? new Date(customDateRange.end) : null;
        if (startDate && endDate) {
          return propostaDate >= startDate && propostaDate <= endDate;
        }
        return true;
      default:
        return true;
    }
  });

  if (loading || planosLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Propostas" />
      </div>
    );
  }

  return (
    <>
      <ModalForm
        isOpen={OpenProposal}
        onClose={() => { setPropId(null), setOpenProposal(false) }}
        maxWidth='2xl'
      >
        <ProposalForm
          id={propid}
          onCancel={() => setOpenProposal(false)}
        />
      </ModalForm>

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className={titleClass}>Propostas</h1>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => HandleOpenProposal()}
              className="btn-primary flex items-center rounded-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Proposta
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn-primary flex items-center px-3"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-[#1E293B]/90 border border-light-border dark:border-gray-700/50 backdrop-blur-sm z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {/* handle action 1 */ }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors first:rounded-t-lg"
                    >
                      Exportar Propostas
                    </button>
                    <button
                      onClick={() => {/* handle action 2 */ }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                    >
                      Filtros Avançados
                    </button>
                    <button
                      onClick={() => {/* handle action 3 */ }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors last:rounded-b-lg"
                    >
                      Configurações
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Proposals */}
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

          {/* Pending Proposals */}
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

          {/* Accepted Proposals */}
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

          {/* Rejected Proposals */}
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

        {/* Search and Filter Bar */}
        <div className={cardClass}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por empresa, email ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px] rounded-lg shadow-sm"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="accepted">Aceitas</option>
                  <option value="rejected">Recusadas</option>
                </select>
              </div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                  className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px] rounded-lg shadow-sm"
                >
                  <option value="year">Último Ano</option>
                  <option value="month">Último Mês</option>
                  <option value="15days">Últimos 15 Dias</option>
                  <option value="day">Último Dia</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              {dateFilter === 'custom' && (
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="pl-4 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm"
                  />
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="pl-4 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Proposals Table */}
        <div className={`${cardClass} mt-6 overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-light-border dark:divide-gray-700/50 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-light-secondary dark:bg-[#0F172A]/60 rounded-t-lg">
                  <th className="px-6 py-2 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Fone
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Validade
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
                {filteredProposals.map((proposta) => (
                  <tr
                    key={proposta.id}
                    className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {new Date(proposta.dt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {proposta.f_pefil_nome}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                        {proposta.emp_nome}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {proposta.emp_email}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {formatPhone(proposta.emp_fone)}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {proposta.validade} {proposta.validade === 1 ? 'Dia' : 'Dias'}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(proposta.total)}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full min-w-[6rem] text-center ${proposta.status === ProposalStatus.PENDING
                          ? 'badge-warning'
                          : proposta.status === ProposalStatus.APPROVED_ACCEPT
                            ? 'badge-success'
                            : 'badge-error'
                          }`}>
                          {proposta.status_title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex justify-center space-x-2">
                        {proposta.status === ProposalStatus.PENDING && proposta.active && (
                          <a href={`/confirmation/${proposta.id}`} target='blank' title="Link de Confirmação">
                            <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </a>
                        )}

                        {proposta.status === ProposalStatus.APPROVED_ACCEPT && proposta.active && (
                          <a href={`${proposta.cob_pay_link}`} target='blank' title="Link de Pagamento">
                            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <ActionsButtons
                      // onEdit={proposta.status === ProposalStatus.APPROVED_ACCEPT ? undefined : () => { handleEdit(proposta.id) }}
                      onEdit={() => { handleEdit(proposta.id) }}
                      onLocker={() => handleOnLock(proposta.id, proposta.active)}
                      active={proposta.active}
                      />
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