import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Users, 
  FileText, 
  DollarSign,
  TrendingUp,
  UserPlus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  UserCheck
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

interface DashboardMetrics {
  proposals: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  clients: {
    cf: number;
    ava: number;
  };
  monthlyRevenue: number;
  activeAffiliates: number;
}

interface RevenueData {
  date: string;
  value: number;
}

interface ClientAcquisitionData {
  month: string;
  cf: number;
  ava: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    proposals: { total: 0, pending: 0, accepted: 0, rejected: 0 },
    clients: { cf: 0, ava: 0 },
    monthlyRevenue: 0,
    activeAffiliates: 0
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [acquisitionData, setAcquisitionData] = useState<ClientAcquisitionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch proposals metrics
      const { data: proposalsData } = await supabase
        .from('proposta_outr')
        .select('status');

      const proposals = proposalsData?.reduce((acc, curr) => {
        acc.total++;
        if (curr.status === 'pending') acc.pending++;
        else if (curr.status === 'accepted') acc.accepted++;
        else if (curr.status === 'rejected') acc.rejected++;
        return acc;
      }, { total: 0, pending: 0, accepted: 0, rejected: 0 }) || {
        total: 0, pending: 0, accepted: 0, rejected: 0
      };

      // Fetch clients metrics
      const { data: clientsData } = await supabase
        .from('pessoas')
        .select('cargo_id')
        .eq('status', true);

      const clients = clientsData?.reduce((acc, curr) => {
        if (curr.cargo_id === 5) acc.cf++;
        else if (curr.cargo_id === 4) acc.ava++;
        return acc;
      }, { cf: 0, ava: 0 }) || { cf: 0, ava: 0 };

      // Fetch monthly revenue
      const { data: revenueData } = await supabase
        .from('proposta_outr')
        .select('valor')
        .eq('status', true);

      const monthlyRevenue = revenueData?.reduce((acc, curr) => acc + curr.valor, 0) || 0;

      // Fetch active affiliates
      const { count: activeAffiliates } = await supabase
        .from('pessoas')
        .select('*', { count: 'exact' })
        .eq('cargo_id', 6)
        .eq('status', true);

      setMetrics({
        proposals,
        clients,
        monthlyRevenue,
        activeAffiliates: activeAffiliates || 0
      });

      // Fetch revenue timeline data
      const { data: timelineData } = await supabase
        .from('proposta_outr')
        .select('dt_inicio, valor')
        .eq('status', true)
        .order('dt_inicio', { ascending: true });

      if (timelineData) {
        const aggregatedData = timelineData.reduce((acc: RevenueData[], curr) => {
          const date = new Date(curr.dt_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
          const existingEntry = acc.find(item => item.date === date);
          if (existingEntry) {
            existingEntry.value += curr.valor;
          } else {
            acc.push({ date, value: curr.valor });
          }
          return acc;
        }, []);
        setRevenueData(aggregatedData);
      }

      // Fetch client acquisition data
      const { data: acquisitionTimelineData } = await supabase
        .from('pessoas')
        .select('dt_criacao, cargo_id')
        .in('cargo_id', [4, 5])
        .order('dt_criacao', { ascending: true });

      if (acquisitionTimelineData) {
        const aggregatedAcquisitionData = acquisitionTimelineData.reduce((acc: ClientAcquisitionData[], curr) => {
          const month = new Date(curr.dt_criacao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
          const existingEntry = acc.find(item => item.month === month);
          if (existingEntry) {
            if (curr.cargo_id === 5) existingEntry.cf++;
            else if (curr.cargo_id === 4) existingEntry.ava++;
          } else {
            acc.push({
              month,
              cf: curr.cargo_id === 5 ? 1 : 0,
              ava: curr.cargo_id === 4 ? 1 : 0
            });
          }
          return acc;
        }, []);
        setAcquisitionData(aggregatedAcquisitionData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Proposals Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Propostas</h3>
            <FileText className="h-6 w-6 text-brand dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.proposals.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-500">{metrics.proposals.pending}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aceitas</p>
              <p className="text-2xl font-bold text-green-500">{metrics.proposals.accepted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recusadas</p>
              <p className="text-2xl font-bold text-red-500">{metrics.proposals.rejected}</p>
            </div>
          </div>
        </div>

        {/* Active Clients Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Clientes Ativos</h3>
            <Users className="h-6 w-6 text-brand dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">CFs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.clients.cf}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">AVAs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.clients.ava}</p>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Faturamento Mensal</h3>
            <DollarSign className="h-6 w-6 text-brand dark:text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(metrics.monthlyRevenue)}
          </p>
        </div>

        {/* Active Affiliates Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Afiliados Ativos</h3>
            <UserCheck className="h-6 w-6 text-brand dark:text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.activeAffiliates}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Timeline Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receita Acumulada</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#07152E"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Acquisition Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aquisição de Clientes</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={acquisitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cf" name="CFs" fill="#07152E" />
                <Bar dataKey="ava" name="AVAs" fill="#4B5563" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}