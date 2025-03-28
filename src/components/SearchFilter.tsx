import React from 'react';
import { Search, Filter } from 'lucide-react';
import '../Styles/animations.css';

interface SearchFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: {
    value: string;
    label: string;
  }[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  className?: string;
}

export default function SearchFilter({
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  className = ""
}: SearchFilterProps) {
  return (
    <div className={`flex flex-col lg:flex-row gap-4 w-full fade-in ${className}`}>
      {/* Search Input */}
      <div className="flex-grow">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Filter Dropdown */}
      {filterOptions && onFilterChange && (
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm appearance-none cursor-pointer"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}