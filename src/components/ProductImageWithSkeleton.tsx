import React, { useState } from 'react';

interface ProductImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'aspect-4/3' | 'aspect-square' | 'aspect-16/9';
  objectFit?: 'object-cover' | 'object-contain';
}

// Guaranteed backup pharmacy product images if an Unsplash link is blocked or slow
const BACKUP_PHARMACY_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
];

export const ProductImageWithSkeleton: React.FC<ProductImageWithSkeletonProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-4/3',
  objectFit = 'object-cover',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  // If prop src changes, reset state
  React.useEffect(() => {
    setImgSrc(src);
    setLoaded(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < BACKUP_PHARMACY_IMAGES.length) {
      setImgSrc(BACKUP_PHARMACY_IMAGES[retryCount]);
      setRetryCount((prev) => prev + 1);
    }
  };

  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${aspectRatio} ${className}`}>
      {/* High-fidelity e-commerce Loading Skeleton Shimmer */}
      {!loaded && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-gray-300/40 animate-pulse" />
          </div>
        </div>
      )}

      {/* Actual Product Image - NEVER replaced by text description */}
      <img
        src={imgSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-300 ${objectFit} ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

