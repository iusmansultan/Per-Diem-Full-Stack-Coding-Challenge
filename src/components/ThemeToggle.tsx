'use client';

/**
 * Theme Toggle Component
 * 
 * Button to toggle between light, dark, and system themes.
 */

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';
import { ThemeMode } from '@/types';

const themes: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'p-2 rounded-md transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            theme === value
              ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          )}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === value}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
