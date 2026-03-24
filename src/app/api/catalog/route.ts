/**
 * GET /api/catalog?location_id=<LOCATION_ID>
 * 
 * Fetches catalog items from Square's Catalog API for a specific location.
 * Returns items grouped by category with caching.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalog } from '@/lib/square';
import { cache, getCatalogCacheKey } from '@/lib/cache';
import { mapSquareError, CommonErrors } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { CatalogResponse, ApiResponse } from '@/types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CatalogResponse>>> {
  const startTime = Date.now();
  const path = '/api/catalog';

  try {
    // Check if Square is configured
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      logger.request('GET', path, 500, startTime, 'Square not configured');
      return NextResponse.json(
        {
          success: false,
          error: CommonErrors.SQUARE_CONFIG_ERROR.toApiError(),
        },
        { status: 500 }
      );
    }

    // Get location_id from query params
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('location_id');

    if (!locationId) {
      logger.request('GET', path, 400, startTime, 'Missing location_id');
      return NextResponse.json(
        {
          success: false,
          error: CommonErrors.MISSING_LOCATION_ID.toApiError(),
        },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = getCatalogCacheKey(locationId);
    const cachedData = cache.get<CatalogResponse>(cacheKey);
    
    if (cachedData) {
      logger.request('GET', path, 200, startTime, `Cache hit for location ${locationId}`);
      return NextResponse.json({
        success: true,
        data: cachedData,
      });
    }

    // Fetch from Square API
    const catalog = await fetchCatalog(locationId);
    
    // Cache the result
    cache.set(cacheKey, catalog);
    
    logger.request('GET', path, 200, startTime, `Fetched ${catalog.items.length} items for location ${locationId}`);
    
    return NextResponse.json({
      success: true,
      data: catalog,
    });
  } catch (error) {
    const appError = mapSquareError(error);
    logger.error('Failed to fetch catalog', error);
    logger.request('GET', path, appError.statusCode, startTime, appError.message);
    
    return NextResponse.json(
      {
        success: false,
        error: appError.toApiError(),
      },
      { status: appError.statusCode }
    );
  }
}
