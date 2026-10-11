import React, { useState } from 'react';
import { Product } from '../data/pharmacyData';
import { ProductImageWithSkeleton } from './ProductImageWithSkeleton';
import { BrandButton } from './BrandButton';
import { X, Star, Check, Plus, Minus, ShoppingCart } from '@phosphor-icons/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset index and quantity when a different product opens
  React.useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setShowAdded(false);
  }, [product?.id]);

  if (!product) return null;

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentImage = imagesList[activeImageIndex] || product.image;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1200);
  };

  const savingsPercent =
    product.referencePrice && product.referencePrice > product.price
      ? Math.round(((product.referencePrice - product.price) / product.referencePrice) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-gray-100 text-gray-700 flex items-center justify-center border border-gray-200 transition-colors shadow-xs cursor-pointer"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto flex-1">
          {/* Left Column: Product Gallery & Thumbnails */}
          <div className="md:col-span-5 bg-gray-50/80 p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
            <div>
              {/* Main Active Image with Skeleton */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs mb-3 relative group">
                <ProductImageWithSkeleton
                  src={currentImage}
                  alt={`${product.name} - View ${activeImageIndex + 1}`}
                  aspectRatio="aspect-4/3"
                  objectFit="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {activeImageIndex + 1} / {imagesList.length}
                </div>
              </div>

              {/* Interactive Thumbnail Selector Gallery */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2 mb-4">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#007A33] ring-2 ring-emerald-100 shadow-xs'
                          : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = product.image;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Pack details */}
              <div className="space-y-2 text-xs text-gray-600 bg-white p-3.5 rounded-xl border border-gray-200">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Presentation</span>
                  <span className="font-semibold text-gray-900">{product.packSize}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Classification</span>
                  <span className="font-semibold text-gray-900">{product.classification}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Standard</span>
                  <span className="font-semibold text-gray-900">WHO-GMP & FDA Certified</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-emerald-800">In Stock at Abelemkpe</span>
                </div>
              </div>
            </div>

            {savingsPercent > 0 && product.referenceBrand && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                <div className="font-bold text-emerald-900">
                  Switch & Save {savingsPercent}%
                </div>
                <div className="text-gray-600 mt-0.5 text-[11px] leading-relaxed">
                  Bioequivalent alternative to {product.referenceBrand} (GHS {product.referencePrice?.toFixed(2)}).
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Clinical Information & Add to Bag */}
          <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="font-bold text-[#007A33]">{product.category}</span>
                <span>·</span>
                <div className="flex items-center gap-1 text-gray-800">
                  <Star size={14} weight="fill" className="text-amber-500" aria-hidden="true" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>

              {/* Price block */}
              <div className="mt-3 flex items-baseline gap-3 pb-4 border-b border-gray-100">
                <span className="text-2xl font-bold text-gray-900 font-heading tabular-nums">
                  GHS {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through tabular-nums">
                    GHS {product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Composition and Dosage */}
              <div className="mt-4 space-y-2.5">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-900 mb-1">
                    Active Pharmaceutical Ingredients
                  </div>
                  <div className="text-xs text-gray-700">{product.activeIngredients}</div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-900 mb-1">
                    Dosage & Directions
                  </div>
                  <div className="text-xs text-gray-700">{product.dosage}</div>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-950 mb-0.5">
                    Cedar Point Pharmacist Guidance
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    {product.pharmacistAdvice}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart CTA */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
              {!product.inStock ? (
                <div className="flex-1 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
                  Medication Batch Quarantined from Public Storefront
                </div>
              ) : (
                <>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Reduce quantity"
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-gray-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>

                  <BrandButton
                    variant={showAdded ? 'accent' : 'primary'}
                    size="md"
                    onClick={handleAdd}
                    icon={showAdded ? <Check size={16} weight="bold" className="text-emerald-700" aria-hidden="true" /> : <ShoppingCart size={16} aria-hidden="true" />}
                    className="flex-1"
                  >
                    {showAdded ? 'Added to Cart' : `Add to Cart · GHS ${(product.price * quantity).toFixed(2)}`}
                  </BrandButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
