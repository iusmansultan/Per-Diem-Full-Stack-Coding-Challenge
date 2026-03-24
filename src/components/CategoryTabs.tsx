'use client';

/**
 * Category Tabs Component
 * 
 * Horizontal scrollable tabs for category navigation.
 * Highlights active category and handles smooth scrolling.
 */

import React, { useRef, useEffect } from 'react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryName: string) => void;
  isLoading?: boolean;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  isLoading = false,
}: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeCategory]);

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-hidden py-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton h-10 w-24 flex-shrink-0 rounded-full"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar py-2 -mx-4 px-4"
      role="tablist"
      aria-label="Menu categories"
    >
      {/* All Items tab */}
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'dark:focus:ring-offset-slate-900',
          activeCategory === 'all' || activeCategory === null
            ? 'bg-primary-500 text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        )}
        role="tab"
        aria-selected={activeCategory === 'all' || activeCategory === null}
      >
        All Items
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          ref={activeCategory === category.name ? activeTabRef : null}
          onClick={() => onCategoryChange(category.name)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'dark:focus:ring-offset-slate-900',
            activeCategory === category.name
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
          role="tab"
          aria-selected={activeCategory === category.name}
        >
          {category.name}
          <span className="ml-1.5 text-xs opacity-75">({category.itemCount})</span>
        </button>
      ))}
    </div>
  );
}
