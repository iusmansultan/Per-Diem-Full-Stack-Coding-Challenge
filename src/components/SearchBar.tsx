'use client';

/**
 * Search Bar Component
 * 
 * Client-side search filtering for menu items.
 */

import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search menu items...',
}: SearchBarProps) {
  const [value, setValue] = useState('');

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-10 py-3 rounded-lg',
          'bg-white dark:bg-slate-800',
          'border border-slate-200 dark:border-slate-700',
          'text-slate-900 dark:text-white',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200'
        )}
        aria-label="Search menu items"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      )}
    </div>
  );
}
