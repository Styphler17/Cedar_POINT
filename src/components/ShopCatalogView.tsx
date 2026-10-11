import React, { useState, useMemo } from 'react';
import {
  Product,
  SHOP_CATEGORIES,
  ShopCategory,
  PRODUCTS,
} from '../data/pharmacyData';
import { ProductCardVisual } from './ProductCardVisual';
import { BrandButton } from './BrandButton';
import {
  MagnifyingGlass,
  SlidersHorizontal,
  SquaresFour,
  List,
  Star,
  Plus,
  Check,
  CaretRight,
  ArrowsClockwise,
  ShoppingCart,
  X,
} from '@phosphor-icons/react';

interface ShopCatalogViewProps {
  selectedCategory: ShopCategory;
  onSelectCategory: (cat: ShopCategory) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenSwitchSave: () => void;
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
  products?: Product[];
}

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onOpenSwitchSave,
  initialSearchQuery,
  onClearInitialSearch,
  products,
}) => {
  const allProducts = products || PRODUCTS;
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  const [classificationFilter, setClassificationFilter] = useState<'All' | 'Prescription' | 'OTC' | 'Supplements'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Calculate product counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Products': allProducts.length };
    SHOP_CATEGORIES.forEach((cat) => {
      if (cat !== 'All Products') {
        counts[cat] = allProducts.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [allProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p) => {
      const matchCategory =
        selectedCategory === 'All Products' || p.category === selectedCategory;

      const matchClassification =
        classificationFilter === 'All' || p.classification === classificationFilter;

      const matchPrice = p.price <= maxPrice;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.activeIngredients.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

      return matchCategory && matchClassification && matchPrice && matchSearch;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, classificationFilter, maxPrice, searchQuery, sortBy]);

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p, 1);
    setAddedProductId(p.id);
    setTimeout(() => setAddedProductId(null), 1000);
  };

  const resetFilters = () => {
    onSelectCategory('All Products');
    setClassificationFilter('All');
    setMaxPrice(100);
    setSearchQuery('');
    setSortBy('featured');
    setMobileFilterOpen(false);
  };

  const renderFilterContent = () => (
    <div className="space-y-5">
      {/* Search within shop */}
      <div className="relative">
        <MagnifyingGlass size={16} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 shadow-xs"
        />
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <h3 className="font-heading text-xs font-bold text-gray-900 uppercase tracking-wider">
            Product Categories
          </h3>
          {selectedCategory !== 'All Products' && (
            <button
              onClick={() => onSelectCategory('All Products')}
              className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
          {SHOP_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = selectedCategory === cat;
            if (count === 0 && cat !== 'All Products') return null;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileFilterOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold border-l-3 border-[#007A33]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="truncate pr-2">{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono tabular-nums ${
                    isActive
                      ? 'bg-emerald-200/60 text-emerald-900 font-bold'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Classification Filter (Prescription, OTC, Supplements) */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
        <h3 className="font-heading text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
          Classification
        </h3>
        <div className="space-y-2">
          {(['All', 'OTC', 'Prescription', 'Supplements'] as const).map((cls) => (
            <label
              key={cls}
              className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer"
            >
              <input
                type="radio"
                name="classification"
                checked={classificationFilter === cls}
                onChange={() => {
                  setClassificationFilter(cls);
                }}
                className="accent-[#007A33] w-3.5 h-3.5 cursor-pointer"
              />
              <span>{cls === 'All' ? 'All Classes' : cls}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter Slider */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-heading text-xs font-bold text-gray-900 uppercase tracking-wider">
            Filter by Price
          </h3>
          <span className="text-xs font-bold text-emerald-800 tabular-nums">
            Up to GHS {maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          step="5"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#007A33] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
          <span>GHS 20</span>
          <span>GHS 100</span>
        </div>
      </div>

      {/* Reset All Filters Button */}
      <button
        type="button"
        onClick={resetFilters}
        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-100 text-xs font-semibold text-gray-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowsClockwise size={14} className="text-gray-400" aria-hidden="true" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
        <button
          onClick={() => onSelectCategory('All Products')}
          className="hover:text-emerald-700 transition-colors cursor-pointer"
        >
          Home
        </button>
        <CaretRight size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-gray-800">Pharmacy Shop</span>
        {selectedCategory !== 'All Products' && (
          <>
            <CaretRight size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
            <span className="text-emerald-800 font-semibold truncate max-w-[150px]">{selectedCategory}</span>
          </>
        )}
      </nav>

      {/* Shop Banner Callout */}
      <div
        className="rounded-2xl p-5 sm:p-8 text-white mb-6 sm:mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #007A33 0%, #004D21 100%)' }}
      >
        <div className="max-w-xl">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] sm:text-[11px] font-bold mb-2">
            Official Cedar Point Formulations
          </div>
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
            Cedar Point Chemist Formulary Catalog
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 leading-relaxed">
            Browse authentic medicines, vitamins, and healthcare solutions licensed by FDA Ghana. Delivered to your doorstep in Accra or available for in-store pickup at Abelemkpe.
          </p>
        </div>

        <BrandButton
          variant="dribbble"
          size="sm"
          onClick={onOpenSwitchSave}
          className="self-start md:self-auto shrink-0"
        >
          Compare Switch & Save (Up to 59%)
        </BrandButton>
      </div>

      {/* Main Layout: Sidebar & Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Sidebar on Desktop */}
        <aside className="hidden lg:block lg:col-span-3">
          {renderFilterContent()}
        </aside>

        {/* Mobile Filter Slide-Over Drawer */}
        {mobileFilterOpen && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          >
            <div
              className="w-[85vw] max-w-sm bg-[#F8F9FA] h-full shadow-2xl p-5 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <div className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <SlidersHorizontal size={16} className="text-[#007A33]" aria-hidden="true" />
                  <span>Filter Formulary</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close filter drawer"
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {renderFilterContent()}
            </div>
          </div>
        )}

        {/* Right Area: Catalog Header & Products List */}
        <section className="lg:col-span-9 space-y-4 sm:space-y-6">
          {/* Top Bar: Results count, sorting, view switcher */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            {/* Mobile Filter Trigger Button */}
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-none py-2 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal size={14} className="text-[#007A33]" aria-hidden="true" />
                <span>Filters & Categories</span>
                {selectedCategory !== 'All Products' && (
                  <span className="w-2 h-2 rounded-full bg-[#007A33]" />
                )}
              </button>

              <div className="text-xs text-gray-600 whitespace-nowrap">
                <span className="font-bold text-gray-900">{filteredProducts.length}</span> items
                {selectedCategory !== 'All Products' && (
                  <span className="hidden sm:inline"> in <strong className="text-emerald-800">{selectedCategory}</strong></span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 justify-between sm:justify-end">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View toggle (Grid / List) */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                  className={`p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-400'
                  }`}
                >
                  <SquaresFour size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                  className={`p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-400'
                  }`}
                >
                  <List size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'All Products' || classificationFilter !== 'All' || maxPrice < 100 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-400 text-[11px]">Filters:</span>
              {selectedCategory !== 'All Products' && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1 text-[11px]">
                  {selectedCategory}
                  <button onClick={() => onSelectCategory('All Products')} className="hover:text-emerald-950 font-bold ml-0.5 cursor-pointer">×</button>
                </span>
              )}
              {classificationFilter !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-800 font-medium flex items-center gap-1 text-[11px]">
                  {classificationFilter}
                  <button onClick={() => setClassificationFilter('All')} className="hover:text-black font-bold ml-0.5 cursor-pointer">×</button>
                </span>
              )}
              {maxPrice < 100 && (
                <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-800 font-medium flex items-center gap-1 text-[11px]">
                  ≤ GHS {maxPrice}
                  <button onClick={() => setMaxPrice(100)} className="hover:text-black font-bold ml-0.5 cursor-pointer">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-800 font-medium flex items-center gap-1 text-[11px]">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-black font-bold ml-0.5 cursor-pointer">×</button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-emerald-800 hover:underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid / List (2-column on mobile, 3-column on lg) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
              <SlidersHorizontal className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <div className="font-heading font-bold text-gray-800 text-base">
                No products found in this selection
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No items match your active filters. Try broadening your category or resetting the price range.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-[#007A33] text-white text-xs font-bold hover:bg-[#005A25] transition-colors cursor-pointer"
              >
                View All Formulations
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product) => {
                const isAdded = addedProductId === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-600 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <div>
                      {/* Product Visual */}
                      <ProductCardVisual product={product} size="sm" />

                      {/* Info */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 mb-1">
                          <span className="font-semibold text-emerald-800 truncate">
                            {product.category}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-gray-800 shrink-0">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            {product.rating.toFixed(1)}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-xs sm:text-sm text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1.5 sm:pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-heading font-bold text-xs sm:text-base text-gray-900 tabular-nums">
                            GHS {product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through tabular-nums">
                              GHS {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.badge ? (
                          <div className="text-[9px] font-bold text-emerald-800">
                            {product.badge}
                          </div>
                        ) : product.referencePrice ? (
                          <div className="text-[9px] sm:text-[10px] text-gray-400 line-through">
                            Ref: GHS {product.referencePrice.toFixed(2)}
                          </div>
                        ) : null}
                      </div>

                      {!product.inStock ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                          Quarantined
                        </span>
                      ) : (
                        <BrandButton
                          variant={isAdded ? 'dark' : 'primary'}
                          size="sm"
                          icon={isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          onClick={(e) => handleAdd(product, e)}
                        >
                          {isAdded ? 'Added' : 'Add'}
                        </BrandButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const isAdded = addedProductId === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-600 transition-all p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between cursor-pointer shadow-xs"
                  >
                    <div className="w-full sm:w-40 shrink-0">
                      <ProductCardVisual product={product} size="sm" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <span className="font-semibold text-emerald-800">{product.category}</span>
                        <span>·</span>
                        <span>{product.classification}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-gray-700">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {product.rating.toFixed(1)}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-800 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="text-[10px] sm:text-[11px] text-gray-500 mt-1.5 font-mono">
                        Active: {product.activeIngredients}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span className="font-heading font-bold text-sm sm:text-lg text-gray-900 tabular-nums">
                            GHS {product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through tabular-nums">
                              GHS {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.badge ? (
                          <div className="text-[10px] font-bold text-emerald-800 sm:text-right">
                            {product.badge}
                          </div>
                        ) : product.referencePrice ? (
                          <div className="text-[10px] sm:text-xs text-emerald-800 font-semibold">
                            Save GHS {(product.referencePrice - product.price).toFixed(2)}
                          </div>
                        ) : null}
                      </div>

                      {!product.inStock ? (
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                          Batch Quarantined
                        </span>
                      ) : (
                        <BrandButton
                          variant={isAdded ? 'dark' : 'primary'}
                          size="sm"
                          icon={isAdded ? <Check size={16} aria-hidden="true" /> : <ShoppingCart size={16} aria-hidden="true" />}
                          onClick={(e) => handleAdd(product, e)}
                        >
                          {isAdded ? 'Added' : 'Add to Cart'}
                        </BrandButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
