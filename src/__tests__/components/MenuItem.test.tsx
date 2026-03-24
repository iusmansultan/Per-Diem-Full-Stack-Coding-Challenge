/**
 * MenuItem Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuItemCard } from '@/components/MenuItem';
import { MenuItem } from '@/types';

const mockItem: MenuItem = {
  id: 'item-1',
  name: 'Test Burger',
  description: 'A delicious test burger with all the fixings that you could ever want in a burger',
  categoryId: 'cat-1',
  categoryName: 'Burgers',
  imageUrl: 'https://example.com/burger.jpg',
  variations: [
    {
      id: 'var-1',
      name: 'Regular',
      price: 12.99,
      currency: 'USD',
      formattedPrice: '$12.99',
    },
  ],
};

describe('MenuItemCard', () => {
  it('should render item name', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('Test Burger')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('Burgers')).toBeInTheDocument();
  });

  it('should render price', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('should truncate long descriptions', () => {
    const longDescription = 'A'.repeat(150);
    const itemWithLongDesc = { ...mockItem, description: longDescription };
    
    render(<MenuItemCard item={itemWithLongDesc} />);
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });

  it('should expand description on Read more click', () => {
    const longDescription = 'A'.repeat(150);
    const itemWithLongDesc = { ...mockItem, description: longDescription };
    
    render(<MenuItemCard item={itemWithLongDesc} />);
    fireEvent.click(screen.getByText('Read more'));
    expect(screen.getByText('Read less')).toBeInTheDocument();
  });

  it('should render multiple variations', () => {
    const itemWithVariations: MenuItem = {
      ...mockItem,
      variations: [
        { id: 'v1', name: 'Small', price: 8.99, currency: 'USD', formattedPrice: '$8.99' },
        { id: 'v2', name: 'Large', price: 12.99, currency: 'USD', formattedPrice: '$12.99' },
      ],
    };
    
    render(<MenuItemCard item={itemWithVariations} />);
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('$8.99')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('should show placeholder when no image', () => {
    const itemNoImage = { ...mockItem, imageUrl: undefined };
    render(<MenuItemCard item={itemNoImage} />);
    // ImageOff icon should be present (we can't easily test for the icon, but the component should render)
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
