/**
 * Error Handling Utilities
 * 
 * Provides standardized error handling and mapping for API responses.
 */

import { ApiError } from '@/types';

/**
 * Custom API Error class
 */
export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: string;

  constructor(code: string, message: string, statusCode: number = 500, details?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

/**
 * Map Square API errors to our standardized format
 */
export function mapSquareError(error: unknown): AppError {
  // Handle Square SDK errors
  if (error && typeof error === 'object' && 'errors' in error) {
    const squareError = error as { errors: Array<{ code?: string; detail?: string; category?: string }> };
    const firstError = squareError.errors[0];
    
    if (firstError) {
      const code = firstError.code ?? 'SQUARE_ERROR';
      const message = firstError.detail ?? 'An error occurred with the Square API';
      
      // Map common Square error codes to HTTP status codes
      let statusCode = 500;
      if (code === 'UNAUTHORIZED' || code === 'ACCESS_TOKEN_EXPIRED') {
        statusCode = 401;
      } else if (code === 'FORBIDDEN') {
        statusCode = 403;
      } else if (code === 'NOT_FOUND') {
        statusCode = 404;
      } else if (code === 'RATE_LIMITED') {
        statusCode = 429;
      } else if (code === 'INVALID_REQUEST_ERROR') {
        statusCode = 400;
      }

      return new AppError(code, message, statusCode, firstError.category);
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new AppError(
      'INTERNAL_ERROR',
      error.message || 'An unexpected error occurred',
      500
    );
  }

  return new AppError(
    'UNKNOWN_ERROR',
    'An unknown error occurred',
    500
  );
}

/**
 * Common error responses
 */
export const CommonErrors = {
  MISSING_LOCATION_ID: new AppError(
    'MISSING_LOCATION_ID',
    'Location ID is required',
    400
  ),
  INVALID_LOCATION_ID: new AppError(
    'INVALID_LOCATION_ID',
    'Invalid location ID provided',
    400
  ),
  LOCATION_NOT_FOUND: new AppError(
    'LOCATION_NOT_FOUND',
    'Location not found',
    404
  ),
  SQUARE_CONFIG_ERROR: new AppError(
    'CONFIGURATION_ERROR',
    'Square API is not properly configured',
    500,
    'Please check SQUARE_ACCESS_TOKEN environment variable'
  ),
};
