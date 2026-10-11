import React, { useState } from 'react';
import { ViewType } from '../App';
import { ShopCategory, SITE_IDENTITY } from '../data/pharmacyData';
import { BrandLogo } from './BrandLogo';
import {
  X,
  MagnifyingGlass,
  House,
  ShoppingCart,
  CaretDown,
  ArrowRight,
  Info,
  Users,
  Briefcase,
  Package,
  BookOpen,
  Percent,
  Phone,
  MapPin,
  Truck,
  User,
  Buildings,
} from '@phosphor-icons/react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  onNavigate: (view: ViewType, category?: ShopCategory) => void;
  onOpenSwitchSave: () => void;
  onOpenConsult: () => void;
  onOpenSearch?: () => void;
  onOpenTrackOrder?: () => void;
  onOpenProfile?: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenSwitchSave,
  onOpenConsult,
  onOpenSearch,
  onOpenTrackOrder,
  onOpenProfile,
}) => {
  const [shopExpanded, setShopExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[85vw] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header with Clean Brand Logo */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <BrandLogo size="md" showText={true} />

          <div className="flex items-center gap-1.5">
            {onOpenProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                aria-label="Open Patient Profile"
                className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Patient Profile & Recent Orders"
              >
                <User size={16} weight="bold" aria-hidden="true" />
              </button>
            )}

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Quick Live Search Trigger in Mobile Drawer */}
        {onOpenSearch && (
          <div className="px-4 pt-3 pb-1 border-b border-gray-50">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-gray-600 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <MagnifyingGlass size={16} className="text-[#007A33]" aria-hidden="true" />
                <span>Search medicines & vitamins...</span>
              </div>
              <span className="text-[10px] font-bold text-[#007A33] bg-emerald-100 px-1.5 py-0.5 rounded">
                Live
              </span>
            </button>
          </div>
        )}

        {/* Navigation Links - Direct 1-tap Access to ALL Pages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-sm">
          {/* Home */}
          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              onClose();
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'bg-emerald-50 text-emerald-900 border-l-4 border-[#007A33]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <House size={18} className="text-[#007A33]" aria-hidden="true" />
              <span>Home</span>
            </div>
            {currentView === 'home' && <span className="w-2 h-2 rounded-full bg-[#007A33]" />}
          </button>

          {/* Shop Products (Direct Page + Accordion Categories) */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div
              className={`flex items-center justify-between px-3.5 py-2.5 transition-colors ${
                currentView === 'shop'
                  ? 'bg-emerald-50 text-emerald-900 border-l-4 border-[#007A33]'
                  : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onNavigate('shop', 'All Products');
                  onClose();
                }}
                className="flex items-center gap-3 font-bold flex-1 text-left cursor-pointer"
              >
                <ShoppingCart size={18} className="text-[#007A33]" aria-hidden="true" />
                <span>Shop Products</span>
              </button>

              <button
                type="button"
                onClick={() => setShopExpanded((e) => !e)}
                aria-label="Toggle categories"
                className="p-1 rounded-md hover:bg-black/5 cursor-pointer text-gray-500"
              >
                <CaretDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform ${shopExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {shopExpanded && (
              <div className="bg-gray-50/80 p-2 space-y-1 text-xs border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('shop', 'All Products');
                    onClose();
                  }}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-gray-800 hover:bg-white font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span>All Formulations (17 Items)</span>
                  <ArrowRight size={12} className="text-[#007A33]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('shop', 'Anti-Malarial');
                    onClose();
                  }}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-gray-700 hover:bg-white cursor-pointer"
                >
                  Anti-Malarial (Cenart Forte)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('shop', 'Hematinics (Iron Supplements)');
                    onClose();
                  }}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-gray-700 hover:bg-white cursor-pointer"
                >
                  Hematinics (Hemosoft Softgels)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('shop', 'Immune System (Multivitamins)');
                    onClose();
                  }}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-gray-700 hover:bg-white cursor-pointer"
                >
                  Immune System (Zurion)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('shop', 'Blood Pressure Management');
                    onClose();
                  }}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-gray-700 hover:bg-white cursor-pointer"
                >
                  Blood Pressure (Cantab)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('shop', 'Cholesterol Management');
                    onClose();
                  }}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-gray-700 hover:bg-white cursor-pointer"
                >
                  Cholesterol (Ultrox)
                </button>
              </div>
            )}
          </div>

          {/* About Us Page (Direct 1-Tap) */}
          <button
            type="button"
            onClick={() => {
              onNavigate('about');
              onClose();
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'about'
                ? 'bg-emerald-50 text-emerald-900 border-l-4 border-[#007A33]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Info size={18} className="text-[#007A33]" aria-hidden="true" />
              <span>About Us</span>
            </div>
            <span className="text-[10px] text-gray-400 font-normal">Our Story</span>
          </button>

          {/* Partnerships Page (Direct 1-Tap) */}
          <button
            type="button"
            onClick={() => {
              onNavigate('partnerships');
              onClose();
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'partnerships'
                ? 'bg-emerald-50 text-emerald-900 border-l-4 border-[#007A33]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={18} className="text-[#007A33]" aria-hidden="true" />
              <span>Partnerships</span>
            </div>
            <span className="text-[10px] text-gray-400 font-normal">Alliances</span>
          </button>

          {/* Career Page (Direct 1-Tap) */}
          <button
            type="button"
            onClick={() => {
              onNavigate('career');
              onClose();
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'career'
                ? 'bg-emerald-50 text-emerald-900 border-l-4 border-[#007A33]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase size={18} className="text-[#007A33]" aria-hidden="true" />
              <span>Career</span>
            </div>
            <span className="text-[9px] bg-emerald-100 text-[#007A33] font-bold px-2 py-0.5 rounded-full">
              Hiring
            </span>
          </button>

          {/* Wholesale & Retail Dedicated Page (Direct 1-Tap) */}
          <button
            type="button"
            onClick={() => {
              onNavigate('wholesale');
              onClose();
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'wholesale'
                ? 'bg-emerald-50 text-emerald-900 border-l-4 border-[#007A33]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} className="text-[#007A33]" aria-hidden="true" />
              <span>Wholesale & Retail</span>
            </div>
            <span className="text-[10px] text-gray-400 font-normal">Bulk Orders</span>
          </button>

          {/* Health Blog Dedicated Page (Direct 1-Tap) */}
          <button
            type="button"
            onClick={() => {
              onNavigate('blog');
              onClose();
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'blog'
                ? 'bg-emerald-50 text-emerald-900 border-l-4 border-[#007A33]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-[#007A33]" aria-hidden="true" />
              <span>Health Blog</span>
            </div>
            <span className="text-[10px] text-gray-400 font-normal">Articles</span>
          </button>

          {/* Track Order Modal Button */}
          {onOpenTrackOrder && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTrackOrder();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer border border-emerald-100 bg-white"
            >
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-[#007A33]" aria-hidden="true" />
                <span>Track Order</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                Live Status
              </span>
            </button>
          )}

          {/* Patient Profile & Recent Orders */}
          {onOpenProfile && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer border border-gray-200/80 bg-white"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-[#007A33]" aria-hidden="true" />
                <span>Patient Profile & Orders</span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">
                Account
              </span>
            </button>
          )}

          {/* Dispensary Admin Management Portal */}
          <button
            type="button"
            onClick={() => {
              onNavigate('admin');
              onClose();
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-left font-bold flex items-center justify-between text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Buildings size={18} className="text-[#007A33]" aria-hidden="true" />
              <span>Dispensary Staff Portal</span>
            </div>
            <span className="text-[10px] text-slate-600 font-bold bg-slate-200/80 px-1.5 py-0.5 rounded">
              Admin OS
            </span>
          </button>

          {/* Special Feature: Switch & Save Calculator */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSwitchSave();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#007A33]">
                <Percent size={14} aria-hidden="true" />
                <span>Switch & Save Calculator</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-0.5">
                Save up to 59% on daily medications
              </div>
            </button>
          </div>
        </div>

        {/* Drawer Footer: Contacts & Pharmacist Help */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
          <div className="text-xs text-gray-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#007A33] shrink-0" aria-hidden="true" />
              <a href={`tel:${SITE_IDENTITY.contact.phone}`} className="font-semibold text-gray-800">
                {SITE_IDENTITY.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#007A33] shrink-0" aria-hidden="true" />
              <span className="truncate">No 5 Malm Street, Abelemkpe</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenConsult();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold text-center transition-colors cursor-pointer shadow-xs"
          >
            Speak to a Pharmacist
          </button>
        </div>
      </div>
    </div>
  );
};

