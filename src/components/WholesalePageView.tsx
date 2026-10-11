import React, { useState } from 'react';
import {
  PHARMACY_GOOGLE_MAPS_URL,
  PHARMACY_STREET_VIEW_URL,
  PHARMACY_STREET_VIEW_EMBED_URL,
  PHARMACY_MAPS_EMBED_URL,
} from '../data/pharmacyData';
import {
  MapPin,
  Phone,
  Envelope,
  Mailbox,
  ShoppingCart,
  FirstAid,
  Buildings,
  Stethoscope,
  Percent,
  ArrowsClockwise,
  Truck,
  Headset,
  Pill,
  ArrowSquareOut,
  WhatsappLogo,
  CheckCircle,
  Eye,
  Compass,
  ShieldCheck,
  Sparkle,
} from '@phosphor-icons/react';

interface WholesalePageViewProps {
  onNavigateToShop?: () => void;
}

interface ClientPartner {
  id: string;
  name: string;
  logoUrl?: string; // If user adds file assets later
  renderLogo: () => React.ReactNode;
}

// Client partner logos with pure SVG graphics (NO text beside or below)
const CLIENT_PARTNERS: ClientPartner[] = [
  {
    id: 'kbth',
    name: 'Korle Bu Teaching Hospital (KBTH)',
    renderLogo: () => (
      <svg viewBox="0 0 160 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hospital circular crest */}
        <circle cx="28" cy="28" r="24" fill="#1E3A8A" />
        <circle cx="28" cy="28" r="20" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="28" cy="28" r="16" fill="#FFFFFF" />
        {/* Caduceus / Staff of Asclepius */}
        <line x1="28" y1="17" x2="28" y2="39" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 22C24 22 32 24 32 27C32 30 24 31 24 33C24 35 32 36 32 36" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        {/* KBTH wordmark in logo */}
        <text x="62" y="36" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" fill="#1E3A8A" letterSpacing="1.5">
          KBTH
        </text>
        <circle cx="138" cy="30" r="3" fill="#D97706" />
      </svg>
    ),
  },
  {
    id: 'bank-hospital',
    name: 'The Bank Hospital',
    renderLogo: () => (
      <svg viewBox="0 0 180 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield Symbol */}
        <path d="M28 10L42 16V28C42 36 35 43 28 46C21 43 14 36 14 28V16L28 10Z" fill="#F97316" />
        {/* Internal Cross */}
        <path d="M28 18V38M18 28H38" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        {/* The Bank Hospital logo typography */}
        <text x="52" y="27" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" fill="#0F172A" letterSpacing="0.8">
          THE BANK
        </text>
        <text x="52" y="42" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="11" fill="#F97316" letterSpacing="2">
          HOSPITAL
        </text>
      </svg>
    ),
  },
  {
    id: 'ecpl',
    name: 'East Cantonments Pharmacy Ltd (ECPL)',
    renderLogo: () => (
      <svg viewBox="0 0 160 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Mortar & Pestle Emblem */}
        <rect x="8" y="10" width="36" height="36" rx="10" fill="#007A33" />
        <path d="M20 30C20 34 23 37 26 37C29 37 32 34 32 30V26H20V30Z" fill="#FFFFFF" />
        <line x1="28" y1="20" x2="34" y2="15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M23 23L29 23" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
        {/* ECPL wordmark in logo */}
        <text x="54" y="32" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="20" fill="#007A33" letterSpacing="1">
          ECPL
        </text>
        <text x="55" y="44" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="9" fill="#047857" letterSpacing="1.5">
          PHARMACY
        </text>
      </svg>
    ),
  },
  {
    id: 'ridge-hospital',
    name: 'Greater Accra Regional Hospital (Ridge)',
    renderLogo: () => (
      <svg viewBox="0 0 170 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Red / Gold Medical Cross Ring */}
        <circle cx="28" cy="28" r="22" fill="#991B1B" />
        <path d="M28 16V40M16 28H40" stroke="#FDE047" strokeWidth="5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="4" fill="#FFFFFF" />
        {/* Hospital logotype */}
        <text x="60" y="28" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" fill="#991B1B" letterSpacing="0.5">
          GARH
        </text>
        <text x="60" y="42" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="10" fill="#64748B" letterSpacing="1">
          RIDGE HOSPITAL
        </text>
      </svg>
    ),
  },
  {
    id: 'ugmc',
    name: 'University of Ghana Medical Centre (UGMC)',
    renderLogo: () => (
      <svg viewBox="0 0 160 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Academic Medical Crest */}
        <rect x="8" y="10" width="36" height="36" rx="8" fill="#0F172A" />
        <circle cx="26" cy="24" r="8" stroke="#F59E0B" strokeWidth="2" />
        <path d="M26 19V29M21 24H31" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 38C19 35 33 35 36 38" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        {/* UGMC logo font */}
        <text x="54" y="32" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="21" fill="#0F172A" letterSpacing="1.5">
          UGMC
        </text>
        <text x="55" y="44" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#D97706" letterSpacing="1.2">
          MEDICAL CENTRE
        </text>
      </svg>
    ),
  },
  {
    id: 'trust-hospital',
    name: 'The Trust Hospital',
    renderLogo: () => (
      <svg viewBox="0 0 170 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Caring hands & Cross */}
        <circle cx="28" cy="28" r="22" fill="#0D9488" />
        <path d="M28 17V39M17 28H39" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="5" fill="#14B8A6" />
        {/* Trust Hospital logo font */}
        <text x="60" y="27" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" fill="#0F172A" letterSpacing="0.8">
          THE TRUST
        </text>
        <text x="60" y="42" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="11" fill="#0D9488" letterSpacing="1.5">
          HOSPITAL
        </text>
      </svg>
    ),
  },
  {
    id: 'nyaho',
    name: 'Nyaho Medical Centre',
    renderLogo: () => (
      <svg viewBox="0 0 170 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hexagonal Cross Symbol */}
        <polygon points="28,8 46,18 46,38 28,48 10,38 10,18" fill="#1E40AF" />
        <path d="M28 18V38M18 28H38" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        {/* Nyaho logo font */}
        <text x="56" y="33" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="19" fill="#1E40AF" letterSpacing="1">
          NYAHO
        </text>
        <text x="56" y="44" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#3B82F6" letterSpacing="1">
          MEDICAL CENTRE
        </text>
      </svg>
    ),
  },
  {
    id: 'hpc',
    name: 'Health Products Corporation (HPC)',
    renderLogo: () => (
      <svg viewBox="0 0 150 56" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="28" r="20" fill="#047857" />
        <path d="M18 28H34M26 20V36" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <text x="54" y="34" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="21" fill="#047857" letterSpacing="1.5">
          HPC
        </text>
        <text x="55" y="45" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#10B981" letterSpacing="1.2">
          PHARMA
        </text>
      </svg>
    ),
  },
];

