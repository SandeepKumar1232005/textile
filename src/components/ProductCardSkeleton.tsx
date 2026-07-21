import React from 'react';

interface ProductCardSkeletonProps {
  count?: number;
  columns?: string;
  layout?: 'grid' | 'carousel';
}

export function ProductCardSkeleton({ count = 4, columns = 'grid-cols-2 md:grid-cols-4', layout = 'grid' }: ProductCardSkeletonProps) {
  return (
    <div className={`${layout === 'grid' ? `grid ${columns} gap-3 md:gap-8` : columns} animate-pulse`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={`flex flex-col ${layout === 'carousel' ? 'shrink-0 w-[calc(85vw-1rem)] sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)]' : ''}`}
        >
          <div className="aspect-[4/5] bg-gray-100 border border-[#EAEAEA] rounded-lg md:rounded-none mb-3 md:mb-4" />
          <div className="px-0.5 md:px-0 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
