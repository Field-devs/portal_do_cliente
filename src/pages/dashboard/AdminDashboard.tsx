import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  UserPlus,
  Building,
  UserCheck
} from 'lucide-react';
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
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { da } from 'date-fns/locale';
import CircularWait from '../../components/CircularWait';

const revenueData = [
  { month: 'Jan', revenue: 12000, projected: 15000 },
  { month: 'Fev', revenue: 19000, projected: 22000 },
  { month: 'Mar', revenue: 25000, projected: 28000 },
  { month: 'Abr', revenue: 32000, projected: 35000 },
  { month: 'Mai', revenue: 40000, projected: 42000 },
  { month: 'Jun', revenue: 45000, projected: 48000 },
];
const acquisitionData = [
  { month: 'Jan', cf: 5, ava: 2 },
  { month: 'Fev', cf: 8, ava: 3 },
  { month: 'Mar', cf: 12, ava: 5 },
  { month: 'Abr', cf: 15, ava: 7 },
  { month: 'Mai', cf: 20, ava: 10 },
  { month: 'Jun', cf: 25, ava: 12 },
];

interface IDashboardData {
  totalProp: number;
  totalPropPerc: number;

  activeCli: number;
  activeCliNews: number;

  totalCashMonth: number;
  totalCashMonthLastMonth: number;

  activeParc: number;
  activeParcNew: number;
  receitaProjecao: JSON[] | any;
}


export default function AdminDashboard() {
  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-light-border dark:border-gray-700/50";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-xl";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full";

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase
      .rpc('fn_dashboard').single();
    if (error) {
      console.error("Error fetching data:", error);
    }
    if (data) {
      setUserData(data);
    }
    setLoading(false);
  }

  let DashboardData: IDashboardData = {
    totalProp: userData?.r_total_prop || 0,
    totalPropPerc: userData?.r_total_prop_perc || 0,

    activeCli: userData?.r_active_cli || 0,
    activeCliNews: userData?.r_active_cli_news || 0,

    totalCashMonth: userData?.r_total_cash_month || 0,
    totalCashMonthLastMonth: userData?.r_total_cash_month_last_month || 0,

    activeParc: userData?.r_active_parc || 0,
    activeParcNew: userData?.r_active_parc_new || 0,


    receitaProjecao: userData?.r_receita_projecao,
    //    receitaProjecao : userData ? JSON.parse(userData.receitaProjecao) : [],
  }


  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="DashBoard Financeiro" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Dashboard</h1>
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
          <p className={metricValueClass}>{DashboardData.totalProp}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>+{DashboardData.totalPropPerc}% este mês</span>
          </div>
        </div>

        {/* Active Clients */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Users className={iconClass} />
            </div>
            <span className={badgeClass}>Total Atual</span>
          </div>
          <h3 className={metricTitleClass}>Clientes Ativos</h3>
          <p className={metricValueClass}>{DashboardData.activeCli}</p>
          <div className="flex items-center mt-2">
            <UserPlus className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>+{DashboardData.activeCliNews} novos este mês</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <DollarSign className={iconClass} />
            </div>
            <span className={badgeClass}>Este Mês</span>
          </div>
          <h3 className={metricTitleClass}>Receita Mensal</h3>
          <p className={metricValueClass}>R$ {DashboardData.totalCashMonth}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>+{DashboardData.totalCashMonthLastMonth}% vs último mês</span>
          </div>
        </div>

        {/* Active Partners */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Building className={iconClass} />
            </div>
            <span className={badgeClass}>Total Atual</span>
          </div>
          <h3 className={metricTitleClass}>Parceiros Ativos</h3>
          <p className={metricValueClass}>{DashboardData.activeParc}</p>
          <div className="flex items-center mt-2">
            <UserCheck className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>+{DashboardData.activeParcNew} novos este mês</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={metricTitleClass}>Receita x Projeção</h3>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm text-light-text-secondary dark:text-gray-300">Realizado</span>
              <span className="w-3 h-3 rounded-full bg-blue-200"></span>
              <span className="text-sm text-light-text-secondary dark:text-gray-300">Projetado</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DashboardData.receitaProjecao}>
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
                <Bar dataKey="revenue" name="Receita" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projected" name="Projeção" fill="#93C5FD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Acquisition Chart */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={metricTitleClass}>Aquisição de Clientes</h3>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-sm text-light-text-secondary dark:text-gray-300">CFs</span>
              <span className="w-3 h-3 rounded-full bg-blue-300"></span>
              <span className="text-sm text-light-text-secondary dark:text-gray-300">AVAs</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={acquisitionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F1F5F9'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cf"
                  name="CFs"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#2563EB" }}
                />
                <Line
                  type="monotone"
                  dataKey="ava"
                  name="AVAs"
                  stroke="#93C5FD"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#93C5FD" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}