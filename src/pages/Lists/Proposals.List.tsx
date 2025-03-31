import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Link,
  CreditCard,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePlanos } from '../../hooks/usePlanos';
import { ModalForm } from '../../components/Modal/Modal';
import SearchFilter from '../../components/SearchFilter';
import { formatPhone } from '../../utils/formatters';
import ProposalForm from '../Forms/Proposal/New/Proposal.Form';
import ActionsButtons from '../../components/ActionsData';
import { UpdateSingleField } from '../../utils/supageneric';
import { useAuth } from '../../components/AuthProvider';
import { AlertDialog, ErrorDialog } from '../../components/Dialogs/Dialogs';
import { AUTO_REFRESH, AUTO_REFRESH_SECOUNDS, ProposalStatus } from '../../utils/consts';
import CircularWait from '../../components/CircularWait';
import '../../Styles/animations.css';

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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  

  const { loading: planosLoading } = usePlanos();

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 border border-light-border dark:border-gray-700/50 rounded-lg";
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
      const intervalId = setInterval(fetchData, AUTO_REFRESH_SECOUNDS); // 60000 milliseconds = 1 minute
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
        proposta.emp_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposta.emp_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proposta.emp_fone && proposta.emp_fone.toString().includes(searchTerm)) ||
        formatPhone(proposta.emp_fone?.toString()).includes(searchTerm)
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

  const handleStatusChange = async (id: string, status: string) => {
    let response = await UpdateSingleField("proposta", "id", id, "status", status);
    return response;
  };

  const handleCopyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
          <h1 className={`${titleClass} title-fade-in`}>Propostas</h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
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
          <SearchFilter
            searchPlaceholder="Buscar por empresa, email ou telefone..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filterOptions={[
              { value: 'all', label: 'Todos os Status' },
              { value: 'pending', label: 'Pendentes' },
              { value: 'accepted', label: 'Aceitas' },
              { value: 'rejected', label: 'Recusadas' }
            ]}
            filterValue={statusFilter}
            onFilterChange={(value) => setStatusFilter(value as typeof statusFilter)}
          />
        </div>

        {/* Proposals Table */}
        <div className={`${cardClass} mt-6 overflow-hidden fade-in`}>
          <div className="relative">
            <div id="scroll-indicator" className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-l from-gray-100/80 dark:from-gray-800/80 to-transparent pointer-events-none flex items-center justify-end pr-2 transition-opacity duration-300 ease-in-out z-10">
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 animate-pulse" />
            </div>
            <div className="overflow-x-auto" onScroll={(e) => {
              const target = e.currentTarget;
              const indicator = target.previousElementSibling as HTMLElement;
              if (indicator) {
                if (target.scrollWidth > target.clientWidth) {
                  const scrollPercentage = (target.scrollLeft + target.clientWidth) / target.scrollWidth;
                  indicator.style.opacity = scrollPercentage >= 0.95 ? '0' : '1';
                } else {
                  indicator.style.opacity = '0';
                }
              }
            }} ref={(el) => {
              if (el) {
                const indicator = el.previousElementSibling as HTMLElement;
                if (indicator) {
                  const hasScroll = el.scrollWidth > el.clientWidth;
                  indicator.style.opacity = hasScroll ? '1' : '0';
                }
              }
            }}>
            <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50 rounded-lg overflow-hidden">
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
                  <th className="px-4 py-2 text-right text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
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
                        <button
                          onClick={() => handleCopyToClipboard(proposta.emp_email, `email-${proposta.id}`)}
                          className="relative group flex items-center hover:text-brand dark:hover:text-brand-400 transition-colors"
                          title="Clique para copiar"
                        >
                          <Mail className="h-5 w-5 mr-2" />
                          {copiedField === `email-${proposta.id}` ? (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded shadow-lg whitespace-nowrap border border-green-200 dark:border-green-800/30">
                              Copiado!
                            </span>
                          ) : (
                            <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                              {proposta.emp_email}
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        <button
                          onClick={() => handleCopyToClipboard(formatPhone(proposta.emp_fone?.toString()), `phone-${proposta.id}`)}
                          className="relative group flex items-center hover:text-brand dark:hover:text-brand-400 transition-colors"
                          title="Clique para copiar"
                        >
                          <Phone className="h-5 w-5 mr-2" />
                          {copiedField === `phone-${proposta.id}` ? (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded shadow-lg whitespace-nowrap border border-green-200 dark:border-green-800/30">
                              Copiado!
                            </span>
                          ) : (
                            <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                              {formatPhone(proposta.emp_fone?.toString())}
                            </span>
                          )}
                        </button>
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
                        {proposta.status === ProposalStatus.APPROVED || proposta.status === ProposalStatus.PENDING ? (
                          <span className={`px-3 py-1 text-sm font-medium rounded-full w-24 text-center ${
                            proposta.status === ProposalStatus.APPROVED 
                              ? 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30'
                              : 'bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30'
                          }`}>
                            {proposta.status_title}
                          </span>
                        ) : (
                          <select
                            value={proposta.status}
                            onChange={(e) => handleStatusChange(proposta.id, e.target.value)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg w-44 transition-all duration-300 ${
                              proposta.status === ProposalStatus.ACCEPT
                                ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                                : proposta.status === ProposalStatus.REJECTED
                                ? 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                                : 'bg-gray-50 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30'
                            } hover:bg-opacity-90 dark:hover:bg-opacity-30 cursor-pointer appearance-none`}
                            style={{
                              textAlign: 'left',
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.75rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.25em 1.25em',
                              paddingRight: '2.5rem'
                            }}
                          >
                            <option value={ProposalStatus.ACCEPT} className="py-2 px-3">PGTO. PENDENTE</option>
                            <option value={ProposalStatus.APPROVED} className="py-2 px-3">PAGO</option>
                            <option value={ProposalStatus.REJECTED} className="py-2 px-3">CANCELADO</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex justify-center space-x-2">
                        {proposta.status === ProposalStatus.PENDING && proposta.active && (
                          <a href={`/confirmation/${proposta.id}`} target='blank' title="Link de Confirmação" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </a>
                        )}

                        {proposta.status === ProposalStatus.ACCEPT && proposta.active  && proposta.cob_pay_link && (
                          <a href={`${proposta.cob_pay_link}`} target='blank' title="Link de Pagamento" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <ActionsButtons
                        className="flex justify-end"
                        onEdit={proposta.status === ProposalStatus.APPROVED ? undefined : () => { handleEdit(proposta.id) }}
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
      </div>
    </>
  );
}