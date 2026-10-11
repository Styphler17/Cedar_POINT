import React, { useState, useEffect } from 'react';
import {
  BlogPost,
  Product,
  PRODUCTS,
  BLOG_POSTS,
  SITE_IDENTITY,
} from '../data/pharmacyData';
import {
  CaretRight,
  CaretLeft,
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  Check,
  Phone,
  Printer,
  Warning,
  Lightbulb,
  Question,
  ShoppingCart,
  ThumbsUp,
  ThumbsDown,
  Info,
  ShareNetwork,
  WhatsappLogo,
} from '@phosphor-icons/react';
import { BlogCard } from './BlogCard';

interface BlogDetailPageViewProps {
  post: BlogPost;
  onBackToBlog: () => void;
  onNavigateHome: () => void;
  onSelectCategory?: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogDetailPageView: React.FC<BlogDetailPageViewProps> = ({
  post,
  onBackToBlog,
  onNavigateHome,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onSelectPost,
}) => {
  // Reading progress indicator
  const [readingProgress, setReadingProgress] = useState(0);

  // Active hero gallery image
  const images = post.images && post.images.length > 0 ? post.images : [post.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Copied share link state
  const [copiedLink, setCopiedLink] = useState(false);

  // Feedback widget state
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  // Text size toggle
  const [isLargeText, setIsLargeText] = useState(false);

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset states when post changes
  useEffect(() => {
    setActiveImageIndex(0);
    setFeedbackGiven(null);
    setCopiedLink(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  // Handle copy share link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText?.(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Resolve relevant products
  const relevantProducts = (post.relatedProductIds && post.relatedProductIds.length > 0
    ? post.relatedProductIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
    : PRODUCTS.filter((p) => p.category === post.category || p.trending)
  ).slice(0, 3);

  // Resolve previous & next posts
  const currentIndex = BLOG_POSTS.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  // Other related posts for bottom recommendations
  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  // WhatsApp share link
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Read "${post.title}" on Cedar Point Chemist: ${window.location.href}`
  )}`;

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* 1. Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#007A33] z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* 2. Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-gray-200/80 sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Breadcrumb Links */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-gray-500 min-w-0">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#007A33] transition-colors font-medium flex items-center gap-1 cursor-pointer"
            >
              Home
            </button>
            <CaretRight size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
            <button
              onClick={onBackToBlog}
              className="hover:text-[#007A33] transition-colors font-medium cursor-pointer"
            >
              Health Blog
            </button>
            <CaretRight size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
            <button
              onClick={() => {
                onBackToBlog();
                if (onSelectCategory) onSelectCategory(post.category);
              }}
              className="hover:text-[#007A33] transition-colors font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer truncate max-w-[140px] sm:max-w-none"
            >
              {post.category}
            </button>
            <CaretRight size={14} className="text-gray-400 shrink-0 hidden sm:inline" aria-hidden="true" />
            <span className="text-gray-900 font-medium truncate max-w-[180px] sm:max-w-xs md:max-w-md hidden sm:inline">
              {post.title}
            </span>
          </nav>

          {/* Back to Blog Button */}
          <button
            onClick={onBackToBlog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer shrink-0 ml-auto sm:ml-0"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>All Articles</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 3. Article Header & Meta Section */}
        <header className="max-w-4xl mx-auto space-y-5 text-left">
          {/* Category & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#007A33]/10 text-[#007A33] border border-[#007A33]/20">
              {post.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Medically Verified
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-mono">
              <Clock size={14} aria-hidden="true" />
              {post.readTime}
            </span>
          </div>

          {/* Main H1 Title */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.18] tracking-tight">
            {post.title}
          </h1>

          {/* Editorial Subtitle / Summary */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-normal">
            {post.summary}
          </p>

          {/* Author & Verification Bar */}
          <div className="pt-4 border-t border-b border-gray-200 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                alt={post.author}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#007A33]/20 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-sm text-gray-900">
                    {post.author}
                  </span>
                  <span title="Verified Practitioner">
                    <Check size={14} weight="bold" className="text-[#007A33] shrink-0" aria-hidden="true" />
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {post.authorRole || 'Clinical Pharmacist'} · Cedar Point Chemist Clinical Desk
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                  <span>Published {post.date}</span>
                  {post.lastUpdated && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">Updated {post.lastUpdated}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social Share & Utility Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {/* WhatsApp Share */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <WhatsappLogo size={16} className="text-emerald-700" aria-hidden="true" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy Article Link"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check size={16} className="text-[#007A33]" aria-hidden="true" />
                    <span className="text-[#007A33]">Copied!</span>
                  </>
                ) : (
                  <>
                    <ShareNetwork size={16} className="text-gray-600" aria-hidden="true" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>

              {/* Text Size Toggle */}
              <button
                type="button"
                onClick={() => setIsLargeText(!isLargeText)}
                title="Toggle font size"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isLargeText
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                A{isLargeText ? '+' : ''}
              </button>

              {/* Print Button */}
              <button
                type="button"
                onClick={() => window.print()}
                title="Print Article"
                aria-label="Print Article"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer hidden md:inline-flex"
              >
                <Printer size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* 4. Hero Visual Container & Image Gallery */}
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-gray-900 aspect-16/9 md:aspect-21/9 max-h-[460px]">
            <img
              src={images[activeImageIndex]}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* In-Image Category Badge */}
            <div className="absolute bottom-4 left-4 sm:left-6 z-10 flex items-center gap-2">
              <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                {post.category}
              </span>
              <span className="bg-[#007A33]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                Cedar Point Chemist
              </span>
            </div>

            {/* Thumbnail Navigation Dots (when multiple images) */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 sm:right-6 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Image Caption & Credit */}
          <div className="text-[11px] text-gray-500 text-center italic">
            {post.imageCaption || `Clinical practice and pharmaceutical standards at Cedar Point Chemist, Abelemkpe, Accra.`}
          </div>
        </div>

        {/* 5. Main Content Grid (8 Columns Article + 4 Columns Clinical Sidebar) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Editorial Article Column */}
          <main className="lg:col-span-8 space-y-8">
            {/* Key Clinical Takeaways Executive Box */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-emerald-50/50 to-white border-2 border-emerald-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-emerald-950 uppercase tracking-wider">
                    Key Clinical Takeaways
                  </h3>
                  <p className="text-xs text-emerald-800/80">
                    Essential guidelines summarized by Cedar Point Chemist Clinical Advisory
                  </p>
                </div>
              </div>

              <ul className="space-y-3 pt-2">
                {post.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    <Check size={18} weight="bold" className="text-[#007A33] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="font-medium">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In-Depth Structured Sections or Prose Content */}
            <div className={`space-y-8 text-gray-800 leading-relaxed ${isLargeText ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
              {post.sections && post.sections.length > 0 ? (
                post.sections.map((section, sIdx) => (
                  <section key={section.id || sIdx} id={section.id} className="space-y-4 scroll-mt-28">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-2">
                      {section.heading}
                    </h2>

                    <div className="space-y-3 text-gray-700">
                      {section.paragraphs.map((para, pIdx) => (
                        <p key={pIdx} className="leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Section Callout / Clinical Pearl */}
                    {section.callout && (
                      <div
                        className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 my-4 ${
                          section.callout.type === 'warning'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                            : section.callout.type === 'tip'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        {section.callout.type === 'warning' ? (
                          <Warning size={18} className="text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                        ) : section.callout.type === 'tip' ? (
                          <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <Info size={18} className="text-[#007A33] shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                        <div className="space-y-1">
                          <h4 className="font-heading font-bold text-xs uppercase tracking-wider">
                            {section.callout.title}
                          </h4>
                          <p className="text-xs sm:text-sm leading-relaxed font-normal">
                            {section.callout.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                ))
              ) : (
                <div className="space-y-4">
                  {post.content.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Clinical FAQs Accordion / Cards */}
            {post.faq && post.faq.length > 0 && (
              <section className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Question size={20} className="text-[#007A33]" aria-hidden="true" />
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {post.faq.map((item, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-2xs space-y-2">
                      <h4 className="font-heading font-semibold text-sm text-gray-900">
                        {item.question}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Article Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 mr-1">
                  Topics:
                </span>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Feedback Widget: Was this helpful? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="font-heading font-bold text-xs sm:text-sm text-gray-900">
                  Was this health advice helpful?
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your feedback helps our clinical pharmacists improve patient guides.
                </p>
              </div>

              {feedbackGiven ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007A33] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <Check size={16} weight="bold" aria-hidden="true" />
                  <span>Thank you for your feedback!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven('yes')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-[#007A33] transition-colors cursor-pointer"
                  >
                    <ThumbsUp size={16} aria-hidden="true" />
                    <span>Yes, helpful</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven('no')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                  >
                    <ThumbsDown size={16} aria-hidden="true" />
                    <span>Could be better</span>
                  </button>
                </div>
              )}
            </div>

            {/* Medical Disclaimer Banner */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-[11px] sm:text-xs text-gray-500 space-y-1">
              <div className="font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Info size={16} className="text-gray-500" aria-hidden="true" />
                Medical Disclaimer & Editorial Policy
              </div>
              <p>
                The information provided in this publication is for educational purposes only and is not intended to substitute for formal clinical diagnosis, individualized prescription dispensing, or professional medical advice. Always consult a licensed physician or our duty superintendent pharmacist at No 5 Malm Street, Abelemkpe before starting or altering any pharmaceutical regimen.
              </p>
            </div>

            {/* Author Detailed Bio Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start gap-4">
              <img
                src={post.authorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
                alt={post.author}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#007A33]/30 shrink-0"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-heading font-bold text-base text-gray-900">
                    {post.author}
                  </h4>
                  <span className="text-[11px] font-bold bg-[#007A33]/10 text-[#007A33] px-2 py-0.5 rounded">
                    Author & Reviewer
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {post.authorBio || 'Clinical Pharmacist specializing in patient safety and rational drug use at Cedar Point Chemist, Abelemkpe, Accra.'}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={`tel:${SITE_IDENTITY.contact.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007A33] hover:underline"
                  >
                    <Phone size={14} aria-hidden="true" />
                    <span>Speak with our Pharmacist Desk</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Previous & Next Article Navigation */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <button
                  type="button"
                  onClick={() => onSelectPost(prevPost)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-[#007A33] bg-white transition-all text-left flex items-start gap-3 group cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <CaretLeft size={18} className="text-gray-400 group-hover:text-[#007A33] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Previous Article
                    </span>
                    <span className="font-heading font-semibold text-xs text-gray-900 group-hover:text-[#007A33] line-clamp-2 transition-colors">
                      {prevPost.title}
                    </span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextPost && (
                <button
                  type="button"
                  onClick={() => onSelectPost(nextPost)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-[#007A33] bg-white transition-all text-right flex items-start justify-end gap-3 group cursor-pointer shadow-2xs hover:shadow-xs ml-auto w-full"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Next Article
                    </span>
                    <span className="font-heading font-semibold text-xs text-gray-900 group-hover:text-[#007A33] line-clamp-2 transition-colors">
                      {nextPost.title}
                    </span>
                  </div>
                  <CaretRight size={18} className="text-gray-400 group-hover:text-[#007A33] shrink-0 mt-0.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </main>

          {/* Right Clinical Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* 1. On This Page (Table of Contents) */}
            {post.sections && post.sections.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3">
                <h4 className="font-heading text-xs font-bold text-gray-900 uppercase tracking-wider">
                  On This Page
                </h4>
                <nav className="space-y-1.5 text-xs">
                  {post.sections.map((section, idx) => (
                    <a
                      key={section.id || idx}
                      href={`#${section.id}`}
                      className="block text-gray-600 hover:text-[#007A33] hover:underline transition-colors py-1 truncate"
                    >
                      {section.heading}
                    </a>
                  ))}
                  {post.faq && post.faq.length > 0 && (
                    <a
                      href="#faqs"
                      className="block text-gray-600 hover:text-[#007A33] hover:underline transition-colors py-1"
                    >
                      Frequently Asked Questions
                    </a>
                  )}
                </nav>
              </div>
            )}

            {/* 2. Speak to Pharmacist on Duty (CTA) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#007A33] to-[#004D21] text-white shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Duty Pharmacist Consult
                </span>
                <h4 className="font-heading text-base font-bold text-white mt-1">
                  Have questions about your prescription?
                </h4>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  Connect instantly with our superintendent clinical pharmacist on WhatsApp or call our dispensary desk.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href={`https://wa.me/233302737720?text=${encodeURIComponent(`Hello Cedar Point Chemist, I have a medication question regarding "${post.title}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-[#007A33] hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs"
                >
                  <WhatsappLogo size={18} className="text-[#007A33]" aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${SITE_IDENTITY.contact.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20"
                >
                  <Phone size={14} aria-hidden="true" />
                  <span>{SITE_IDENTITY.contact.phone}</span>
                </a>
              </div>

              <div className="text-[11px] text-emerald-200/90 pt-1 text-center">
                Dispensary open today until 9:00 PM
              </div>
            </div>

            {/* 3. Relevant Formulations & Products at Cedar Point */}
            {relevantProducts.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Recommended Formulations
                  </h4>
                  <span className="text-[11px] font-semibold text-[#007A33]">FDA Approved</span>
                </div>

                <div className="space-y-3">
                  {relevantProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl border border-gray-200 hover:border-[#007A33] transition-all bg-gray-50/50 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white p-0.5 border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="font-heading font-bold text-xs text-gray-900 hover:text-[#007A33] transition-colors truncate block text-left w-full cursor-pointer"
                          >
                            {product.name}
                          </button>
                          <div className="text-[11px] text-gray-500 truncate">
                            {product.dosage || product.category}
                          </div>
                          <div className="font-mono text-xs font-bold text-emerald-800 mt-0.5">
                            GHS {product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onAddToCart(product, 1)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-[#007A33] hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingCart size={14} aria-hidden="true" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="py-1.5 px-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Free Walk-in Checkup Callout */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-blue-950">
                <Check size={16} weight="bold" className="text-blue-600" aria-hidden="true" />
                Free Walk-In Health Screening
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Visit our dispensary at No 5 Malm Street, Abelemkpe for free Blood Pressure monitoring and BMI assessment.
              </p>
            </div>
          </aside>
        </div>

        {/* 6. Bottom "Related Articles" Recommendations */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-gray-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                  Related Health Articles
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Continue exploring trusted guidance from Cedar Point Chemist
                </p>
              </div>
              <button
                type="button"
                onClick={onBackToBlog}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#007A33] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              >
                <span>View All Articles</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {relatedPosts.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.id}
                  post={relatedPost}
                  onClick={() => onSelectPost(relatedPost)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
