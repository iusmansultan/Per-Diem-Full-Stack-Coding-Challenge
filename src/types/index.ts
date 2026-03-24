/**
 * Square Menu App - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the application for type safety and documentation.
 */

// ============================================================================
// Location Types
// ============================================================================

/**
 * Simplified location data returned from the API
 */
export interface Location {
  id: string;
  name: string;
  address: LocationAddress;
  timezone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

/**
 * Location address structure
 */
export interface LocationAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// ============================================================================
// Catalog Types
// ============================================================================

/**
 * Category with item count for the selected location
 */
export interface Category {
  id: string;
  name: string;
  itemCount: number;
}

/**
 * Item variation with name and price
 */
export interface ItemVariation {
  id: string;
  name: string;
  price: number;
  currency: string;
  formattedPrice: string;
}

/**
 * Menu item with all display information
 */
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  categoryName: string;
  imageUrl?: string;
  variations: ItemVariation[];
}

/**
 * Catalog items grouped by category
 */
export interface CatalogByCategory {
  [categoryName: string]: MenuItem[];
}

/**
 * Full catalog response from the API
 */
export interface CatalogResponse {
  items: MenuItem[];
  categories: CatalogByCategory;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// ============================================================================
// Square API Types (Raw responses)
// ============================================================================

/**
 * Square Location object (subset of fields we use)
 */
export interface SquareLocation {
  id?: string;
  name?: string;
  address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    administrative_district_level_1?: string;
    postal_code?: string;
    country?: string;
  };
  timezone?: string;
  status?: string;
}

/**
 * Square Catalog Object base
 */
export interface SquareCatalogObject {
  type: string;
  id: string;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[];
  item_data?: SquareItemData;
  category_data?: SquareCategoryData;
  image_data?: SquareImageData;
}

/**
 * Square Item Data
 */
export interface SquareItemData {
  name?: string;
  description?: string;
  category_id?: string;
  image_ids?: string[];
  variations?: SquareCatalogObject[];
  item_variation_data?: SquareItemVariationData;
}

/**
 * Square Item Variation Data
 */
export interface SquareItemVariationData {
  name?: string;
  price_money?: {
    amount?: bigint;
    currency?: string;
  };
}

/**
 * Square Category Data
 */
export interface SquareCategoryData {
  name?: string;
}

/**
 * Square Image Data
 */
export interface SquareImageData {
  url?: string;
  name?: string;
}

// ============================================================================
// Cache Types
// ============================================================================

/**
 * Cache entry with TTL
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'system';
