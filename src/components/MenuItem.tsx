'use client';

/**
 * Menu Item Card Component
 * 
 * Displays a single menu item with image, name, description,
 * and price variations.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types';
import { cn, truncateText } from '@/lib/utils';

interface MenuItemProps {
  item: MenuItemType;
}

const DESCRIPTION_MAX_LENGTH = 100;

export function MenuItemCard({ item }: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasLongDescription = item.description && item.description.length > DESCRIPTION_MAX_LENGTH;
  const displayDescription = isExpanded
    ? item.description
    : truncateText(item.description ?? '', DESCRIPTION_MAX_LENGTH);

  // Get primary price (first variation)
  const primaryVariation = item.variations[0];
  const hasMultipleVariations = item.variations.length > 1;

  return (
    <article
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl overflow-hidden',
        'border border-slate-200 dark:border-slate-700',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        'animate-fade-in'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-700">
        {item.imageUrl && !imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <span className="inline-block px-2 py-0.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-2">
          {item.categoryName}
        </span>

        {/* Name */}
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <div className="mb-3">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {displayDescription}
            </p>
            {hasLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mt-1"
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          {hasMultipleVariations ? (
            <div className="flex flex-wrap gap-2">
              {item.variations.map((variation) => (
                <span
                  key={variation.id}
                  className="inline-flex items-center gap-1 text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-400">
                    {variation.name}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {variation.formattedPrice}
                  </span>
                </span>
              ))}
            </div>
          ) : primaryVariation ? (
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {primaryVariation.formattedPrice}
            </span>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Price not available
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Skeleton loader for menu items
 */
export function MenuItemSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-6 w-3/4" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-2/3" />
        </div>
        <div className="skeleton h-6 w-16" />
      </div>
    </div>
  );
}
