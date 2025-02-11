import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Search, 
  Filter,
  FileText,
  AlertCircle,
  TrendingUp,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  BarChart2,
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

export default function FinancialControl() {
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

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Fetch proposals with user data for both client types
      
      const { data, error } = await supabase
        .from('proposta_outr')
        .select(`
          proposta_id,
          cliente_final_id,
          ava_id,
          valor,
          status,
          dt_inicio,
          dt_fim,
          cliente_final:cliente_final_id (nome),
          ava:ava_id (nome)
        `);


      if (proposalsError) throw proposalsError;

      const formattedInvoices = proposalsData?.map(invoice => ({
        proposta_id: invoice.proposta_id,
        cliente_final_cliente_final_id: invoice.cliente_final_cliente_final_id,
        ava_ava_id: invoice.ava_ava_id,
        cliente_nome: invoice.cliente_final?.nome || invoice.ava?.nome || 'Unknown',
        valor: invoice.valor,
        status: invoice.status,
        dt_inicio: invoice.dt_inicio,
        dt_fim: invoice.dt_fim
      })) || [];

      setInvoices(formattedInvoices);

      // Calculate metrics for both client types combined
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

      // Generate revenue data combining both client types
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Receivables */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total a Receber</h3>
            <DollarSign className="h-6 w-6 text-brand dark:text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics.totalReceivables)}
          </p>
        </div>

        {/* Total Paid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Recebido</h3>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics.totalPaid)}
          </p>
        </div>

        {/* Total Overdue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total em Atraso</h3>
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-500">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics.totalOverdue)}
          </p>
        </div>

        {/* Default Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Taxa de Inadimplência</h3>
            <TrendingUp className="h-6 w-6 text-brand dark:text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {metrics.defaultRate.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receita x Projeção</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
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
              />
              <Bar dataKey="revenue" name="Receita" fill="#07152E" />
              <Bar dataKey="projected" name="Projeção" fill="#4B5563" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Faturas</h2>
          <button className="flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Exportar
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente ou número da fatura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid' | 'overdue')}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="paid">Pagas</option>
                  <option value="overdue">Em Atraso</option>
                </select>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | 'thisMonth' | 'lastMonth' | 'thisYear')}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data Início
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data Fim
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.proposta_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand dark:text-blue-400">
                        #{invoice.proposta_id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {invoice.cliente_nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(invoice.valor)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(invoice.status)}`}>
                        {invoice.status === 'paid' && 'Paga'}
                        {invoice.status === 'pending' && 'Pendente'}
                        {invoice.status === 'overdue' && 'Em Atraso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invoice.dt_inicio).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {invoice.dt_fim ? new Date(invoice.dt_fim).toLocaleDateString('pt-BR') : '-'}
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