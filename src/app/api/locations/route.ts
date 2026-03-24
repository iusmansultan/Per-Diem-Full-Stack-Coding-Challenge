/**
 * GET /api/locations
 * 
 * Fetches all active locations from Square's Locations API.
 * Returns simplified location data with caching.
 */

import { NextResponse } from 'next/server';
import { fetchLocations } from '@/lib/square';
import { cache, getLocationsCacheKey } from '@/lib/cache';
import { mapSquareError, CommonErrors } from '@/lib/errors';
import { Location, ApiResponse } from '@/types';
import { logger } from '@/lib/logger';

export async function GET(): Promise<NextResponse<ApiResponse<Location[]>>> {
  const startTime = Date.now();
  const path = '/api/locations';

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

    // Check cache first
    const cacheKey = getLocationsCacheKey();
    const cachedData = cache.get<Location[]>(cacheKey);
    
    if (cachedData) {
      logger.request('GET', path, 200, startTime, 'Cache hit');
      return NextResponse.json({
        success: true,
        data: cachedData,
      });
    }

    // Fetch from Square API
    const locations = await fetchLocations();
    
    // Cache the result
    cache.set(cacheKey, locations);
    
    logger.request('GET', path, 200, startTime, `Fetched ${locations.length} locations`);
    
    return NextResponse.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    const appError = mapSquareError(error);
    logger.error('Failed to fetch locations', error);
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
