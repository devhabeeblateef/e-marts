'use client';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({selectedCategories}: BreadcrumbProps) {

  return (
    <div>
      <div className="hidden sm:flex items-center gap-2 mb-4 sm:mb-6 text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
        <span className="hover:text-gray-900 cursor-pointer">Home</span>
        <ChevronRight size={16} />
        <span className="hover:text-gray-900 cursor-pointer">Market</span>
        <ChevronRight size={16} />
        <span className="hover:text-gray-900 cursor-pointer">Search</span>
        <ChevronRight size={16} />
        <span className="text-gray-400">
          {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Mens-clothing'}
        </span>
      </div>
    </div>
  );
}
