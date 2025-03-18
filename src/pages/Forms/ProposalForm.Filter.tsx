import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

interface FilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
}

export default function ProposalFormFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange
}: FilterProps) {
  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
  const selectClass = "pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px] rounded-lg shadow-sm";

  return (
    <div className={cardClass}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Field */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou CNPJ..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className={selectClass}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className={selectClass}
            >
              <option value="all">Todas as Datas</option>
              <option value="today">Hoje</option>
              <option value="thisWeek">Esta Semana</option>
              <option value="thisMonth">Este Mês</option>
              <option value="thisYear">Este Ano</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}