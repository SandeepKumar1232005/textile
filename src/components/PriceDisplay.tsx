import React from 'react';
import { formatPrice } from '../lib/utils';

interface PriceDisplayProps {
  sellingPrice: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDiscountBadge?: boolean;
}

export function calculateDiscountPercentage(originalPrice?: number, sellingPrice?: number): number {
  if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice || originalPrice <= 0) {
    return 0;
  }
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
}

export function DiscountBadge({ 
  originalPrice, 
  sellingPrice, 
  className = '' 
}: { 
  originalPrice?: number; 
  sellingPrice: number; 
  className?: string;
}) {
  const discount = calculateDiscountPercentage(originalPrice, sellingPrice);
  if (discount <= 0) return null;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded-sm ${className}`}>
      {discount}% OFF
    </span>
  );
}

export function PriceDisplay({
  sellingPrice,
  originalPrice,
  size = 'md',
  className = '',
  showDiscountBadge = true,
}: PriceDisplayProps) {
  const hasDiscount = Boolean(originalPrice && originalPrice > sellingPrice);

  const sizeClasses = {
    sm: {
      selling: 'text-sm md:text-base font-bold',
      original: 'text-xs text-gray-400',
      container: 'gap-1.5 items-baseline',
    },
    md: {
      selling: 'text-base md:text-lg font-bold',
      original: 'text-xs md:text-sm text-gray-400',
      container: 'gap-2 items-baseline',
    },
    lg: {
      selling: 'text-2xl md:text-3xl font-bold',
      original: 'text-base md:text-lg text-gray-400',
      container: 'gap-3 items-baseline',
    },
  }[size];

  return (
    <div className={`flex flex-wrap items-center ${sizeClasses.container} ${className}`}>
      {hasDiscount && (
        <span className={`line-through ${sizeClasses.original}`}>
          {formatPrice(originalPrice!)}
        </span>
      )}
      <span className={`text-[#6E1F2B] ${sizeClasses.selling}`}>
        {formatPrice(sellingPrice)}
      </span>
      {hasDiscount && showDiscountBadge && (
        <DiscountBadge originalPrice={originalPrice} sellingPrice={sellingPrice} />
      )}
    </div>
  );
}
