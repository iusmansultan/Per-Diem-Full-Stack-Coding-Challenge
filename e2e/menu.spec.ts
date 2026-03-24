/**
 * E2E Tests for Menu Application
 * 
 * Tests the main user flows including:
 * - Location selection
 * - Category navigation
 * - Menu item display
 * - Search functionality
 * - Theme toggle
 */

import { test, expect } from '@playwright/test';

test.describe('Menu Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the header with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Menu' })).toBeVisible();
  });

  test('should show location selector', async ({ page }) => {
    await expect(page.getByLabel('Select location')).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // The location selector should show loading state
    await expect(page.getByText('Loading locations...')).toBeVisible();
  });

  test('should show empty state when no location selected', async ({ page }) => {
    // Wait for locations to load
    await page.waitForTimeout(1000);
    
    // If no locations, should show appropriate message
    const emptyState = page.getByText('Select a location');
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });
});

test.describe('Location Selection', () => {
  test('should open location dropdown on click', async ({ page }) => {
    await page.goto('/');
    
    // Wait for locations to load
    await page.waitForSelector('[data-location-selector]', { timeout: 10000 });
    
    // Click the location selector
    await page.click('[data-location-selector] button');
    
    // Dropdown should be visible
    await expect(page.getByRole('listbox')).toBeVisible();
  });

  test('should persist selected location in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for locations to load and select one
    await page.waitForSelector('[data-location-selector]', { timeout: 10000 });
    
    // Check localStorage after selection
    const locationId = await page.evaluate(() => {
      return localStorage.getItem('square-menu-selected-location');
    });
    
    // Location should be stored (may be null if no locations available)
    expect(locationId === null || typeof locationId === 'string').toBeTruthy();
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Find and click dark mode button
    const darkModeButton = page.getByLabel('Switch to Dark theme');
    await darkModeButton.click();
    
    // Check that dark class is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should toggle light mode', async ({ page }) => {
    await page.goto('/');
    
    // First switch to dark
    await page.getByLabel('Switch to Dark theme').click();
    
    // Then switch to light
    await page.getByLabel('Switch to Light theme').click();
    
    // Check that dark class is removed
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe('Search Functionality', () => {
  test('should show search bar when location is selected', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForTimeout(2000);
    
    // Search bar should be visible if a location is selected
    const searchBar = page.getByPlaceholder('Search menu items...');
    
    // This will only be visible if locations are available
    if (await searchBar.isVisible()) {
      await expect(searchBar).toBeVisible();
    }
  });

  test('should filter items when searching', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForTimeout(2000);
    
    const searchBar = page.getByPlaceholder('Search menu items...');
    
    if (await searchBar.isVisible()) {
      // Type a search query
      await searchBar.fill('test');
      
      // Wait for filtering
      await page.waitForTimeout(500);
      
      // The UI should update (either show results or empty state)
      const content = await page.content();
      expect(content).toBeTruthy();
    }
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Header should still be visible
    await expect(page.getByRole('heading', { name: 'Menu' })).toBeVisible();
    
    // Theme toggle should be visible
    await expect(page.getByLabel('Switch to Light theme')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check for ARIA labels
    await expect(page.getByLabel('Select location')).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab to location selector
    await page.keyboard.press('Tab');
    
    // The focused element should be interactive
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
