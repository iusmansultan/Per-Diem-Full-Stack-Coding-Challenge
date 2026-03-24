/**
 * Square API Client
 * 
 * Handles all interactions with the Square API including:
 * - Locations API
 * - Catalog API (SearchCatalogObjects)
 * - Pagination handling
 * - Data transformation
 */

import { Client, Environment } from 'square';
import {
  Location,
  LocationAddress,
  Category,
  MenuItem,
  ItemVariation,
  CatalogResponse,
  CatalogByCategory,
  SquareCatalogObject,
} from '@/types';
import { logger } from './logger';

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
});

/**
 * Fetch all active locations from Square
 */
export async function fetchLocations(): Promise<Location[]> {
  logger.debug('Fetching locations from Square API');
  
  const { result } = await squareClient.locationsApi.listLocations();
  
  if (!result.locations) {
    return [];
  }

  // Filter to only active locations and transform to our format
  return result.locations
    .filter((loc) => loc.status === 'ACTIVE')
    .map((loc) => ({
      id: loc.id ?? '',
      name: loc.name ?? 'Unknown Location',
      address: transformAddress(loc.address as any),
      timezone: loc.timezone ?? 'UTC',
      status: 'ACTIVE' as const,
    }));
}

/**
 * Transform Square address to our format
 */
function transformAddress(address?: {
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  administrativeDistrictLevel1?: string;
  postalCode?: string;
  country?: string;
}): LocationAddress {
  if (!address) {
    return {};
  }
  
  return {
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.locality,
    state: address.administrativeDistrictLevel1,
    postalCode: address.postalCode,
    country: address.country,
  };
}

/**
 * Fetch catalog items for a specific location with pagination handling
 */
export async function fetchCatalog(locationId: string): Promise<CatalogResponse> {
  logger.debug('Fetching catalog from Square API', { locationId });
  
  const allObjects: SquareCatalogObject[] = [];
  const allRelatedObjects: SquareCatalogObject[] = [];
  let cursor: string | undefined;

  // First, fetch all categories separately to ensure we have them
  const { result: categoryResult } = await squareClient.catalogApi.searchCatalogObjects({
    objectTypes: ['CATEGORY'],
  });
  
  if (categoryResult.objects) {
    allRelatedObjects.push(...(categoryResult.objects as unknown as SquareCatalogObject[]));
  }

  // Handle pagination - fetch all pages of items
  do {
    const { result } = await squareClient.catalogApi.searchCatalogObjects({
      objectTypes: ['ITEM'],
      includeRelatedObjects: true,
      cursor,
    });

    if (result.objects) {
      allObjects.push(...(result.objects as unknown as SquareCatalogObject[]));
    }
    if (result.relatedObjects) {
      allRelatedObjects.push(...(result.relatedObjects as unknown as SquareCatalogObject[]));
    }
    
    cursor = result.cursor;
  } while (cursor);

  // Build lookup maps for categories and images
  const categoryMap = new Map<string, string>();
  const imageMap = new Map<string, string>();

  // Also check the main objects for categories (they might be there too)
  const allObjectsToCheck = [...allRelatedObjects, ...allObjects] as any[];
  
  for (const obj of allObjectsToCheck) {
    if (obj.type === 'CATEGORY' && obj.categoryData?.name) {
      categoryMap.set(obj.id, obj.categoryData.name);
    }
    if (obj.type === 'IMAGE' && obj.imageData?.url) {
      imageMap.set(obj.id, obj.imageData.url);
    }
  }
  
  logger.debug('Category map built', { 
    categoryCount: categoryMap.size, 
    relatedObjectsCount: allRelatedObjects.length,
    categories: Array.from(categoryMap.entries())
  });

  // Filter items present at the given location
  // Note: Square SDK returns camelCase properties
  const filteredItems = allObjects.filter((item: any) => {
    if (item.presentAtAllLocations) {
      return true;
    }
    if (item.presentAtLocationIds?.includes(locationId)) {
      return true;
    }
    return false;
  });

  // Transform items to our format
  // Note: Square SDK uses camelCase for all properties
  const menuItems: MenuItem[] = filteredItems.map((item: any) => {
    const itemData = item.itemData;
    // Square API uses categories array or reportingCategory
    let categoryId: string | undefined;
    if (itemData?.categories && itemData.categories.length > 0) {
      categoryId = itemData.categories[0].id;
    } else if (itemData?.reportingCategory?.id) {
      categoryId = itemData.reportingCategory.id;
    } else if (itemData?.categoryId) {
      categoryId = itemData.categoryId;
    }
    const categoryName = categoryId ? categoryMap.get(categoryId) ?? 'Uncategorized' : 'Uncategorized';
    
    // Get image URL from first image ID
    let imageUrl: string | undefined;
    if (itemData?.imageIds && itemData.imageIds.length > 0) {
      imageUrl = imageMap.get(itemData.imageIds[0]);
    }

    // Transform variations
    const variations: ItemVariation[] = (itemData?.variations ?? []).map((variation: any) => {
      const varData = variation.itemVariationData;
      const priceMoney = varData?.priceMoney;
      const amount = priceMoney?.amount ? Number(priceMoney.amount) : 0;
      const currency = priceMoney?.currency ?? 'USD';
      
      return {
        id: variation.id,
        name: varData?.name ?? 'Regular',
        price: amount / 100, // Convert cents to dollars
        currency,
        formattedPrice: formatPrice(amount, currency),
      };
    });

    return {
      id: item.id,
      name: itemData?.name ?? 'Unknown Item',
      description: itemData?.description,
      categoryId,
      categoryName,
      imageUrl,
      variations,
    };
  });

  // Group items by category
  const categories: CatalogByCategory = {};
  for (const item of menuItems) {
    if (!categories[item.categoryName]) {
      categories[item.categoryName] = [];
    }
    categories[item.categoryName].push(item);
  }

  return {
    items: menuItems,
    categories,
  };
}

/**
 * Fetch categories for a specific location
 */
export async function fetchCategories(locationId: string): Promise<Category[]> {
  // We need to fetch the catalog to determine which categories have items at this location
  const catalog = await fetchCatalog(locationId);
  
  // Count items per category
  const categoryCounts = new Map<string, { id: string; count: number }>();
  
  for (const item of catalog.items) {
    const categoryName = item.categoryName;
    const existing = categoryCounts.get(categoryName);
    
    if (existing) {
      existing.count++;
    } else {
      categoryCounts.set(categoryName, {
        id: item.categoryId ?? `cat-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
        count: 1,
      });
    }
  }

  // Transform to Category array
  const categories: Category[] = [];
  const entries = Array.from(categoryCounts.entries());
  for (const [name, data] of entries) {
    categories.push({
      id: data.id,
      name,
      itemCount: data.count,
    });
  }

  // Sort alphabetically, but put "Uncategorized" at the end
  categories.sort((a, b) => {
    if (a.name === 'Uncategorized') return 1;
    if (b.name === 'Uncategorized') return -1;
    return a.name.localeCompare(b.name);
  });

  return categories;
}

/**
 * Format price for display
 */
function formatPrice(amountCents: number, currency: string): string {
  const amount = amountCents / 100;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export default squareClient;
