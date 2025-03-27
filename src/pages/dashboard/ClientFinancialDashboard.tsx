import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  AlertCircle,
  Download,
  RefreshCw,
  CreditCard,
  PieChart,
  BarChart2,
  ExternalLink,
  Clock
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import CircularWait from '../../components/CircularWait';
import { formatCurrency } from '../../utils/formatters';

interface Invoice {
  id: string;
  valor: number;
  vencimento: string;
  status: string;
  boleto_url?: string;
  pay_url?: string;
}

interface Addon {
  id: string;
  nome: string;
  valor: number;
  quantidade: number;
}

interface FinancialData {
  plano_nome: string;
  plano_valor: number;
  addons: Addon[];
  total_addons: number;
  total_geral: number;
  vencimento: string;
}

export default function ClientFinancialDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-lg";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg";

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

  useEffect(() => {
    fetchData();
    // Set up auto-refresh every 24 hours
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch financial data from Supabase
      const { data: financialData, error: financialError } = await supabase
        .from('v_contrato_financeiro')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (financialError) throw financialError;

      // Fetch invoices from Asaas API
      const response = await fetch(`/api/invoices?userId=${user?.id}`);
      const invoicesData = await response.json();

      setFinancialData(financialData);
      setInvoices(invoicesData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const totalPending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.valor, 0);

  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.valor, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-success">Pago</span>;
      case 'pending':
        return <span className="badge badge-warning">Pendente</span>;
      case 'overdue':
        return <span className="badge badge-error">Vencido</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  const chartData = financialData ? [
    { name: 'Plano Base', value: financialData.plano_valor },
    ...financialData.addons.map(addon => ({
      name: addon.nome,
      value: addon.valor * addon.quantidade
    }))
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Financeiro" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Financeiro</h1>
        <div className="flex space-x-4">
          <button
            onClick={fetchData}
            className={`btn-secondary flex items-center rounded-lg ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={refreshing}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <div className="flex rounded-lg overflow-hidden border border-light-border dark:border-gray-700/50">
            <button
              onClick={() => setChartType('pie')}
              className={`px-4 py-2 text-sm font-medium ${
                chartType === 'pie'
                  ? 'bg-brand text-white'
                  : 'bg-light-secondary dark:bg-[#1E293B]/60 text-gray-700 dark:text-gray-300'
              }`}
            >
              <PieChart className="h-5 w-5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 text-sm font-medium ${
                chartType === 'bar'
                  ? 'bg-brand text-white'
                  : 'bg-light-secondary dark:bg-[#1E293B]/60 text-gray-700 dark:text-gray-300'
              }`}
            >
              <BarChart2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Pending */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <DollarSign className={iconClass} />
            </div>
            <span className={badgeClass}>Total a Pagar</span>
          </div>
          <h3 className={metricTitleClass}>Faturas Pendentes</h3>
          <p className={metricValueClass}>{formatCurrency(totalPending)}</p>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>
              {invoices.filter(inv => inv.status === 'pending').length} faturas aguardando pagamento
            </span>
          </div>
        </div>

        {/* Total Overdue */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <AlertCircle className={iconClass} />
            </div>
            <span className={badgeClass}>Em Atraso</span>
          </div>
          <h3 className={metricTitleClass}>Faturas Vencidas</h3>
          <p className={metricValueClass}>{formatCurrency(totalOverdue)}</p>
          <div className="flex items-center mt-2">
            <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
            <span className="text-sm text-red-500">
              {invoices.filter(inv => inv.status === 'overdue').length} faturas em atraso
            </span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      <div className={`${cardClass} mb-8`}>
        <h3 className={metricTitleClass}>Composição dos Custos</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F1F5F9'
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Invoices Table */}
      <div className={cardClass}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={metricTitleClass}>Faturas</h3>
          {lastUpdate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Última atualização: {lastUpdate.toLocaleString()}
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50">
            <thead>
              <tr className="bg-light-secondary dark:bg-[#0F172A]/60">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(invoice.vencimento).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(invoice.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      {invoice.boleto_url && (
                        <a
                          href={invoice.boleto_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:text-brand/80"
                          title="Download do Boleto"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                      )}
                      {invoice.pay_url && invoice.status !== 'paid' && (
                        <a
                          href={invoice.pay_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:text-brand/80"
                          title="Pagar Agora"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
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