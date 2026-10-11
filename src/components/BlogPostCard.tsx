import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Clock, User, Sparkle } from '@phosphor-icons/react';
import { BlogPost } from '../data/pharmacyData';

export interface BlogPostCardProps {
  post: BlogPost;
  onClick: () => void;
  featured?: boolean;
  className?: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onClick,
  featured = false,
  className = '',
}) => {
  // Support multiple images for carousel: if post.images array exists use that, otherwise generate contextual images
  const images = (post as any).images && Array.isArray((post as any).images) && (post as any).images.length > 0
    ? (post as any).images as string[]
    : [
        post.image,
        post.id === 'choosing-right-pharmacy'
          ? 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600'
          : post.id === 'managing-bp-naturally'
          ? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600'
          : post.id === 'malaria-prevention-act'
          ? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600'
          : 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600',
        post.id === 'choosing-right-pharmacy'
          ? 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=600'
          : post.id === 'managing-bp-naturally'
          ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600'
          : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
      ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auto-play subtle carousel loop every 4.5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <article
      onClick={onClick}
      className={`group bg-white rounded-2xl border border-gray-200/90 hover:border-emerald-600 cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md flex flex-col md:flex-row overflow-hidden h-full ${
        featured ? 'ring-1 ring-[#007A33]/20' : ''
      } ${className}`}
    >
      {/* Left Column: Image Carousel with Pagination Dots Only */}
      <div className="md:w-5/12 lg:w-9/20 relative bg-gray-100 shrink-0 overflow-hidden flex flex-col justify-end min-h-[220px] md:min-h-full">
        <div className="absolute inset-0">
          <img
            src={images[activeImageIndex]}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle gradient overlay at bottom for dots contrast */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Category Pill Tag on Top Left of Image */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/95 text-[#007A33] shadow-xs backdrop-blur-xs border border-white/40">
            {post.category}
          </span>
        </div>

        {/* Carousel Pagination Dots */}
        {images.length > 1 && (
          <div
            className="relative z-10 pb-3 flex items-center justify-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                aria-label={`Go to slide ${dotIdx + 1} of ${post.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(dotIdx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeImageIndex === dotIdx
                    ? 'w-5 h-2 bg-white shadow-sm'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between h-full">
        <div className="flex flex-col flex-1">
          {/* Metadata Row */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 mb-2.5">
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <Calendar size={13} className="text-[#007A33]" aria-hidden="true" />
              <span>{post.date}</span>
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <Clock size={13} className="text-[#007A33]" aria-hidden="true" />
              <span>{post.readTime}</span>
            </span>
          </div>

          {/* Title - Standardized height slot to prevent row misalignment */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 group-hover:text-[#007A33] transition-colors leading-snug line-clamp-2 min-h-[2.75rem] sm:min-h-[3.25rem] flex items-start">
            {post.title}
          </h3>

          {/* Summary - Standardized height slot */}
          <p className="text-xs sm:text-[13px] text-gray-600 mt-2 leading-relaxed line-clamp-3 min-h-[3.6rem] sm:min-h-[3.9rem] flex items-start">
            {post.summary}
          </p>

          {/* Key clinical takeaway preview - Standardized height and layout */}
          {post.takeaways && post.takeaways.length > 0 && (
            <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100/90 flex flex-col justify-center min-h-[4.75rem]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#007A33] uppercase tracking-wider mb-1">
                <Sparkle size={12} weight="fill" className="text-[#007A33] shrink-0" aria-hidden="true" />
                <span>Key Insight</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed line-clamp-2">
                "{post.takeaways[0]}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Meta & Action */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 truncate pr-2">
            <User size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
            <span className="truncate font-medium">{post.author}</span>
          </div>

          <span className="inline-flex items-center gap-1 font-semibold text-[#007A33] group-hover:translate-x-0.5 transition-transform shrink-0">
            Read Article
            <ArrowRight size={13} weight="bold" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
};

// Also export as BlogCard for backward compatibility
export const BlogCard = BlogPostCard;
export default BlogPostCard;
