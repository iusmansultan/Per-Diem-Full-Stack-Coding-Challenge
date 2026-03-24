'use client';

/**
 * Custom Hooks for API Data Fetching
 * 
 * Provides hooks for fetching locations, catalog, and categories
 * with loading states, error handling, and caching.
 */

import { useState, useEffect, useCallback } from 'react';
import { Location, Category, CatalogResponse, ApiResponse, LoadingState } from '@/types';

/**
 * Generic fetch hook
 */
function useFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await fetchFn();
      
      if (response.success && response.data) {
        setData(response.data);
        setStatus('success');
      } else {
        setError(response.error?.message ?? 'An error occurred');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }, dependencies);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  return { data, status, error, execute, retry };
}

/**
 * Fetch locations from API
 */
async function fetchLocationsApi(): Promise<ApiResponse<Location[]>> {
  const response = await fetch('/api/locations');
  return response.json();
}

/**
 * Fetch catalog for a location
 */
async function fetchCatalogApi(locationId: string): Promise<ApiResponse<CatalogResponse>> {
  const response = await fetch(`/api/catalog?location_id=${encodeURIComponent(locationId)}`);
  return response.json();
}

/**
 * Fetch categories for a location
 */
async function fetchCategoriesApi(locationId: string): Promise<ApiResponse<Category[]>> {
  const response = await fetch(`/api/catalog/categories?location_id=${encodeURIComponent(locationId)}`);
  return response.json();
}

/**
 * Hook for fetching locations
 */
export function useLocations() {
  const { data, status, error, execute, retry } = useFetch(
    fetchLocationsApi,
    []
  );

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    locations: data,
    isLoading: status === 'loading',
    isError: status === 'error',
    error,
    retry,
  };
}

/**
 * Hook for fetching catalog
 */
export function useCatalog(locationId: string | null) {
  const { data, status, error, execute, retry } = useFetch(
    () => fetchCatalogApi(locationId!),
    [locationId]
  );

  useEffect(() => {
    if (locationId) {
      execute();
    }
  }, [locationId, execute]);

  return {
    catalog: data,
    isLoading: status === 'loading',
    isError: status === 'error',
    error,
    retry,
  };
}

/**
 * Hook for fetching categories
 */
export function useCategories(locationId: string | null) {
  const { data, status, error, execute, retry } = useFetch(
    () => fetchCategoriesApi(locationId!),
    [locationId]
  );

  useEffect(() => {
    if (locationId) {
      execute();
    }
  }, [locationId, execute]);

  return {
    categories: data,
    isLoading: status === 'loading',
    isError: status === 'error',
    error,
    retry,
  };
}
