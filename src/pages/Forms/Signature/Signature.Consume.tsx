import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import {
  Calendar,
  Download,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CircularWait from '../../../components/CircularWait';

// Mock data generator
const generateMockData = (startDate: Date) => {
  const days = eachDayOfInterval({
    start: startOfMonth(startDate),
    end: endOfMonth(startDate)
  });

  return days.map(day => ({
    date: day,
    consumption: Math.floor(Math.random() * 100) + 50,
    average: 75,
    previousMonth: Math.floor(Math.random() * 100) + 40
  }));
};

export default function SignatureConsume() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [zoomDomain, setZoomDomain] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('daily');
  const [comparePrevious, setComparePrevious] = useState(false);

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
  }, [selectedPeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const date = selectedPeriod === 'current' ? new Date() : subMonths(new Date(), 1);
      const mockData = generateMockData(date);
      setData(mockData);
    } catch (error) {
      console.error('Error fetching consumption data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!zoomDomain) {
      const midPoint = Math.floor(data.length / 2);
      const range = direction === 'in' ? 5 : data.length;
      setZoomDomain({
        start: Math.max(0, midPoint - range),
        end: Math.min(data.length - 1, midPoint + range)
      });
    } else {
      if (direction === 'in') {
        const range = Math.floor((zoomDomain.end - zoomDomain.start) / 2);
        const midPoint = Math.floor((zoomDomain.end + zoomDomain.start) / 2);
        setZoomDomain({
          start: Math.max(0, midPoint - range),
          end: Math.min(data.length - 1, midPoint + range)
        });
      } else {
        const range = (zoomDomain.end - zoomDomain.start) * 2;
        const midPoint = Math.floor((zoomDomain.end + zoomDomain.start) / 2);
        setZoomDomain({
          start: Math.max(0, midPoint - range),
          end: Math.min(data.length - 1, midPoint + range)
        });
      }
    }
  };

  const resetZoom = () => setZoomDomain(null);

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Data,Consumo,Média,Mês Anterior\n"
      + data.map(row => {
          return `${format(row.date, 'dd/MM/yyyy')},${row.consumption},${row.average},${row.previousMonth}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `consumo-${format(new Date(), 'MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateMetrics = () => {
    const currentConsumption = data.reduce((sum, day) => sum + day.consumption, 0);
    const previousConsumption = data.reduce((sum, day) => sum + day.previousMonth, 0);
    const percentageChange = ((currentConsumption - previousConsumption) / previousConsumption) * 100;

    return {
      total: currentConsumption,
      average: currentConsumption / data.length,
      percentageChange,
      peak: Math.max(...data.map(day => day.consumption))
    };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Histórico de Consumo" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {format(new Date(label), 'dd/MM/yyyy')}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Consumo: <span className="font-medium text-brand">{payload[0].value}</span>
            </p>
            {comparePrevious && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Mês Anterior: <span className="font-medium text-gray-500">{payload[2].value}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Média: <span className="font-medium text-green-500">{payload[1].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Histórico de Consumo</h1>
        
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="btn-secondary flex items-center rounded-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn-primary flex items-center px-3"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <Filter className="h-5 w-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-[#1E293B]/90 border border-light-border dark:border-gray-700/50 backdrop-blur-sm z-50">
                <div className="py-1">
                  <button
                    onClick={() => setSelectedMetric('daily')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedMetric === 'daily' 
                        ? 'bg-brand/10 text-brand dark:text-brand-400' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-light-secondary dark:hover:bg-[#0F172A]/40'
                    } transition-colors first:rounded-t-lg`}
                  >
                    Visualização Diária
                  </button>
                  <button
                    onClick={() => setSelectedMetric('weekly')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedMetric === 'weekly'
                        ? 'bg-brand/10 text-brand dark:text-brand-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-light-secondary dark:hover:bg-[#0F172A]/40'
                    } transition-colors`}
                  >
                    Média Semanal
                  </button>
                  <button
                    onClick={() => setComparePrevious(!comparePrevious)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      comparePrevious
                        ? 'bg-brand/10 text-brand dark:text-brand-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-light-secondary dark:hover:bg-[#0F172A]/40'
                    } transition-colors last:rounded-b-lg`}
                  >
                    Comparar com Mês Anterior
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Consumption */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <TrendingUp className={iconClass} />
            </div>
            <span className={badgeClass}>Total</span>
          </div>
          <h3 className={metricTitleClass}>Consumo Total</h3>
          <p className={metricValueClass}>{metrics.total.toFixed(0)}</p>
          <div className="flex items-center mt-2">
            {metrics.percentageChange > 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1 text-red-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1 text-green-500" />
            )}
            <span className={`${metricSubtextClass} ${
              metrics.percentageChange > 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {Math.abs(metrics.percentageChange).toFixed(1)}% vs mês anterior
            </span>
          </div>
        </div>

        {/* Average */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Clock className={iconClass} />
            </div>
            <span className={badgeClass}>Média</span>
          </div>
          <h3 className={metricTitleClass}>Média Diária</h3>
          <p className={metricValueClass}>{metrics.average.toFixed(1)}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Consumo médio por dia</span>
          </div>
        </div>

        {/* Peak Usage */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <ArrowUpRight className={iconClass} />
            </div>
            <span className={badgeClass}>Pico</span>
          </div>
          <h3 className={metricTitleClass}>Pico de Consumo</h3>
          <p className={metricValueClass}>{metrics.peak}</p>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>Maior consumo registrado</span>
          </div>
        </div>

        {/* Period Selector */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div className={iconContainerClass}>
              <Calendar className={iconClass} />
            </div>
            <span className={badgeClass}>Período</span>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 rounded-lg p-2 mt-2"
          >
            <option value="current">Mês Atual</option>
            <option value="previous">Mês Anterior</option>
          </select>
          <div className="flex items-center mt-4">
            <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            <span className={metricSubtextClass}>
              {format(data[0].date, "MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className={`${cardClass} h-[500px]`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={metricTitleClass}>Gráfico de Consumo</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-secondary"
              title="Aumentar Zoom"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-secondary"
              title="Diminuir Zoom"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-secondary"
              title="Resetar Zoom"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'dd/MM')}
              stroke="#64748B"
            />
            <YAxis stroke="#64748B" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Line
              type="monotone"
              dataKey="consumption"
              name="Consumo"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 8 }}
            />
            
            <Line
              type="monotone"
              dataKey="average"
              name="Média"
              stroke="#22C55E"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />

            {comparePrevious && (
              <Line
                type="monotone"
                dataKey="previousMonth"
                name="Mês Anterior"
                stroke="#94A3B8"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}

            {/* Reference area for zoom */}
            {zoomDomain && (
              <ReferenceArea
                x1={data[zoomDomain.start].date}
                x2={data[zoomDomain.end].date}
                strokeOpacity={0.3}
              />
            )}

            {/* Average line */}
            <ReferenceLine
              y={metrics.average}
              label="Média"
              stroke="#22C55E"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}