import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Product,
  SHOP_CATEGORIES,
  ShopCategory,
  BlogPost,
} from '../data/pharmacyData';
import {
  MagnifyingGlass,
  X,
  ShoppingCart,
  ArrowRight,
  Check,
  CaretRight,
  ArrowBendDownLeft,
} from '@phosphor-icons/react';

interface LiveSearchPopoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigateToCategory: (category: ShopCategory) => void;
  onNavigateToBlog?: (blog: BlogPost) => void;
  onFullSearch: (query: string) => void;
  allProducts: Product[];
  allBlogPosts: BlogPost[];
}

const POPULAR_SEARCH_QUERIES = [
  { label: 'Cenart Forte', sub: 'Anti-Malarial' },
  { label: 'Hemosoft Iron', sub: 'Blood & Vitality' },
  { label: 'Zurion', sub: 'Multivitamins & Zinc' },
  { label: 'Cantab', sub: 'Blood Pressure' },
  { label: 'Ultrox', sub: 'Cholesterol' },
  { label: 'Artemether', sub: 'Active Ingredient' },
];

export const LiveSearchPopout: React.FC<LiveSearchPopoutProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  onNavigateToCategory,
  onNavigateToBlog,
  onFullSearch,
  allProducts,
  allBlogPosts,
}) => {
  const [query, setQuery] = useState('');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input whenever pop-out opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products live
  const matchingProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.activeIngredients.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.classification.toLowerCase().includes(q) ||
        p.dosage.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  // Filter categories live
  const matchingCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SHOP_CATEGORIES.filter(
      (cat) => cat !== 'All Products' && cat.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [query]);

  // Filter blog posts live
  const matchingBlogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allBlogPosts
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q)
      )
      .slice(0, 2);
  }, [query, allBlogPosts]);

  const handleItemAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onFullSearch(query.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live Search Catalog"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Dimmed backdrop with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="min-h-full flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-200 animate-in fade-in slide-in-from-top-4"
        >
          {/* Header Bar with Live Search Input */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-200 bg-white"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007A33] flex items-center justify-center shrink-0 border border-emerald-100">
              <MagnifyingGlass size={20} className="text-[#007A33]" aria-hidden="true" />
            </div>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicines, active ingredients, categories (e.g. Cenart, Iron, Zurion)..."
                className="w-full text-sm sm:text-base text-gray-900 placeholder-gray-400 font-medium bg-transparent border-none outline-none focus:ring-0 pr-8"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search input"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Quick Actions / Keys */}
            <div className="flex items-center gap-2 shrink-0">
              {query.trim() && (
                <button
                  type="submit"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <span>Search</span>
                  <ArrowBendDownLeft size={14} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search dialog"
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* Results or Idle Suggestions Area */}
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-100">
            {/* 1. IDLE STATE: No Query Typed */}
            {!query.trim() && (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Popular searches */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCH_QUERIES.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setQuery(item.label);
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-gray-200 text-xs text-gray-700 hover:text-[#007A33] transition-all cursor-pointer group"
                      >
                        <MagnifyingGlass size={12} className="text-gray-400 group-hover:text-[#007A33]" aria-hidden="true" />
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[10px] text-gray-400 group-hover:text-emerald-700">
                          ({item.sub})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Browse By Health Need
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Anti-Malarial',
                      'Hematinics (Iron Supplements)',
                      'Immune System (Multivitamins)',
                      'Blood Pressure Management',
                      'Cholesterol Management',
                      'Cold Treatment',
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          onNavigateToCategory(cat as ShopCategory);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-gray-100 text-left text-xs font-semibold text-gray-700 hover:text-[#007A33] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <span className="truncate">{cat}</span>
                        <CaretRight size={14} className="text-gray-400 group-hover:text-[#007A33] shrink-0" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assurance Note */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                  <span>
                    All formulations are 100% genuine and verified by the FDA Ghana & Pharmacy Council.
                  </span>
                </div>
              </div>
            )}

            {/* 2. LIVE RESULTS STATE: Matching Products */}
            {query.trim() && matchingProducts.length > 0 && (
              <div className="p-3 sm:p-5">
                <div className="flex items-center justify-between px-2 pb-3 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900">
                      {matchingProducts.length}
                    </span>{' '}
                    {matchingProducts.length === 1 ? 'Formulation' : 'Formulations'} matched
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onFullSearch(query);
                      onClose();
                    }}
                    className="text-[#007A33] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all in Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {matchingProducts.map((product) => {
                    const isAdded = !!addedMap[product.id];
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="p-3 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between gap-3 group bg-white shadow-2xs hover:shadow-xs"
                      >
                        {/* Thumbnail & Info */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="font-heading font-bold text-sm text-gray-900 group-hover:text-[#007A33] transition-colors truncate">
                                {product.name}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                  product.classification === 'Prescription'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-emerald-50 text-[#007A33] border border-emerald-200'
                                }`}
                              >
                                {product.classification}
                              </span>
                              {product.badge && (
                                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded-full font-bold">
                                  {product.badge}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-500 truncate">
                              <span className="font-medium text-gray-700">Active:</span>{' '}
                              {product.activeIngredients}
                            </p>

                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                              <span>{product.category}</span>
                              <span>·</span>
                              <span>{product.packSize}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-heading font-black text-sm sm:text-base text-gray-900">
                              GH₵ {product.price.toFixed(2)}
                            </div>
                            {product.originalPrice && (
                              <div className="text-[10px] text-gray-400 line-through">
                                GH₵ {product.originalPrice.toFixed(2)}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleItemAddToCart(e, product)}
                            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                              isAdded
                                ? 'bg-[#007A33] text-white'
                                : 'bg-gray-100 hover:bg-[#007A33] hover:text-white text-gray-700'
                            }`}
                            title="Add to cart"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={16} weight="bold" className="text-white" aria-hidden="true" />
                                <span className="hidden sm:inline">Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={16} aria-hidden="true" />
                                <span className="hidden sm:inline">Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matching Categories section if query matches any */}
            {query.trim() && matchingCategories.length > 0 && (
              <div className="p-3 sm:p-5 bg-gray-50/60">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Matching Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onNavigateToCategory(cat);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#007A33] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{cat}</span>
                      <ArrowRight size={12} className="text-gray-400" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Blog Articles if any */}
            {query.trim() && matchingBlogs.length > 0 && onNavigateToBlog && (
              <div className="p-3 sm:p-5 bg-gray-50/60">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Health Blog Articles
                </div>
                <div className="space-y-2">
                  {matchingBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      onClick={() => {
                        onNavigateToBlog(blog);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-gray-900 truncate">
                          {blog.title}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {blog.summary}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#007A33] shrink-0">
                        Read
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. NO RESULTS STATE */}
            {query.trim() &&
              matchingProducts.length === 0 &&
              matchingCategories.length === 0 &&
              matchingBlogs.length === 0 && (
                <div className="p-8 sm:p-12 text-center space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-gray-900">
                      No formulations found for &ldquo;{query}&rdquo;
                    </h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
                      We couldn&rsquo;t find an exact match. Try searching by generic active ingredient (e.g. Artemether, Ferrous, Zinc) or browse all 17 registered pharmaceuticals.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToCategory('All Products');
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Browse All 17 Formulations
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}
          </div>

          {/* Footer Bar with Helpful info & CTA */}
          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span>Press Escape to close</span>
              <span>•</span>
              <span>Press Enter for full search</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onNavigateToCategory('All Products');
                onClose();
              }}
              className="text-[#007A33] hover:text-[#005A25] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Explore All Products</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