export const WholesalePageView: React.FC<WholesalePageViewProps> = ({ onNavigateToShop }) => {
  // Map display state: streetview or standard roadmap
  const [mapMode, setMapMode] = useState<'streetview' | 'roadmap'>('streetview');

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* 1. Main Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#263238]">
          Wholesale & Retail Services
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-[#263238]/85 max-w-3xl mx-auto leading-relaxed">
          As a supply focused firm, CPC has a singular retail and wholesale. While our product lines are stocked in major retail and wholesale outlets nationwide, CPC offers direct access through:
        </p>
        <div className="mt-6 border-b border-gray-200" />
      </section>

      {/* 2. Ordering Options & Distribution Scope */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column: Ordering Options + Visual */}
          <div className="space-y-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#263238]">
              Ordering Options:
            </h2>
            <p className="text-base text-[#263238]/90 leading-relaxed">
              Orders can be made via phone, WhatsApp, or in-person at either the wholesale or office location.
            </p>

            {/* Visual of Pharmaceutical Fulfillment & Storage */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 aspect-16/10">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=900"
                alt="Pharmaceutical supply trolley with medicines and vitamins"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-semibold">
                <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  Prompt Fulfillment & Cold-Chain Care
                </span>
                <span className="bg-[#007A33] px-2.5 py-1 rounded-lg">
                  Bulk & Retail Stock
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Wholesale & Main Office Scope */}
          <div className="space-y-6 lg:pl-4">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              Our wholesale and main office serve as the hub for bulk purchases and pharmaceutical distribution across Ghana.
            </h2>

            <div className="space-y-4 pt-1">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                We supply to:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    name: 'Pharmacies',
                    desc: 'Licensed community & retail chemists',
                    icon: <Pill size={20} className="text-[#007A33]" aria-hidden="true" />,
                  },
                  {
                    name: 'Hospitals',
                    desc: 'Regional, teaching & private hospitals',
                    icon: <Buildings size={20} className="text-[#007A33]" aria-hidden="true" />,
                  },
                  {
                    name: 'Medical Centers',
                    desc: 'Clinics, maternity homes & sickbays',
                    icon: <FirstAid size={20} className="text-[#007A33]" aria-hidden="true" />,
                  },
                  {
                    name: 'Health Institutions Nationwide',
                    desc: 'Corporate, military & research health posts',
                    icon: <Stethoscope size={20} className="text-[#007A33]" aria-hidden="true" />,
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3 hover:border-emerald-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Wholesale Benefits (Redesigned with Premium Elevated Cards) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-10">
        <div className="bg-gradient-to-br from-[#005A25] via-[#007A33] to-[#014D20] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-emerald-600/30 relative overflow-hidden">
          {/* Subtle decorative background circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 max-w-3xl mb-8 sm:mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-3 border border-white/20">
              <Sparkle size={14} weight="fill" className="text-emerald-300" />
              <span>Procurement Advantage</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Wholesale Benefits
            </h2>
            <p className="mt-2.5 text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              Specialized supply terms engineered to optimize inventory liquidity and profit margins for hospitals, healthcare centers, and community pharmacies across Ghana.
            </p>
          </div>

          {/* 3 Upgraded Benefits Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Benefit 1: Discounts on large volume purchases */}
            <div className="bg-white text-[#263238] rounded-2xl p-6 sm:p-7 shadow-md border border-gray-100/80 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#007A33] border border-emerald-100 flex items-center justify-center group-hover:bg-[#007A33] group-hover:text-white transition-colors duration-300">
                    <Percent size={26} weight="bold" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Volume Tiered
                  </span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#263238] leading-snug mb-2.5">
                  Discounts on large volume purchases
                </h3>
                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  Enjoy preferential commercial discounts and tiered carton pricing on bulk medication orders, maximizing cost-efficiency for your facility.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#007A33]">
                <ShieldCheck size={16} weight="bold" />
                <span>Transparent price brackets</span>
              </div>
            </div>

            {/* Benefit 2: Sale-or-return promotions */}
            <div className="bg-white text-[#263238] rounded-2xl p-6 sm:p-7 shadow-md border border-gray-100/80 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#007A33] border border-emerald-100 flex items-center justify-center group-hover:bg-[#007A33] group-hover:text-white transition-colors duration-300">
                    <ArrowsClockwise size={26} weight="bold" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Capital Protection
                  </span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#263238] leading-snug mb-2.5">
                  Sale-or-return promotions
                </h3>
                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  Minimize working capital exposure with flexible consignment terms on qualified promotional batches and high-velocity therapeutic lines.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#007A33]">
                <ShieldCheck size={16} weight="bold" />
                <span>Zero dead-stock risk</span>
              </div>
            </div>

            {/* Benefit 3: Free nationwide delivery */}
            <div className="bg-white text-[#263238] rounded-2xl p-6 sm:p-7 shadow-md border border-gray-100/80 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#007A33] border border-emerald-100 flex items-center justify-center group-hover:bg-[#007A33] group-hover:text-white transition-colors duration-300">
                    <Truck size={26} weight="bold" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Cold-Chain Certified
                  </span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#263238] leading-snug mb-2.5">
                  Free nationwide delivery
                </h3>
                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  Direct dispatch to your warehouse, hospital pharmacy, or chemist anywhere in Ghana with cold-chain integrity and zero transit fees.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#007A33]">
                <ShieldCheck size={16} weight="bold" />
                <span>Reliable 24-48 hr fulfillment</span>
              </div>
            </div>
          </div>

          {/* Quick Wholesale Action Banner inside the card */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-100 text-sm">
              <CheckCircle size={20} weight="fill" className="text-emerald-300 shrink-0" />
              <span>Dedicated institutional account pharmacist assigned to every partner facility.</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/233247575002?text=Hello%20Cedar%20Point%20Chemist,%20I%20would%20like%20to%20inquire%20about%20wholesale%20supply%20terms."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#007A33] hover:bg-emerald-50 font-heading font-semibold text-[0.95rem] transition-colors shadow-sm"
              >
                <WhatsappLogo size={18} weight="bold" />
                <span>Request Wholesale Quotation</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ordering Guidelines */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#263238]">
              Ordering Guidelines:
            </h2>
          </div>

          <div className="lg:col-span-2 bg-gray-50/90 rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#007A33] mt-2.5 shrink-0" aria-hidden="true" />
              <p className="text-base text-[#263238] leading-relaxed">
                Medium-sized orders can be made at the wholesale branch. Large institutional orders (e.g., hospitals) should be placed directly at the main office.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#007A33] mt-2.5 shrink-0" aria-hidden="true" />
              <p className="text-base text-[#263238] leading-relaxed">
                Our wholesale also stocks a wide range of third-party products, making it your one-stop shop for all medications and medical devices — beyond our own line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Clients — Auto Carousel (Logos Only, No Texts) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-6">
          <div className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">
            Our clients
          </div>
        </div>

        {/* Seamless Infinite Auto Carousel Marquee: CLIENT LOGOS ONLY, NO TEXTS */}
        <div className="relative overflow-hidden w-full py-4 bg-white rounded-2xl">
          {/* Edge gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-6 sm:gap-8 cursor-pointer">
            {/* Repeat partner logos for infinite seamless loop */}
            {[...CLIENT_PARTNERS, ...CLIENT_PARTNERS, ...CLIENT_PARTNERS].map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="w-36 sm:w-48 h-20 sm:h-24 px-5 py-3 rounded-2xl border border-gray-200/80 bg-white hover:border-emerald-500 hover:shadow-md transition-all shrink-0 flex items-center justify-center group"
                title={client.name}
              >
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="max-h-12 max-w-[130px] sm:max-w-[150px] object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    {client.renderLogo()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-b border-gray-200" />
      </section>

      {/* 6. OUR RETAIL BRANCH — EAST LEGON / ADJIRINGANOR (With Street View Map) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#263238] text-center sm:text-left">
            Our retail branch
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="bg-gray-50/70 rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#007A33] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} weight="fill" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs uppercase tracking-wider text-emerald-800">
                    Location
                  </div>
                  <div className="text-gray-700 mt-1 leading-snug">
                    MV8C+26, Adjiringano<br />
                    Greater Accra, Ghana<br />
                    <span className="font-semibold text-gray-900 text-xs mt-1 block">
                      CEDAR POINT CHEMIST LTD
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#007A33] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={18} weight="fill" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs uppercase tracking-wider text-emerald-800">
                    Phone
                  </div>
                  <div className="text-gray-700 mt-1 space-y-0.5">
                    <div>
                      <a href="tel:+233302737720" className="hover:text-[#007A33] hover:underline">
                        +233-302-737-720
                      </a>
                    </div>
                    <div>
                      <a href="tel:+233247575002" className="hover:text-[#007A33] hover:underline">
                        +233-247-575-002
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#007A33] flex items-center justify-center shrink-0 mt-0.5">
                  <Envelope size={18} weight="fill" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs uppercase tracking-wider text-emerald-800">
                    Email
                  </div>
                  <div className="text-gray-700 mt-1 space-y-0.5 break-all">
                    <div>
                      <a href="mailto:cedarpoint@live.co.uk" className="hover:text-[#007A33] hover:underline">
                        cedarpoint@live.co.uk
                      </a>
                    </div>
                    <div>
                      <a href="mailto:info@cedarpointchemist.com" className="hover:text-[#007A33] hover:underline">
                        info@cedarpointchemist.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Postal Address */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#007A33] flex items-center justify-center shrink-0 mt-0.5">
                  <Mailbox size={18} weight="fill" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs uppercase tracking-wider text-emerald-800">
                    Postal Address
                  </div>
                  <div className="text-gray-700 mt-1 leading-snug">
                    P. O. Box CT 5601<br />
                    Cantonments, Accra
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200/70 flex flex-wrap items-center gap-3">
              <a
                href={PHARMACY_STREET_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Compass size={16} aria-hidden="true" />
                <span>Open Google Street View (360°)</span>
                <ArrowSquareOut size={14} aria-hidden="true" />
              </a>

              <a
                href="https://wa.me/233247575002?text=Hello%20Cedar%20Point%20Chemist%20Retail%20Dispensary,%20I%20have%20a%20prescription%20or%20product%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-black hover:border-gray-300 text-xs font-bold transition-colors"
              >
                <WhatsappLogo size={16} className="text-[#007A33]" aria-hidden="true" />
                <span>WhatsApp Pharmacist</span>
              </a>

              {onNavigateToShop && (
                <button
                  type="button"
                  onClick={onNavigateToShop}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ShoppingCart size={16} aria-hidden="true" />
                  <span>Browse Online Catalog</span>
                </button>
              )}
            </div>
          </div>

          {/* Map Embed Container with Street View Mode Toggle */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xs h-[340px] sm:h-auto min-h-[320px] relative bg-gray-100 flex flex-col">
            {/* View Mode Toolbar Header */}
            <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 border-b border-gray-200 flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-1.5 text-gray-800 font-bold">
                <Compass size={16} className="text-[#007A33]" />
                <span>CEDAR POINT CHEMIST LTD</span>
              </div>

              {/* View Switcher: Street View vs Roadmap */}
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setMapMode('streetview')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    mapMode === 'streetview'
                      ? 'bg-[#007A33] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye size={12} />
                  <span>Street View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('roadmap')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    mapMode === 'roadmap'
                      ? 'bg-[#007A33] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin size={12} />
                  <span>Map</span>
                </button>
              </div>
            </div>

            {/* Embed Frame */}
            <div className="relative flex-1 w-full h-full min-h-[280px]">
              <iframe
                src={mapMode === 'streetview' ? PHARMACY_STREET_VIEW_EMBED_URL : PHARMACY_MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={mapMode === 'streetview' ? 'Cedar Point Chemist Street View' : 'Cedar Point Chemist Map View'}
                className="w-full h-full min-h-[280px]"
              />

              {/* Floating External View Badge */}
              <a
                href={PHARMACY_STREET_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-[11px] font-medium backdrop-blur-xs transition-colors shadow-sm"
              >
                <span>Full Street View</span>
                <ArrowSquareOut size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Our Retail Branch Delivers (Rich Green Banner) */}
      <section className="bg-[#007A33] text-white py-10 px-4 sm:px-6 my-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="lg:w-1/4">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Our retail branch<br />delivers:
            </h2>
          </div>

          <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Deliverable 1 */}
            <div className="bg-white text-gray-900 rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#007A33] flex items-center justify-center mb-3">
                <Headset size={24} weight="bold" aria-hidden="true" />
              </div>
              <div className="font-heading font-bold text-sm text-gray-900 leading-snug">
                Exceptional customer service
              </div>
            </div>

            {/* Deliverable 2 */}
            <div className="bg-white text-gray-900 rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#007A33] flex items-center justify-center mb-3">
                <Stethoscope size={24} weight="bold" aria-hidden="true" />
              </div>
              <div className="font-heading font-bold text-sm text-gray-900 leading-snug">
                Personalized medicine consultations
              </div>
            </div>

            {/* Deliverable 3 */}
            <div className="bg-white text-gray-900 rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#007A33] flex items-center justify-center mb-3">
                <Pill size={24} weight="bold" aria-hidden="true" />
              </div>
              <div className="font-heading font-bold text-sm text-gray-900 leading-snug">
                A wide range of premium and generic health and wellness products
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Healthcare Experts Trust Bar */}
      <section className="bg-emerald-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
            Your Trusted Healthcare Experts
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
            Grounded in decades of research, we deliver quality you can count on.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
              <div className="text-2xl font-black font-heading text-emerald-300">#1</div>
              <div className="font-bold text-xs uppercase tracking-wider mt-1">Pharmacist Recommended</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">Supplement & Cold Brand</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center mb-1">
                <CheckCircle size={22} weight="bold" aria-hidden="true" />
              </div>
              <div className="font-bold text-xs uppercase tracking-wider">FDA Approved</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">Food and Drugs Authority Ghana</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
              <div className="text-2xl font-black font-heading text-emerald-300">Over 30</div>
              <div className="font-bold text-xs uppercase tracking-wider mt-1">Years of Expertise</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">Operational Excellence in Ghana</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
