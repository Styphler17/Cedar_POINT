import React, { useState, useMemo, useEffect } from 'react';
import { BlogPost, Product, BLOG_POSTS, SITE_IDENTITY } from '../data/pharmacyData';
import { BlogPostCard } from './BlogPostCard';
import {
  MagnifyingGlass,
  Phone,
  ArrowRight,
  BookOpen,
} from '@phosphor-icons/react';

interface BlogPageViewProps {
  onSelectPost: (post: BlogPost) => void;
  onNavigateToShop: () => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const BlogPageView: React.FC<BlogPageViewProps> = ({
  onSelectPost,
  onNavigateToShop,
  activeCategory = 'All',
  onCategoryChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync when activeCategory prop changes
  useEffect(() => {
    if (activeCategory) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (onCategoryChange) onCategoryChange(cat);
  };

  // Collect unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
    return ['All', ...cats];
  }, []);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Hero Header Banner */}
      <div
        className="relative rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-sm"
        style={{ background: 'linear-gradient(135deg, #007A33 0%, #004D21 100%)' }}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
            <span>Cedar Point Clinical Health Bulletin</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Health Insights & Pharmaceutical Advice
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-2xl">
            Evidence-based medical advice, safe prescription practices, chronic care management, and disease prevention authored by our resident superintendent pharmacists in Accra.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
            <span>Pharmacist Reviewed</span>
            <span>·</span>
            <span>Ghana FDA Standards</span>
            <span>·</span>
            <span>Evidence Based</span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Live Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#007A33] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clinical topics..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007A33]/20 focus:border-[#007A33] transition-all"
          />
        </div>
      </div>

      {/* 3. Featured Article Highlight (when showing all and no search) */}
      {selectedCategory === 'All' && searchQuery.trim() === '' && featuredPost && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
              Featured Clinical Article
            </h2>
            <span className="text-xs text-gray-500 font-medium">Recommended for patients</span>
          </div>

          <BlogPostCard
            post={featuredPost}
            onClick={() => onSelectPost(featuredPost)}
            featured={true}
          />
        </div>
      )}

      {/* 4. All Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
            {selectedCategory === 'All' ? 'Latest Publications' : `${selectedCategory} Articles`}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Showing {filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8">
            <BookOpen size={36} className="text-gray-400 mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-heading font-bold text-base text-gray-900">No articles match your criteria</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Try adjusting your category filter or search keywords to discover relevant health advice.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#007A33] text-white text-xs font-semibold rounded-xl hover:bg-[#005A25] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onClick={() => onSelectPost(post)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Pharmacist Consultation Callout Strip */}
      <div className="rounded-3xl p-6 sm:p-8 bg-emerald-50/80 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#007A33] text-[11px] font-bold">
            Free Medication Counseling
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
            Have questions about your current prescription?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
            Our duty superintendent pharmacists are available daily at No 5 Malm Street, Abelemkpe to perform drug interaction checks, dosage verification, and generic cost-saving guidance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={`tel:${SITE_IDENTITY.contact.phone.replace(/[^0-9+]/g, '')}`}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Phone size={16} className="text-[#007A33]" aria-hidden="true" />
            Call Pharmacist
          </a>
          <button
            type="button"
            onClick={onNavigateToShop}
            className="px-5 py-2.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            Explore Formulations
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
