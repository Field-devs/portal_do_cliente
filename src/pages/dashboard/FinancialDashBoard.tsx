import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Search, 
  Filter,
  TrendingUp,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import CircularWait from '../../components/CircularWait';

interface Invoice {
  proposta_id: string;
  cliente_final_cliente_final_id: string | null;
  ava_ava_id: string | null;
  cliente_nome: string;
  valor: number;
  status: string;
  dt_inicio: string;
  dt_fim?: string;
}

interface FinancialMetrics {
  totalReceivables: number;
  totalOverdue: number;
  totalPaid: number;
  defaultRate: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  projected: number;
}

export default function FinancialDashBoard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalReceivables: 0,
    totalOverdue: 0,
    totalPaid: 0,
    defaultRate: 0
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'lastMonth' | 'thisYear'>('all');

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-2xl";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-full";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full";

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('v_proposta')
        .select('*')
        .order('dt', { ascending: false });

      if (proposalsError) throw proposalsError;

      const formattedInvoices = proposalsData?.map(invoice => ({
        proposta_id: invoice.proposta_id,
        cliente_final_cliente_final_id: invoice.cliente_final_id,
        ava_ava_id: invoice.ava_id,
        cliente_nome: invoice.cliente_final?.nome || invoice.ava?.nome || 'Unknown',
        valor: invoice.valor,
        status: invoice.status,
        dt_inicio: invoice.dt_inicio,
        dt_fim: invoice.dt_fim
      })) || [];

      setInvoices(formattedInvoices);

      const totalReceivables = formattedInvoices.reduce((acc, curr) => acc + curr.valor, 0);
      const totalOverdue = formattedInvoices
        .filter(inv => inv.status === 'overdue')
        .reduce((acc, curr) => acc + curr.valor, 0);
      const totalPaid = formattedInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((acc, curr) => acc + curr.valor, 0);
      const defaultRate = totalReceivables > 0 ? (totalOverdue / totalReceivables) * 100 : 0;

      setMetrics({
        totalReceivables,
        totalOverdue,
        totalPaid,
        defaultRate
      });

      const revenueByMonth = formattedInvoices.reduce((acc: Record<string, { revenue: number; projected: number }>, curr) => {
        const month = new Date(curr.dt_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { revenue: 0, projected: 0 };
        }
        if (curr.status === 'paid') {
          acc[month].revenue += curr.valor;
        } else {
          acc[month].projected += curr.valor;
        }
        return acc;
      }, {});

      const formattedRevenueData = Object.entries(revenueByMonth).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        projected: data.projected
      }));

      setRevenueData(formattedRevenueData);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.proposta_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    const matchesDate = () => {
      if (dateFilter === 'all') return true;

      const invoiceDate = new Date(invoice.dt_inicio);
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      switch (dateFilter) {
        case 'thisMonth':
          return invoiceDate >= firstDayOfMonth;
        case 'lastMonth':
          return invoiceDate >= firstDayOfLastMonth && invoiceDate < firstDayOfMonth;
        case 'thisYear':
          return invoiceDate >= firstDayOfYear;
        default:
          return true;
      }
    };

    return matchesSearch && matchesStatus && matchesDate();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Dashboard Financeiro" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Financeiro</h1>
        <button
          onClick={() => {}}
          className="btn-primary flex items-center rounded-lg"
        >
          <Download className="h-5 w-5 mr-2" />
          Exportar
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Receivables */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <DollarSign className={iconClass} />
            </div>
            <span className={badgeClass}>Total</span>
          </div>
          <h3 className={metricTitleClass}>Total a Receber</h3>
          <p className={metricValueClass}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics.totalReceivables)}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>+8.2% este mês</span>
          </div>
        </div>

        {/* Total Paid */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <CheckCircle className={iconClass} />
            </div>
            <span className={badgeClass}>Acumulado</span>
          </div>
          <h3 className={metricTitleClass}>Total Recebido</h3>
          <p className={metricValueClass}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics.totalPaid)}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>+15.3% vs último mês</span>
          </div>
        </div>

        {/* Total Overdue */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <XCircle className={iconClass} />
            </div>
            <span className={badgeClass}>Em Atraso</span>
          </div>
          <h3 className={metricTitleClass}>Total em Atraso</h3>
          <p className={metricValueClass}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics.totalOverdue)}
          </p>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>5 faturas pendentes</span>
          </div>
        </div>

        {/* Default Rate */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <CreditCard className={iconClass} />
            </div>
            <span className={badgeClass}>Taxa Atual</span>
          </div>
          <h3 className={metricTitleClass}>Taxa de Inadimplência</h3>
          <p className={metricValueClass}>
            {metrics.defaultRate.toFixed(2)}%
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>-2.1% vs último mês</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={metricTitleClass}>Receita x Projeção</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis 
                stroke="#64748B"
                tickFormatter={(value) => 
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact'
                  }).format(value)
                }
              />
              <Tooltip 
                formatter={(value: number) =>
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(value)
                }
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F1F5F9'
                }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projected" fill="#93C5FD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={`${cardClass} mt-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por empresa, email ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-full shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px] rounded-full shadow-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendentes</option>
                <option value="paid">Pagas</option>
                <option value="overdue">Em Atraso</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px] rounded-full shadow-sm"
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

      {/* Invoices Table */}
      <div className={`${cardClass} mt-6 overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50 rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-light-secondary dark:bg-[#0F172A]/60 rounded-t-2xl">
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Fatura
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Data Início
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Data Fim
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {filteredInvoices.map((invoice) => (
                <tr 
                  key={invoice.proposta_id || Math.random().toString()}
                  className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-blue-600 dark:text-blue-400">
                      #{invoice.proposta_id ? invoice.proposta_id.slice(0, 8) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-light-text-primary dark:text-white">
                      {invoice.cliente_nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(invoice.valor)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
                      invoice.status === 'paid'
                        ? 'badge-success'
                        : invoice.status === 'pending'
                        ? 'badge-warning'
                        : 'badge-error'
                    }`}>
                      {invoice.status === 'paid' ? 'Paga' :
                       invoice.status === 'pending' ? 'Pendente' :
                       'Em Atraso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {new Date(invoice.dt_inicio).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {invoice.dt_fim ? new Date(invoice.dt_fim).toLocaleDateString('pt-BR') : '-'}
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