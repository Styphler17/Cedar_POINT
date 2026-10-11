import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../data/pharmacyData';
import { ProductCardVisual } from './ProductCardVisual';
import { BrandButton } from './BrandButton';
import { CaretLeft, CaretRight, Star, Plus, Check } from '@phosphor-icons/react';

interface ProductCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  recentlyAddedId?: string | null;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  recentlyAddedId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Estimate active item index
      const itemWidth = clientWidth * 0.85;
      if (itemWidth > 0) {
        const index = Math.round(scrollLeft / itemWidth);
        setActiveIndex(Math.min(products.length - 1, Math.max(0, index)));
      }
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll, { passive: true });
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToSlide = (idx: number) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85 * idx;
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Mobile Touch Carousel (sm:hidden) */}
      <div className="block sm:hidden">
        {/* Navigation Arrows for Mobile */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-semibold text-gray-500">
            Swipe to explore ({products.length} formulations)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous product"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none shadow-xs transition-colors"
            >
              <CaretLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next product"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none shadow-xs transition-colors"
            >
              <CaretRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const isAdded = recentlyAddedId === product.id;
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="w-[82vw] shrink-0 snap-center bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between shadow-xs active:scale-[0.99] transition-transform"
              >
                <div>
                  <ProductCardVisual product={product} size="md" />

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                      <span className="font-semibold text-emerald-800 truncate max-w-[130px]">
                        {product.category}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-gray-800 font-bold">
                        <Star size={12} weight="fill" className="text-amber-500" aria-hidden="true" />
                        {product.rating.toFixed(1)}
                      </span>
                      {product.badge && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-sm text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="font-heading font-bold text-base text-gray-900 tabular-nums">
                      GHS {product.price.toFixed(2)}
                    </div>
                    {product.referencePrice && (
                      <div className="text-[10px] text-gray-400 line-through">
                        Ref: GHS {product.referencePrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <BrandButton
                    variant={isAdded ? 'dark' : 'primary'}
                    size="sm"
                    icon={isAdded ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product, 1);
                    }}
                  >
                    {isAdded ? 'Added' : 'Add'}
                  </BrandButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === i ? 'w-6 bg-[#007A33]' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop / Tablet Grid (sm:grid) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isAdded = recentlyAddedId === product.id;
          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-600 transition-all overflow-hidden flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md"
            >
              <div>
                <ProductCardVisual product={product} />

                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-emerald-800 truncate">
                      {product.category}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-gray-800 font-bold">
                      <Star size={12} weight="fill" className="text-amber-500" aria-hidden="true" />
                      {product.rating.toFixed(1)}
                    </span>
                    {product.badge && (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-sm text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold text-base text-gray-900 tabular-nums">
                    GHS {product.price.toFixed(2)}
                  </div>
                  {product.referencePrice && (
                    <div className="text-[10px] text-gray-400 line-through">
                      Ref: GHS {product.referencePrice.toFixed(2)}
                    </div>
                  )}
                </div>

                <BrandButton
                  variant={isAdded ? 'dark' : 'primary'}
                  size="sm"
                  icon={isAdded ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product, 1);
                  }}
                >
                  {isAdded ? 'Added' : 'Add'}
                </BrandButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
