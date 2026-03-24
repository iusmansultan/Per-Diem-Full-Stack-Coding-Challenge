'use client';

/**
 * Main Menu Page
 * 
 * Displays the restaurant menu with location selection,
 * category navigation, search, and menu items.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { UtensilsCrossed, Search as SearchIcon } from 'lucide-react';
import { Location, MenuItem } from '@/types';
import { useCatalog, useCategories } from '@/hooks/useApi';
import { LocationSelector } from '@/components/LocationSelector';
import { CategoryTabs } from '@/components/CategoryTabs';
import { MenuItemCard, MenuItemSkeleton } from '@/components/MenuItem';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ErrorState, EmptyState } from '@/components/ErrorState';

export default function MenuPage() {
  // State
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data fetching
  const { 
    catalog, 
    isLoading: isCatalogLoading, 
    isError: isCatalogError, 
    error: catalogError,
    retry: retryCatalog 
  } = useCatalog(selectedLocation?.id ?? null);
  
  const { 
    categories, 
    isLoading: isCategoriesLoading 
  } = useCategories(selectedLocation?.id ?? null);

  // Handle location change
  const handleLocationChange = useCallback((location: Location) => {
    setSelectedLocation(location);
    setActiveCategory(null);
    setSearchQuery('');
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((categoryName: string) => {
    setActiveCategory(categoryName === 'all' ? null : categoryName);
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase());
  }, []);

  // Filter and group items
  const filteredItems = useMemo(() => {
    if (!catalog?.items) return [];

    let items = catalog.items;

    // Filter by category
    if (activeCategory) {
      items = items.filter((item) => item.categoryName === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description?.toLowerCase().includes(searchQuery)
      );
    }

    return items;
  }, [catalog?.items, activeCategory, searchQuery]);

  // Group items by category for display
  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    
    for (const item of filteredItems) {
      if (!groups[item.categoryName]) {
        groups[item.categoryName] = [];
      }
      groups[item.categoryName].push(item);
    }

    // Sort categories alphabetically, Uncategorized last
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Uncategorized') return 1;
      if (b === 'Uncategorized') return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((key) => ({ category: key, items: groups[key] }));
  }, [filteredItems]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Menu
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Browse our delicious offerings
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Location Selector */}
          <LocationSelector
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {selectedLocation ? (
          <>
            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Category Tabs */}
            <div className="mb-6">
              <CategoryTabs
                categories={categories ?? []}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                isLoading={isCategoriesLoading}
              />
            </div>

            {/* Menu Items */}
            {isCatalogLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MenuItemSkeleton key={i} />
                ))}
              </div>
            ) : isCatalogError ? (
              <ErrorState
                message={catalogError ?? 'Failed to load menu items'}
                onRetry={retryCatalog}
              />
            ) : filteredItems.length === 0 ? (
              <EmptyState
                title={searchQuery ? 'No results found' : 'No items available'}
                description={
                  searchQuery
                    ? `No menu items match "${searchQuery}". Try a different search term.`
                    : 'There are no menu items available at this location.'
                }
                icon={<SearchIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
              />
            ) : (
              <div className="space-y-8">
                {groupedItems.map(({ category, items }) => (
                  <section key={category} id={`category-${category}`}>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      {category}
                      <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                        ({items.length} {items.length === 1 ? 'item' : 'items'})
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Select a location"
            description="Choose a restaurant location above to view the menu."
            icon={<UtensilsCrossed className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Made with Love ❤️ for Per Diem Coding Challenge by Muhammad Usman</p>
      </footer>
    </div>
  );
}
