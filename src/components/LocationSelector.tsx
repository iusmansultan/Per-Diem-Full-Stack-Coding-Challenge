'use client';

/**
 * Location Selector Component
 * 
 * Dropdown for selecting a restaurant location.
 * Persists selection to localStorage.
 */

import React, { useEffect, useState } from 'react';
import { MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { Location } from '@/types';
import { useLocations } from '@/hooks/useApi';
import { cn, formatAddress, STORAGE_KEYS } from '@/lib/utils';

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onLocationChange: (location: Location) => void;
}

export function LocationSelector({
  selectedLocation,
  onLocationChange,
}: LocationSelectorProps) {
  const { locations, isLoading, isError, error, retry } = useLocations();
  const [isOpen, setIsOpen] = useState(false);

  // Load saved location from localStorage on mount
  useEffect(() => {
    if (locations && locations.length > 0 && !selectedLocation) {
      const savedLocationId = localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
      const savedLocation = savedLocationId
        ? locations.find((loc) => loc.id === savedLocationId)
        : null;
      
      // Use saved location or default to first
      onLocationChange(savedLocation ?? locations[0]);
    }
  }, [locations, selectedLocation, onLocationChange]);

  // Save location to localStorage when changed
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, selectedLocation.id);
    }
  }, [selectedLocation]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-location-selector]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
        <span className="text-slate-500 dark:text-slate-400">Loading locations...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
        <button
          onClick={retry}
          className="ml-auto text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <span className="text-amber-600 dark:text-amber-400 text-sm">No locations available</span>
      </div>
    );
  }

  return (
    <div className="relative" data-location-selector>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800',
          'rounded-lg border border-slate-200 dark:border-slate-700',
          'hover:border-primary-300 dark:hover:border-primary-600',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'dark:focus:ring-offset-slate-900'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select location"
      >
        <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div className="flex-1 text-left min-w-0">
          <p className="font-medium text-slate-900 dark:text-white truncate">
            {selectedLocation?.name ?? 'Select a location'}
          </p>
          {selectedLocation?.address && (
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {formatAddress(selectedLocation.address)}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <ul
          className={cn(
            'absolute z-50 w-full mt-2 py-1',
            'bg-white dark:bg-slate-800 rounded-lg shadow-lg',
            'border border-slate-200 dark:border-slate-700',
            'max-h-60 overflow-auto',
            'animate-fade-in'
          )}
          role="listbox"
          aria-label="Locations"
        >
          {locations.map((location) => (
            <li key={location.id}>
              <button
                onClick={() => {
                  onLocationChange(location);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-3 text-left',
                  'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                  'transition-colors duration-150',
                  selectedLocation?.id === location.id && 'bg-primary-50 dark:bg-primary-900/20'
                )}
                role="option"
                aria-selected={selectedLocation?.id === location.id}
              >
                <p className="font-medium text-slate-900 dark:text-white">
                  {location.name}
                </p>
                {location.address && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatAddress(location.address)}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
