import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Inbox,
  Users,
  Bot,
  DollarSign,
  TrendingUp,
  BarChart2,
  LineChart as LineChartIcon,
  Package
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import CircularWait from '../../components/CircularWait';
import { formatCurrency } from '../../utils/formatters';
import '../../Styles/animations.css';

interface ConsumptionData {
  date: string;
  inboxes: number;
  agents: number;
  automations: number;
  addons: number;
}

interface ResourceMetrics {
  inboxes: { count: number; cost: number };
  agents: { count: number; cost: number };
  automations: { count: number; cost: number };
  addons: { count: number; cost: number };
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'quantity' | 'cost'>('quantity');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    inboxes: { count: 0, cost: 0 },
    agents: { count: 0, cost: 0 },
    automations: { count: 0, cost: 0 },
    addons: { count: 0, cost: 0 }
  });

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-lg";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg";

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch consumption data from Supabase
      const { data: consumptionData, error: consumptionError } = await supabase
        .from('v_consumo')
        .select('*')
        .eq('user_id', user?.id)
        .order('dt', { ascending: true });

      if (consumptionError) throw consumptionError;

      // Transform the data
      const transformedData = consumptionData?.map(item => ({
        date: new Date(item.dt).toLocaleDateString('pt-BR'),
        inboxes: item.caixas_entrada,
        agents: item.atendentes,
        automations: item.automacoes,
        addons: item.addons
      })) || [];

      setConsumptionData(transformedData);

      // Calculate current metrics
      const currentMetrics: ResourceMetrics = {
        inboxes: { count: 0, cost: 0 },
        agents: { count: 0, cost: 0 },
        automations: { count: 0, cost: 0 },
        addons: { count: 0, cost: 0 }
      };

      // Use the latest data point for current metrics
      if (transformedData.length > 0) {
        const latest = transformedData[transformedData.length - 1];
        currentMetrics.inboxes = { count: latest.inboxes, cost: latest.inboxes * 50 };
        currentMetrics.agents = { count: latest.agents, cost: latest.agents * 30 };
        currentMetrics.automations = { count: latest.automations, cost: latest.automations * 20 };
        currentMetrics.addons = { count: latest.addons, cost: latest.addons * 40 };
      }

      setMetrics(currentMetrics);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Dashboard" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
              {entry.name}: {viewMode === 'cost' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`${titleClass} title-fade-in`}>Meu Dashboard</h1>
        <div className="flex space-x-4">
          <div className="flex rounded-lg overflow-hidden border border-light-border dark:border-gray-700/50">
            <button
              onClick={() => setViewMode('quantity')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'quantity'
                  ? 'bg-brand text-white'
                  : 'bg-light-secondary dark:bg-[#1E293B]/60 text-gray-700 dark:text-gray-300'
              }`}
            >
              Quantidade
            </button>
            <button
              onClick={() => setViewMode('cost')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'cost'
                  ? 'bg-brand text-white'
                  : 'bg-light-secondary dark:bg-[#1E293B]/60 text-gray-700 dark:text-gray-300'
              }`}
            >
              Custo
            </button>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-light-border dark:border-gray-700/50">
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
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 text-sm font-medium ${
                chartType === 'line'
                  ? 'bg-brand text-white'
                  : 'bg-light-secondary dark:bg-[#1E293B]/60 text-gray-700 dark:text-gray-300'
              }`}
            >
              <LineChartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
        {/* Inboxes */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Inbox className={iconClass} />
            </div>
            <span className={badgeClass}>{viewMode === 'quantity' ? 'Quantidade' : 'Custo'}</span>
          </div>
          <h3 className={metricTitleClass}>Caixas de Entrada</h3>
          <p className={metricValueClass}>
            {viewMode === 'quantity' 
              ? metrics.inboxes.count
              : formatCurrency(metrics.inboxes.cost)
            }
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Consumo atual</span>
          </div>
        </div>

        {/* Agents */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Users className={iconClass} />
            </div>
            <span className={badgeClass}>{viewMode === 'quantity' ? 'Quantidade' : 'Custo'}</span>
          </div>
          <h3 className={metricTitleClass}>Atendentes</h3>
          <p className={metricValueClass}>
            {viewMode === 'quantity'
              ? metrics.agents.count
              : formatCurrency(metrics.agents.cost)
            }
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Consumo atual</span>
          </div>
        </div>

        {/* Automations */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Bot className={iconClass} />
            </div>
            <span className={badgeClass}>{viewMode === 'quantity' ? 'Quantidade' : 'Custo'}</span>
          </div>
          <h3 className={metricTitleClass}>Automações</h3>
          <p className={metricValueClass}>
            {viewMode === 'quantity'
              ? metrics.automations.count
              : formatCurrency(metrics.automations.cost)
            }
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Consumo atual</span>
          </div>
        </div>

        {/* Add-ons */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Package className={iconClass} />
            </div>
            <span className={badgeClass}>{viewMode === 'quantity' ? 'Quantidade' : 'Custo'}</span>
          </div>
          <h3 className={metricTitleClass}>Add-ons</h3>
          <p className={metricValueClass}>
            {viewMode === 'quantity'
              ? metrics.addons.count
              : formatCurrency(metrics.addons.cost)
            }
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Consumo atual</span>
          </div>
        </div>
      </div>

      {/* Consumption Chart */}
      <div className={`${cardClass} h-[500px] fade-in`}>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className={metricTitleClass}>
              {viewMode === 'quantity' ? 'Consumo por Recurso' : 'Custos por Recurso'}
            </h3>
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-light-secondary dark:bg-[#0F172A]/60 rounded-lg flex">
                {['Caixas de Entrada', 'Atendentes', 'Automações', 'Add-ons'].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center px-3 py-1.5 rounded-md transition-colors hover:bg-white/10 cursor-pointer"
                    title={item}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                    <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.1} />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis
                stroke="#64748B"
                tickFormatter={(value) =>
                  viewMode === 'cost'
                    ? formatCurrency(value)
                    : value.toString()
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Bar
                dataKey="inboxes"
                name="Caixas de Entrada"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="agents"
                name="Atendentes"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="automations"
                name="Automações"
                fill="#F59E0B"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="addons"
                name="Add-ons"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          ) : (
            <LineChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.1} />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis
                stroke="#64748B"
                tickFormatter={(value) =>
                  viewMode === 'cost'
                    ? formatCurrency(value)
                    : value.toString()
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="inboxes"
                name="Caixas de Entrada"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="agents"
                name="Atendentes"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="automations"
                name="Automações"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="addons"
                name="Add-ons"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}