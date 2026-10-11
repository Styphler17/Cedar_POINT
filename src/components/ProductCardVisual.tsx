import React from 'react';
import { Product } from '../data/pharmacyData';
import { ProductImageWithSkeleton } from './ProductImageWithSkeleton';

interface ProductCardVisualProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadges?: boolean;
}

export const ProductCardVisual: React.FC<ProductCardVisualProps> = ({
  product,
  className = '',
  size = 'md',
  showBadges = true,
}) => {
  const isSmall = size === 'sm';

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 ${className}`}>
      {/* Category Tag Overlay - only shown for medium and large cards */}
      {showBadges && !isSmall && (
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
          <span className="bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 shadow-xs border border-gray-200">
            {product.category}
          </span>
        </div>
      )}

      {/* Classification Tag Overlay */}
      {showBadges && (
        <div className={`absolute z-20 ${isSmall ? 'top-1.5 right-1.5' : 'top-2.5 right-2.5'}`}>
          <span className={`bg-emerald-900/90 text-white font-bold tracking-wider uppercase shadow-xs ${
            isSmall ? 'px-1.5 py-0.5 text-[8px] rounded' : 'px-2 py-0.5 text-[9px] rounded'
          }`}>
            {product.classification}
          </span>
        </div>
      )}

      {/* Real Product Image with Shimmer Loading Skeleton */}
      <div className="group-hover:scale-105 transition-transform duration-300">
        <ProductImageWithSkeleton
          src={product.image}
          alt={product.name}
          aspectRatio={isSmall ? "aspect-square" : "aspect-4/3"}
          objectFit="object-cover"
        />
      </div>

      {/* Subtle Bottom Trust Seal - only for medium and large cards */}
      {showBadges && !isSmall && (
        <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-semibold text-emerald-800 border border-emerald-100 shadow-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
          FDA Registered
        </div>
      )}
    </div>
  );
};
