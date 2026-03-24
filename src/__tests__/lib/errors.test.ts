/**
 * Error Handling Unit Tests
 */

import { AppError, mapSquareError, CommonErrors } from '@/lib/errors';

describe('AppError', () => {
  it('should create an error with all properties', () => {
    const error = new AppError('TEST_ERROR', 'Test message', 400, 'Test details');
    
    expect(error.code).toBe('TEST_ERROR');
    expect(error.message).toBe('Test message');
    expect(error.statusCode).toBe(400);
    expect(error.details).toBe('Test details');
  });

  it('should convert to API error format', () => {
    const error = new AppError('TEST_ERROR', 'Test message', 400, 'Test details');
    const apiError = error.toApiError();
    
    expect(apiError).toEqual({
      code: 'TEST_ERROR',
      message: 'Test message',
      details: 'Test details',
    });
  });

  it('should default to 500 status code', () => {
    const error = new AppError('TEST_ERROR', 'Test message');
    expect(error.statusCode).toBe(500);
  });
});

describe('mapSquareError', () => {
  it('should map Square API errors', () => {
    const squareError = {
      errors: [
        { code: 'UNAUTHORIZED', detail: 'Invalid token', category: 'AUTHENTICATION' },
      ],
    };
    
    const result = mapSquareError(squareError);
    
    expect(result.code).toBe('UNAUTHORIZED');
    expect(result.message).toBe('Invalid token');
    expect(result.statusCode).toBe(401);
  });

  it('should map rate limit errors', () => {
    const squareError = {
      errors: [{ code: 'RATE_LIMITED', detail: 'Too many requests' }],
    };
    
    const result = mapSquareError(squareError);
    expect(result.statusCode).toBe(429);
  });

  it('should handle generic errors', () => {
    const error = new Error('Something went wrong');
    const result = mapSquareError(error);
    
    expect(result.code).toBe('INTERNAL_ERROR');
    expect(result.message).toBe('Something went wrong');
  });

  it('should handle unknown errors', () => {
    const result = mapSquareError('unknown');
    
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.statusCode).toBe(500);
  });
});

describe('CommonErrors', () => {
  it('should have MISSING_LOCATION_ID error', () => {
    expect(CommonErrors.MISSING_LOCATION_ID.code).toBe('MISSING_LOCATION_ID');
    expect(CommonErrors.MISSING_LOCATION_ID.statusCode).toBe(400);
  });

  it('should have SQUARE_CONFIG_ERROR error', () => {
    expect(CommonErrors.SQUARE_CONFIG_ERROR.code).toBe('CONFIGURATION_ERROR');
    expect(CommonErrors.SQUARE_CONFIG_ERROR.statusCode).toBe(500);
  });
});
