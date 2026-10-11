import React, { useState, useEffect } from 'react';
import {
  SITE_IDENTITY,
  PRODUCTS,
  HEALTH_BUNDLES,
  BLOG_POSTS,
  SHOP_CATEGORIES,
  ShopCategory,
  Product,
  BlogPost,
} from './data/pharmacyData';
import { BrandLogo } from './components/BrandLogo';
import { BrandButton } from './components/BrandButton';
import { ProductImageWithSkeleton } from './components/ProductImageWithSkeleton';
import { ProductCardVisual } from './components/ProductCardVisual';
import { ProductCarousel } from './components/ProductCarousel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { SwitchSaveModal } from './components/SwitchSaveModal';
import { WholesaleModal } from './components/WholesaleModal';
import { ShopCatalogView } from './components/ShopCatalogView';
import { AboutPageView } from './components/AboutPageView';
import { PartnershipsPageView } from './components/PartnershipsPageView';
import { CareerPageView } from './components/CareerPageView';
import { WholesalePageView } from './components/WholesalePageView';
import { BlogPageView } from './components/BlogPageView';
import { BlogDetailPageView } from './components/BlogDetailPageView';
import { BlogCard } from './components/BlogCard';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { LiveSearchPopout } from './components/LiveSearchPopout';
import { TrackOrderModal } from './components/TrackOrderModal';
import { PatientProfileModal } from './components/PatientProfileModal';
import { PatientFAQSection } from './components/PatientFAQSection';
import { AdminPortalView } from './components/AdminPortalView';
import { getStorefrontProducts } from './data/backendAdminData';
import { loadUserOrders, saveUserOrders, RecentOrderItem, OrderStage } from './data/patientProfileData';
import {
  MagnifyingGlass,
  ShoppingCart,
  User,
  Phone,
  Envelope,
  MapPin,
  CaretDown,
  Check,
  ArrowRight,
  List,
  House,
  Buildings,
  Package,
  ArrowUp,
  Pill,
  Truck,
} from '@phosphor-icons/react';

export type ViewType = 'home' | 'shop' | 'about' | 'partnerships' | 'career' | 'wholesale' | 'blog' | 'blog-detail' | 'admin';

