/**
 * Utils Module Unit Tests
 */

import { cn, truncateText, formatAddress, STORAGE_KEYS } from '@/lib/utils';

describe('cn (className merger)', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'included', false && 'excluded');
    expect(result).toBe('base included');
  });

  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toBe('py-2 px-6');
  });
});

describe('truncateText', () => {
  it('should not truncate short text', () => {
    const result = truncateText('Hello', 10);
    expect(result).toBe('Hello');
  });

  it('should truncate long text with ellipsis', () => {
    const result = truncateText('Hello World', 8);
    expect(result).toBe('Hello Wo...');
  });

  it('should handle exact length', () => {
    const result = truncateText('Hello', 5);
    expect(result).toBe('Hello');
  });
});

describe('formatAddress', () => {
  it('should format full address', () => {
    const result = formatAddress({
      addressLine1: '123 Main St',
      city: 'New York',
      state: 'NY',
    });
    expect(result).toBe('123 Main St, New York, NY');
  });

  it('should handle partial address', () => {
    const result = formatAddress({
      city: 'New York',
      state: 'NY',
    });
    expect(result).toBe('New York, NY');
  });

  it('should handle empty address', () => {
    const result = formatAddress({});
    expect(result).toBe('');
  });
});

describe('STORAGE_KEYS', () => {
  it('should have correct storage keys', () => {
    expect(STORAGE_KEYS.SELECTED_LOCATION).toBe('square-menu-selected-location');
    expect(STORAGE_KEYS.THEME).toBe('square-menu-theme');
  });
});
