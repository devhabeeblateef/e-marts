'use client';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbProps } from '@/types/breadcrumb';

export function Breadcrumb({selectedCategories}: BreadcrumbProps) {

  return (
    <nav 
      className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap"
      aria-label="Breadcrumb"
    >
        <button className="hover:text-gray-900 cursor-pointer focus:outline-none focus:underline">Home</button>
        <ChevronRight size={16} />
        <span aria-hidden="true"><ChevronRight size={16} /></span>
        <button className="hover:text-gray-900 cursor-pointer focus:outline-none focus:underline">Market</button>
        <ChevronRight size={16} />
        <span aria-hidden="true"><ChevronRight size={16} /></span>
        <button className="hover:text-gray-900 cursor-pointer focus:outline-none focus:underline">Search</button>
          <span aria-hidden="true"><ChevronRight size={16} /></span>
        <ChevronRight size={16} />
        <span className="text-gray-400">
          {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Mens-clothing'}
        </span>
    </nav>
  );
}
