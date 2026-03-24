/**
 * GET /api/catalog/categories?location_id=<LOCATION_ID>
 * 
 * Returns categories that have at least one item present at the given location.
 * Each category includes id, name, and item_count.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchCategories } from '@/lib/square';
import { cache, getCategoriesCacheKey } from '@/lib/cache';
import { mapSquareError, CommonErrors } from '@/lib/errors';
import { Category, ApiResponse } from '@/types';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Category[]>>> {
  const startTime = Date.now();
  const path = '/api/catalog/categories';

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
    const cacheKey = getCategoriesCacheKey(locationId);
    const cachedData = cache.get<Category[]>(cacheKey);
    
    if (cachedData) {
      logger.request('GET', path, 200, startTime, `Cache hit for location ${locationId}`);
      return NextResponse.json({
        success: true,
        data: cachedData,
      });
    }

    // Fetch categories
    const categories = await fetchCategories(locationId);
    
    // Cache the result
    cache.set(cacheKey, categories);
    
    logger.request('GET', path, 200, startTime, `Fetched ${categories.length} categories for location ${locationId}`);
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    const appError = mapSquareError(error);
    logger.error('Failed to fetch categories', error);
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