export default function App() {
  // Navigation View State: 'home' | 'shop' | 'about' | 'partnerships' | 'career' | 'wholesale' | 'blog' | 'blog-detail'
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedShopCategory, setSelectedShopCategory] = useState<ShopCategory>('All Products');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<string>('All');

  // URL Hash synchronization so every page shows cleanly and supports direct URL navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'shop' || hash === 'products') {
        setCurrentView('shop');
      } else if (hash === 'about' || hash === 'company') {
        setCurrentView('about');
      } else if (hash === 'partnerships') {
        setCurrentView('partnerships');
      } else if (hash === 'career' || hash === 'careers') {
        setCurrentView('career');
      } else if (hash === 'wholesale' || hash === 'wholesale-retail') {
        setCurrentView('wholesale');
      } else if (hash.startsWith('blog/') || hash.startsWith('article/')) {
        const blogId = hash.replace(/^(blog|article)\//, '');
        const found = BLOG_POSTS.find((p) => p.id.toLowerCase() === blogId.toLowerCase());
        if (found) {
          setSelectedBlogPost(found);
          setCurrentView('blog-detail');
        } else {
          setCurrentView('blog');
        }
      } else if (hash === 'blog' || hash === 'articles' || hash === 'news') {
        setCurrentView('blog');
      } else if (hash === 'admin' || hash === 'portal' || hash === 'backend') {
        setCurrentView('admin');
      } else if (hash === 'home' || hash === '') {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Back-to-top button state: appears after scrolling down beyond the hero section
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero-section');
      if (heroEl) {
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        setShowBackToTop(heroBottom < 60);
      } else {
        // On pages without hero section, show after scrolling 350px
        setShowBackToTop(window.scrollY > 350);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSwitchSaveOpen, setIsSwitchSaveOpen] = useState(false);
  const [wholesaleModalOpen, setWholesaleModalOpen] = useState(false);
  const [wholesaleTab, setWholesaleTab] = useState<'wholesale' | 'consult'>('wholesale');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  const handleOpenTracking = (orderId?: string) => {
    setTrackingOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  // Patient Profile & Order History State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileDefaultTab, setProfileDefaultTab] = useState<'orders' | 'profile' | 'prescriptions'>('orders');
  const [userOrders, setUserOrders] = useState<RecentOrderItem[]>(loadUserOrders);
  const [storefrontProducts, setStorefrontProducts] = useState<Product[]>(() => getStorefrontProducts());

  useEffect(() => {
    const handleInvUpdate = () => {
      setStorefrontProducts(getStorefrontProducts());
    };
    window.addEventListener('cedar-point-inventory-updated', handleInvUpdate);
    return () => window.removeEventListener('cedar-point-inventory-updated', handleInvUpdate);
  }, []);

  const handleOrderPlaced = (newOrder: RecentOrderItem) => {
    setUserOrders((prev) => {
      const updated = [newOrder, ...prev];
      saveUserOrders(updated);
      return updated;
    });
  };

  const handleUpdateOrderStage = (orderId: string, newStage: OrderStage, note?: string) => {
    setUserOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.orderId === orderId) {
          const labels: Record<OrderStage, string> = {
            received: 'Order Confirmed & Queued',
            review: 'Pharmacist Clinical Review',
            dispensed: 'Dispensed & Cold-Chain Packed',
            transit: 'Out for Accra Express Delivery',
            delivered: 'Delivered & Signed',
          };
          return {
            ...order,
            stage: newStage,
            statusLabel: labels[newStage] || newStage,
          };
        }
        return order;
      });
      saveUserOrders(updated);
      return updated;
    });
  };

  // Global keyboard shortcut to open Live Search (Cmd+K, Ctrl+K, or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Nav dropdown states (desktop)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  // Bundles tab
  const [activeBundleTab, setActiveBundleTab] = useState<'For The Family' | 'For Graceful Aging' | 'Cost Conscious'>('For The Family');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: PRODUCTS[2], quantity: 1 }, // Zurion preloaded for testing
  ]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  // Cart functions
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1000);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => setCartItems([]);

  // Navigation helper with URL hash update
  const navigateTo = (view: ViewType, category?: ShopCategory, blogCategory?: string) => {
    if (category) setSelectedShopCategory(category);
    if (blogCategory) setSelectedBlogCategory(blogCategory);
    setCurrentView(view);
    setShopDropdownOpen(false);
    setCompanyDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlogPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView('blog-detail');
    setShopDropdownOpen(false);
    setCompanyDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.hash = `blog/${post.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trending products for Home
  const trendingProducts = PRODUCTS.filter((p) => p.trending).slice(0, 4);

  // Active bundle resolution
  const currentBundle = HEALTH_BUNDLES.find((b) => b.tabLabel === activeBundleTab) || HEALTH_BUNDLES[0];
  const bundleProducts = currentBundle.includedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const bundleSubtotal = bundleProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscountedPrice = bundleSubtotal * (1 - currentBundle.discountPercent / 100);

  const handleAddBundle = () => {
    bundleProducts.forEach((p) => handleAddToCart(p, 1));
    setIsCartOpen(true);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'Immune Support': <Pill size={20} className="text-emerald-800" aria-hidden="true" />,
    'Pain Relief': <Pill size={20} className="text-emerald-800" aria-hidden="true" />,
    'Blood Pressure': <Pill size={20} className="text-emerald-800" aria-hidden="true" />,
    'Bone & Joint': <Pill size={20} className="text-emerald-800" aria-hidden="true" />,
    'Infections': <Pill size={20} className="text-emerald-800" aria-hidden="true" />,
    'Anti-Malarial': <Pill size={20} className="text-emerald-800" aria-hidden="true" />,
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSent(true);
      setNewsletterEmail('');
    }
  };

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B]">
        <AdminPortalView
          onBackToStorefront={() => navigateTo('home')}
          orders={userOrders}
          onUpdateOrderStage={handleUpdateOrderStage}
          onOpenTrackModal={(orderId) => handleOpenTracking(orderId)}
        />
        {/* Track Pharmacy Order Modal */}
        <TrackOrderModal
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          initialOrderId={trackingOrderId}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1A] pb-16 lg:pb-0">
      {/* 1. Header: Top Bar Contact Info & Socials */}
      <div className="bg-[#007A33] text-white text-[10px] sm:text-[11px] py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 truncate">
            <a
              href={`tel:${SITE_IDENTITY.contact.phone}`}
              className="flex items-center gap-1 hover:text-emerald-100 transition-colors shrink-0"
            >
              <Phone size={14} aria-hidden="true" />
              <span className="font-semibold">{SITE_IDENTITY.contact.phone}</span>
            </a>
            <span className="text-emerald-400 opacity-60 hidden sm:inline">|</span>
            <span className="text-emerald-100 truncate hidden md:inline">
              No 5 Malm Street, Abelemkpe Accra
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-1 hover:text-emerald-100 transition-colors cursor-pointer text-emerald-100 font-semibold"
              title="Dispensary Staff & Pharmacist Portal"
            >
              <Buildings size={13} aria-hidden="true" />
              <span>Staff Portal</span>
            </button>
            <span className="text-emerald-400 opacity-60">|</span>
            <button
              onClick={() => handleOpenTracking()}
              className="flex items-center gap-1.5 hover:text-emerald-100 transition-colors cursor-pointer text-emerald-100 font-semibold"
              title="Track medication fulfillment live"
            >
              <Truck size={13} aria-hidden="true" />
              <span>Track Order</span>
            </button>
            <span className="text-emerald-400 opacity-60">|</span>
            <span className="text-emerald-200 hidden lg:inline">
              Superintendent Pharmacist on Duty
            </span>
            <div className="flex items-center gap-2.5">
              {SITE_IDENTITY.socials.map((soc) => (
                <button
                  key={soc}
                  onClick={() => {
                    setWholesaleTab('consult');
                    setWholesaleModalOpen(true);
                  }}
                  className="hover:text-emerald-200 transition-colors cursor-pointer"
                >
                  {soc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Hamburger + Logo */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <List size={20} className="text-gray-800" aria-hidden="true" />
            </button>

            {/* Brand Logo - Responsive Brand Logo with fluid typography */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
              title="Cedar Point Chemist - Home"
            >
              <BrandLogo size="md" showText={true} />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-700">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#007A33] transition-colors py-2 cursor-pointer ${
                currentView === 'home' ? 'text-[#007A33] border-b-2 border-[#007A33]' : ''
              }`}
            >
              Home
            </button>

            {/* Shop Products with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => navigateTo('shop', 'All Products')}
                className={`flex items-center gap-1 hover:text-[#007A33] transition-colors py-2 cursor-pointer ${
                  currentView === 'shop' ? 'text-[#007A33] border-b-2 border-[#007A33]' : ''
                }`}
              >
                <span>Shop Products</span>
                <CaretDown size={14} className="text-gray-400" aria-hidden="true" />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Categories
                  </div>
                  <button
                    onClick={() => navigateTo('shop', 'All Products')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>All Products (17)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">All</span>
                  </button>
                  <button
                    onClick={() => navigateTo('shop', 'Anti-Malarial')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer"
                  >
                    Anti-Malarial (Cenart Forte)
                  </button>
                  <button
                    onClick={() => navigateTo('shop', 'Hematinics (Iron Supplements)')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer"
                  >
                    Hematinics (Hemosoft Softgels)
                  </button>
                  <button
                    onClick={() => navigateTo('shop', 'Immune System (Multivitamins)')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer"
                  >
                    Immune System (Zurion)
                  </button>
                  <button
                    onClick={() => navigateTo('shop', 'Blood Pressure Management')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer"
                  >
                    Blood Pressure Management (Cantab)
                  </button>
                  <button
                    onClick={() => navigateTo('shop', 'Cholesterol Management')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer"
                  >
                    Cholesterol Management (Ultrox)
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => navigateTo('shop', 'All Products')}
                    className="w-full px-3 py-2 text-left text-xs text-emerald-800 font-bold hover:bg-emerald-50 flex items-center justify-between cursor-pointer"
                  >
                    <span>Open Full Shop Catalog</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Company Dropdown: About Us, Partnerships, Career */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyDropdownOpen(true)}
              onMouseLeave={() => setCompanyDropdownOpen(false)}
            >
              <button
                onClick={() => setCompanyDropdownOpen((o) => !o)}
                className={`flex items-center gap-1 hover:text-[#007A33] transition-colors py-2 cursor-pointer ${
                  ['about', 'partnerships', 'career'].includes(currentView)
                    ? 'text-[#007A33] border-b-2 border-[#007A33]'
                    : ''
                }`}
              >
                <span>Company</span>
                <CaretDown size={14} className="text-gray-400" aria-hidden="true" />
              </button>

              {companyDropdownOpen && (
                <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Corporate
                  </div>
                  <button
                    onClick={() => navigateTo('about')}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer ${
                      currentView === 'about' ? 'text-[#007A33] bg-emerald-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>About Us</span>
                    <span className="text-[10px] text-gray-400">Our Story</span>
                  </button>
                  <button
                    onClick={() => navigateTo('partnerships')}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer ${
                      currentView === 'partnerships' ? 'text-[#007A33] bg-emerald-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>Partnerships</span>
                    <span className="text-[10px] text-gray-400">Alliances</span>
                  </button>
                  <button
                    onClick={() => navigateTo('career')}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer ${
                      currentView === 'career' ? 'text-[#007A33] bg-emerald-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>Career</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">Hiring</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wholesale & Retail Dedicated Page */}
            <button
              onClick={() => navigateTo('wholesale')}
              className={`hover:text-[#007A33] transition-colors py-2 cursor-pointer ${
                currentView === 'wholesale' ? 'text-[#007A33] border-b-2 border-[#007A33]' : ''
              }`}
            >
              Wholesale & Retail
            </button>

            {/* Health Blog Dedicated Page */}
            <button
              onClick={() => navigateTo('blog')}
              className={`hover:text-[#007A33] transition-colors py-2 cursor-pointer ${
                currentView === 'blog' ? 'text-[#007A33] border-b-2 border-[#007A33]' : ''
              }`}
            >
              Health Blog
            </button>

            {/* Track Order Modal Trigger */}
            <button
              onClick={() => handleOpenTracking()}
              className="hover:text-[#007A33] transition-colors py-2 cursor-pointer flex items-center gap-1.5"
              title="Track medication fulfillment"
            >
              <Truck size={14} className="text-[#007A33]" aria-hidden="true" />
              <span>Track Order</span>
            </button>

            {/* Dispensary Staff Portal */}
            <button
              onClick={() => navigateTo('admin')}
              className="hover:text-[#007A33] transition-colors py-2 cursor-pointer flex items-center gap-1.5"
              title="Dispensary Staff & Pharmacist Management Portal"
            >
              <Buildings size={14} className="text-[#007A33]" aria-hidden="true" />
              <span>Staff Portal</span>
            </button>
          </nav>

          {/* Action Buttons: Search Modal Trigger, Cart, Profile, Track Order */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Track Order Quick Action Button */}
            <button
              type="button"
              onClick={() => handleOpenTracking()}
              aria-label="Track medication order"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#007A33] transition-colors cursor-pointer"
              title="Track Order Status"
            >
              <Truck size={17} aria-hidden="true" />
            </button>

            {/* Search Button (Opens Modal) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search medicines"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#007A33] transition-colors cursor-pointer"
              title="Search medicines"
            >
              <MagnifyingGlass size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                setProfileDefaultTab('orders');
                setIsProfileModalOpen(true);
              }}
              aria-label="Patient Profile & Recent Orders"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#007A33] transition-colors cursor-pointer"
              title="Patient Profile & Recent Orders"
            >
              <User size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open Cart (${totalCartCount} items)`}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ShoppingCart size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Page Breadcrumbs & Tab Bar for Instant Page Switching */}
      {currentView !== 'home' && (
        <div className="bg-emerald-900 text-white text-xs py-2 px-3 sm:px-6 lg:px-8 border-b border-emerald-950">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
              <button
                onClick={() => navigateTo('home')}
                className="text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="text-emerald-400">/</span>
              <span className="font-bold text-white capitalize">
                {currentView === 'shop'
                  ? 'Shop Formulary'
                  : currentView === 'about'
                  ? 'About Us'
                  : currentView === 'partnerships'
                  ? 'Partnerships'
                  : currentView === 'career'
                  ? 'Careers'
                  : 'Wholesale & Retail'}
              </span>
            </div>

            {/* Quick 1-click Page Switcher Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs overflow-x-auto">
              <span className="text-emerald-300 hidden md:inline">Jump to:</span>
              <button
                onClick={() => navigateTo('shop', 'All Products')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  currentView === 'shop' ? 'bg-white text-emerald-900 font-bold' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  currentView === 'about' ? 'bg-white text-emerald-900 font-bold' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                About
              </button>
              <button
                onClick={() => navigateTo('partnerships')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  currentView === 'partnerships' ? 'bg-white text-emerald-900 font-bold' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                Partnerships
              </button>
              <button
                onClick={() => navigateTo('career')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  currentView === 'career' ? 'bg-white text-emerald-900 font-bold' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                Career
              </button>
              <button
                onClick={() => navigateTo('wholesale')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  currentView === 'wholesale' ? 'bg-white text-emerald-900 font-bold' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                Wholesale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW: Dynamic Page Routing */}
      {currentView === 'shop' && (
        <main className="flex-1">
          <ShopCatalogView
            selectedCategory={selectedShopCategory}
            onSelectCategory={setSelectedShopCategory}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onOpenSwitchSave={() => setIsSwitchSaveOpen(true)}
            initialSearchQuery={shopSearchQuery}
            onClearInitialSearch={() => setShopSearchQuery('')}
            products={storefrontProducts}
          />
        </main>
      )}

      {currentView === 'about' && (
        <main className="flex-1">
          <AboutPageView
            onNavigateToShop={() => navigateTo('shop', 'All Products')}
            onNavigateToPartnerships={() => navigateTo('partnerships')}
            onNavigateToWholesale={() => navigateTo('wholesale')}
          />
        </main>
      )}

      {currentView === 'partnerships' && (
        <main className="flex-1">
          <PartnershipsPageView />
        </main>
      )}

      {currentView === 'career' && (
        <main className="flex-1">
          <CareerPageView />
        </main>
      )}

      {currentView === 'wholesale' && (
        <main className="flex-1">
          <WholesalePageView onNavigateToShop={() => navigateTo('shop', 'All Products')} />
        </main>
      )}

      {currentView === 'blog' && (
        <main className="flex-1">
          <BlogPageView
            onSelectPost={navigateToBlogPost}
            onNavigateToShop={() => navigateTo('shop', 'All Products')}
            activeCategory={selectedBlogCategory}
            onCategoryChange={(cat) => setSelectedBlogCategory(cat)}
          />
        </main>
      )}

      {currentView === 'blog-detail' && (
        <main className="flex-1">
          <BlogDetailPageView
            post={selectedBlogPost || BLOG_POSTS[0]}
            onBackToBlog={() => navigateTo('blog')}
            onNavigateHome={() => navigateTo('home')}
            onSelectCategory={(cat) => navigateTo('blog', undefined, cat)}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onAddToCart={handleAddToCart}
            onSelectPost={navigateToBlogPost}
          />
        </main>
      )}

      {currentView === 'home' && (
        /* HOME VIEW */
        <main className="flex-1">
          {/* 3. Hero Section */}
          <section id="hero-section" className="relative bg-white border-b border-gray-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-[#007A33] text-[11px] sm:text-xs font-bold border border-emerald-100">
                    <span>FDA Ghana Certified Pharmaceutical Care</span>
                  </div>

                  <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.18] tracking-tight">
                    {SITE_IDENTITY.tagline}
                  </h1>

                  <p className="text-xs sm:text-base text-gray-600 max-w-xl leading-relaxed">
                    {SITE_IDENTITY.subheadline}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                    <BrandButton
                      variant="primary"
                      size="md"
                      onClick={() => navigateTo('shop', 'All Products')}
                      className="w-full sm:w-auto"
                    >
                      Explore Pharmacy
                    </BrandButton>

                    <BrandButton
                      variant="dribbble"
                      size="md"
                      onClick={() => setIsSwitchSaveOpen(true)}
                      className="w-full sm:w-auto"
                    >
                      Compare Prices (Save up to 59%)
                    </BrandButton>
                  </div>

                  {/* Quantitative Stats */}
                  <div className="pt-6 sm:pt-8 border-t border-gray-100 grid grid-cols-3 gap-3 sm:gap-6">
                    {SITE_IDENTITY.stats.map((s) => (
                      <div key={s.label}>
                        <div className="font-heading font-black text-xl sm:text-3xl text-[#007A33] tabular-nums">
                          {s.value}
                        </div>
                        <div className="text-[11px] sm:text-xs text-gray-600 font-semibold mt-0.5">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Visual: Requested Dispensary Hero Image */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-gray-100 group">
                    <ProductImageWithSkeleton
                      src={SITE_IDENTITY.heroImage}
                      alt="Cedar Point Chemist Flagship Dispensary Interior in Accra"
                      aspectRatio="aspect-16/9"
                      className="w-full h-56 sm:h-72 lg:h-[390px]"
                      objectFit="object-cover"
                    />

                    {/* Floating Trust Card Overlay */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-md flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-emerald-100 text-[#007A33] flex items-center justify-center shrink-0">
                          <MapPin size={16} aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-gray-900 truncate">
                            No 5 Malm Street, Abelemkpe
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-gray-500 font-medium truncate">
                            Accra Dispensary · GA-165-4626
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 bg-emerald-50 text-[#007A33] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold border border-emerald-200">
                        Open Mon–Sat
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Category Grid: Shop by Health Need */}
          <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
              <h2 className="font-heading text-xl sm:text-3xl font-bold text-gray-900">
                Shop by Health Need
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Targeted therapeutic formulations prepared and approved under Ghana FDA standards.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { name: 'Immune Support', icon: 'Immune Support', color: '#E8F5E9', targetCat: 'Immune System (Multivitamins)' as ShopCategory },
                { name: 'Pain Relief', icon: 'Pain Relief', color: '#FFF3E0', targetCat: 'Pain' as ShopCategory },
                { name: 'Blood Pressure', icon: 'Blood Pressure', color: '#FFEBEE', targetCat: 'Blood Pressure Management' as ShopCategory },
                { name: 'Bone & Joint', icon: 'Bone & Joint', color: '#E3F2FD', targetCat: 'Bone, Muscle & Joint' as ShopCategory },
                { name: 'Infections', icon: 'Infections', color: '#F3E5F5', targetCat: 'Infections' as ShopCategory },
                { name: 'Anti-Malarial', icon: 'Anti-Malarial', color: '#E0F2F1', targetCat: 'Anti-Malarial' as ShopCategory },
              ].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => navigateTo('shop', c.targetCat)}
                  className="p-3.5 sm:p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-600 transition-all text-left flex flex-col justify-between group shadow-2xs hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                    {categoryIcons[c.icon]}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-gray-900 group-hover:text-emerald-800 transition-colors">
                      {c.name}
                    </h3>
                    <div className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 flex items-center gap-1 font-semibold text-emerald-800">
                      <span>Explore</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 5. Trending Products Section (CAROUSEL ON MOBILE, GRID ON DESKTOP) */}
          <section className="py-10 sm:py-14 bg-white border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#007A33] uppercase tracking-wider">
                    Most Prescribed & Dispensed
                  </div>
                  <h2 className="font-heading text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                    Trending Healthcare Solutions
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('shop', 'All Products')}
                  className="self-start sm:self-auto text-xs font-bold text-[#007A33] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All 17 Products</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>

              {/* Product Carousel on mobile, responsive grid on desktop */}
              <ProductCarousel
                products={trendingProducts}
                onSelectProduct={setSelectedProduct}
                onAddToCart={handleAddToCart}
                recentlyAddedId={recentlyAddedId}
              />
            </div>
          </section>

          {/* 6. Savings Banner: Switch & Save Up to 59% */}
          <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-3xl p-6 sm:p-12 text-white shadow-md relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #007A33 0%, #004D21 100%)' }}
            >
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-bold">
                  <span>Cedar Point Value Commitment</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-4xl font-black leading-tight">
                  Switch & Save Up to 59%
                </h2>

                <p className="text-xs sm:text-base text-emerald-100 leading-relaxed">
                  Get premium quality at better prices. Choose our recommended brands like Zurion and Hemosoft for your daily healthcare needs. Same active molecules, identical strength, verified bioequivalence.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <BrandButton
                    variant="dribbble"
                    size="md"
                    onClick={() => setIsSwitchSaveOpen(true)}
                  >
                    Compare & Calculate Savings
                  </BrandButton>

                  <span className="text-[11px] sm:text-xs text-emerald-200 text-center sm:text-left">
                    Trusted by 1M+ Ghanaian families & hospitals
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Bundles Section: Health Bundles Made For You */}
          <section className="py-10 sm:py-14 bg-white border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#007A33] uppercase tracking-wider">
                    Curated Care Kits
                  </div>
                  <h2 className="font-heading text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                    Health Bundles Made For You
                  </h2>
                </div>

                {/* Tabs */}
                <div className="inline-flex overflow-x-auto rounded-xl bg-gray-100 p-1 border border-gray-200 max-w-full">
                  {(['For The Family', 'For Graceful Aging', 'Cost Conscious'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveBundleTab(tab)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activeBundleTab === tab
                          ? 'bg-[#007A33] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bundle Card Display */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-gray-50 rounded-3xl p-5 sm:p-8 border border-gray-200">
                <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                  <div className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {currentBundle.tabLabel} Bundle
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                    {currentBundle.title}
                  </h3>
                  <div className="text-xs font-semibold text-gray-500">
                    {currentBundle.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {currentBundle.description}
                  </p>

                  <div className="p-3 rounded-xl bg-emerald-100/70 text-emerald-950 text-xs font-medium border border-emerald-200">
                    {currentBundle.highlightText}
                  </div>

                  <div className="pt-2 flex items-baseline gap-3">
                    <span className="font-heading text-xl sm:text-2xl font-black text-gray-900 tabular-nums">
                      GHS {bundleDiscountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 line-through tabular-nums">
                      GHS {bundleSubtotal.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      Save {currentBundle.discountPercent}%
                    </span>
                  </div>

                  <div className="pt-2">
                    <BrandButton
                      variant="primary"
                      size="md"
                      onClick={handleAddBundle}
                      className="w-full sm:w-auto"
                    >
                      Add Full Bundle to Cart
                    </BrandButton>
                  </div>
                </div>

                {/* Included Products: Elevated Kit Formulations Display */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/80">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#007A33] flex items-center justify-center">
                        <Package size={16} aria-hidden="true" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 tracking-wide">
                        {bundleProducts.length} Formulations in this Kit
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
                      Click any item to view clinical details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {bundleProducts.map((bp) => (
                      <div
                        key={bp.id}
                        onClick={() => setSelectedProduct(bp)}
                        className="p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-2xs"
                      >
                        {/* Generous, completely unobstructed product image */}
                        <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 flex items-center justify-center">
                          <ProductImageWithSkeleton
                            src={bp.image}
                            alt={bp.name}
                            aspectRatio="aspect-4/3"
                            objectFit="object-cover"
                            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Minimalist classification badge in corner */}
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <span className="bg-emerald-950/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                              {bp.classification}
                            </span>
                          </div>
                        </div>

                        {/* Product Labels & Metadata - Placed cleanly below the image */}
                        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 truncate max-w-[170px]">
                                {bp.category}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium shrink-0">
                                FDA Approved
                              </span>
                            </div>

                            <h4 className="font-heading font-bold text-xs sm:text-sm text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                              {bp.name}
                            </h4>

                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                              {bp.packSize}
                            </p>
                          </div>

                          <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-gray-400 font-medium">Standard Price</div>
                              <div className="text-xs sm:text-sm font-bold text-[#007A33] tabular-nums">
                                GHS {bp.price.toFixed(2)}
                              </div>
                            </div>

                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                              <Check size={14} className="text-[#007A33]" aria-hidden="true" />
                              In Kit
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Trust Indicators */}
          <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
              <h2 className="font-heading text-xl sm:text-3xl font-bold text-gray-900">
                Why Trust Cedar Point Chemist?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Pharmaceutical ethics, certified climate-controlled storage, and licensed counseling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  index: '01',
                  title: 'Pharmacist-Led Care',
                  description: 'Every prescription and OTC purchase backed by licensed clinical interaction reviews.',
                },
                {
                  index: '02',
                  title: 'Verified Cold-Chain',
                  description: 'Meeting rigorous national standards with continuous temperature-controlled storage (<25°C).',
                },
                {
                  index: '03',
                  title: 'Bioequivalent Quality',
                  description: 'Formulations prepared under WHO-GMP compliance, delivering proven therapeutic efficacy.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center shadow-xs"
                >
                  <div className="font-mono text-xs font-bold text-emerald-800 mb-2.5">
                    {item.index}
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Blog Section: Latest Articles with Left-Image Carousel Cards */}
          <section id="blog-section" className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#007A33] uppercase tracking-wider">
                    Health Bulletin
                  </div>
                  <h2 className="font-heading text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                    Latest Articles
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
                    Clinical advice and patient education prepared by our superintendent pharmacists for family wellness in Ghana.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('blog')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-[#007A33] border border-emerald-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>View All Articles</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
                {BLOG_POSTS.slice(0, 2).map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onClick={() => navigateToBlogPost(post)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 10. Patient FAQ Section: Trust, FDA Certification & Delivery Policies */}
          <PatientFAQSection
            onOpenConsult={() => {
              setWholesaleTab('consult');
              setWholesaleModalOpen(true);
            }}
            onOpenTracking={() => handleOpenTracking()}
          />

          {/* Quick Wholesale Callout Strip */}
          <section className="py-10 sm:py-12 bg-emerald-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
              <div className="max-w-2xl">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Wholesale Supply for Hospitals, Clinics & Pharmacies
                </h3>
                <p className="text-xs text-emerald-100 mt-1">
                  Volume discounts, consignment options, and nationwide dispatch from our Abelemkpe wholesale depot.
                </p>
              </div>

              <BrandButton
                variant="dribbble"
                size="md"
                onClick={() => navigateTo('wholesale')}
                className="w-full sm:w-auto shrink-0"
              >
                Explore Wholesale & Retail
              </BrandButton>
            </div>
          </section>
        </main>
      )}

      {/* 10. Footer */}
      <footer className="bg-[#007A33] text-white border-t border-[#006028] shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/20">
            {/* Column 1: About Us (1/4 equal width) */}
            <div className="w-full space-y-3.5">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="text-left cursor-pointer focus:outline-hidden"
                title="Cedar Point Chemist Ltd"
              >
                <BrandLogo size="md" inverted={true} showText={true} />
              </button>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Cedar Point Chemist empowers individuals through consistent, trustworthy healthcare solutions across Ghana. Quality in every dose, passion in every service.
              </p>
              <div className="text-[11px] text-emerald-200/80 pt-1 leading-normal border-t border-white/10">
                Licensed by the Pharmacy Council of Ghana & Food and Drugs Authority (FDA).
              </div>
            </div>

            {/* Column 2: Quick Links (1/4 equal width) */}
            <div className="w-full space-y-3.5">
              <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-emerald-100/90">
                <li>
                  <button
                    onClick={() => navigateTo('shop', 'All Products')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Products Catalog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('partnerships')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Partnerships
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('career')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Career Opportunities
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('wholesale')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Wholesale & Retail
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('blog')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Health Blog & Articles
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (currentView !== 'home') {
                        navigateTo('home');
                      }
                      setTimeout(() => {
                        document.getElementById('patient-faq')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Patient FAQ & Advisory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenTracking()}
                    className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 font-medium text-emerald-200 hover:text-white"
                  >
                    <Truck size={14} aria-hidden="true" />
                    <span>Track Order Status</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('admin')}
                    className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 font-semibold text-emerald-200 hover:text-white"
                  >
                    <Buildings size={14} aria-hidden="true" />
                    <span>Dispensary Staff Portal</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact (1/4 equal width) */}
            <div className="w-full space-y-3.5">
              <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                Contact
              </h4>
              <div className="space-y-2.5 text-xs text-emerald-100/90">
                <a
                  href={SITE_IDENTITY.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-white transition-colors group cursor-pointer"
                  title="View CEDAR POINT CHEMIST LTD on Google Maps"
                >
                  <MapPin size={16} className="text-emerald-200 shrink-0 mt-0.5 group-hover:text-white" aria-hidden="true" />
                  <span className="leading-relaxed underline-offset-2 group-hover:underline">{SITE_IDENTITY.contact.address}</span>
                </a>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-200 shrink-0" aria-hidden="true" />
                  <span className="font-mono">{SITE_IDENTITY.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Envelope size={16} className="text-emerald-200 shrink-0" aria-hidden="true" />
                  <span>{SITE_IDENTITY.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter (1/4 equal width) */}
            <div className="w-full space-y-3.5">
              <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                Stay Updated
              </h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Join our newsletter for health tips and exclusive product updates.
              </p>

              {newsletterSent ? (
                <div className="p-3 rounded-xl bg-white/15 border border-white/20 text-xs text-white font-medium">
                  Thank you! You are now subscribed to our health bulletin.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 px-3.5 py-2.5 text-xs bg-[#005B26] border border-emerald-600/70 rounded-xl text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#007A33] hover:text-[#005A25] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-100/75 text-center sm:text-left">
            <div>© 2026 Cedar Point Chemist Ltd. All rights reserved.</div>
            <div>GA-165-4626 · No 5 Malm Street, Abelemkpe Accra, Ghana</div>
          </div>
        </div>
      </footer>

      {/* Scroll-to-Top Floating Circular Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Return to top of page"
        title="Return to top"
        className={`
          fixed z-40 flex items-center justify-center
          w-11 h-11 sm:w-12 sm:h-12 rounded-full
          bg-[#007A33] hover:bg-[#005A25] active:scale-90 text-white
          shadow-lg hover:shadow-xl shadow-emerald-950/25
          border border-emerald-600/40
          transition-all duration-300 ease-out cursor-pointer group
          bottom-20 lg:bottom-6 right-4 sm:right-6
          ${showBackToTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
          }
        `}
      >
        <ArrowUp size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
      </button>

      {/* 11. MOBILE BOTTOM APP BAR (Fixed bottom for instant 1-tap navigation on all phones) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[#007A33] font-bold' : 'text-gray-500'
          }`}
        >
          <House size={20} aria-hidden="true" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('shop', 'All Products')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'shop' ? 'text-[#007A33] font-bold' : 'text-gray-500'
          }`}
        >
          <ShoppingCart size={20} aria-hidden="true" />
          <span className="text-[10px]">Shop</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('wholesale')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'wholesale' ? 'text-[#007A33] font-bold' : 'text-gray-500'
          }`}
        >
          <Package size={20} aria-hidden="true" />
          <span className="text-[10px]">Wholesale</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('about')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            ['about', 'partnerships', 'career'].includes(currentView) ? 'text-[#007A33] font-bold' : 'text-gray-500'
          }`}
        >
          <Buildings size={20} aria-hidden="true" />
          <span className="text-[10px]">About</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 p-1 text-gray-500 cursor-pointer"
        >
          <ShoppingCart size={20} className="text-[#007A33]" aria-hidden="true" />
          <span className="text-[10px] font-bold text-[#007A33]">Cart</span>
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#007A33] text-white text-[9px] font-bold flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenSwitchSave={() => setIsSwitchSaveOpen(true)}
        onOpenConsult={() => {
          setWholesaleTab('consult');
          setWholesaleModalOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTrackOrder={() => handleOpenTracking()}
        onOpenProfile={() => {
          setProfileDefaultTab('orders');
          setIsProfileModalOpen(true);
        }}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenTrackOrder={(orderId) => handleOpenTracking(orderId)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Track Pharmacy Order Modal */}
      <TrackOrderModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialOrderId={trackingOrderId}
      />

      {/* Patient Profile & Order History Modal */}
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        orders={userOrders}
        onTrackOrder={(orderId) => handleOpenTracking(orderId)}
        onConsultPharmacist={() => {
          setIsProfileModalOpen(false);
          setWholesaleTab('consult');
          setWholesaleModalOpen(true);
        }}
        defaultTab={profileDefaultTab}
      />

      <SwitchSaveModal
        isOpen={isSwitchSaveOpen}
        onClose={() => setIsSwitchSaveOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <WholesaleModal
        isOpen={wholesaleModalOpen}
        onClose={() => setWholesaleModalOpen(false)}
        defaultTab={wholesaleTab}
      />

      {/* Pop-Out Live Search Modal */}
      <LiveSearchPopout
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
        }}
        onAddToCart={handleAddToCart}
        onNavigateToCategory={(category) => {
          setShopSearchQuery('');
          navigateTo('shop', category);
        }}
        onNavigateToBlog={(blog) => {
          navigateToBlogPost(blog);
        }}
        onFullSearch={(query) => {
          setShopSearchQuery(query);
          navigateTo('shop', 'All Products');
        }}
        allProducts={storefrontProducts}
        allBlogPosts={BLOG_POSTS}
      />
    </div>
  );
}
