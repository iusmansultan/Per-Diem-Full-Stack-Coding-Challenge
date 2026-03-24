/**
 * Utility Functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format address for display
 */
export function formatAddress(address: {
  addressLine1?: string;
  city?: string;
  state?: string;
}): string {
  const parts = [address.addressLine1, address.city, address.state].filter(Boolean);
  return parts.join(', ');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  SELECTED_LOCATION: 'square-menu-selected-location',
  THEME: 'square-menu-theme',
} as const;
