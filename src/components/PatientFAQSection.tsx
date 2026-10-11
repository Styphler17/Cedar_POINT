import React, { useState, useMemo } from 'react';
import {
  CaretDown,
  ShieldCheck,
  Truck,
  Pill,
  CreditCard,
  MagnifyingGlass,
  PhoneCall,
  Question,
  Check,
  CheckCircle,
  X,
} from '@phosphor-icons/react';
import { PATIENT_FAQS, PatientFaqItem, FaqCategory } from '../data/patientFaqData';
import { SITE_IDENTITY } from '../data/pharmacyData';

interface PatientFAQSectionProps {
  onOpenConsult?: () => void;
  onOpenTracking?: () => void;
}

export const PatientFAQSection: React.FC<PatientFAQSectionProps> = ({
  onOpenConsult,
  onOpenTracking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-fda-license', 'faq-delivery-zones-speed']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return PATIENT_FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        (faq.highlight && faq.highlight.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all' as FaqCategory, label: 'All Questions', icon: <Question size={15} /> },
    { id: 'licensing' as FaqCategory, label: 'FDA & Licensing', icon: <ShieldCheck size={15} /> },
    { id: 'services' as FaqCategory, label: 'Pharmacy Services', icon: <Pill size={15} /> },
    { id: 'delivery' as FaqCategory, label: 'Delivery & Cold-Chain', icon: <Truck size={15} /> },
    { id: 'payments' as FaqCategory, label: 'Payments & Policies', icon: <CreditCard size={15} /> },
  ];

  return (
    <section id="patient-faq" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#007A33] text-[11px] sm:text-xs font-bold border border-emerald-100">
            <ShieldCheck size={14} weight="bold" aria-hidden="true" />
            <span>Patient Advisory & Clinical Standards</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Essential facts on Cedar Point Chemist's Ghana FDA licensing, clinical prescription screening, cold-chain safety, and Greater Accra same-day delivery policies.
          </p>
        </div>

        {/* Filter Tabs & Quick Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Category Filter Pills (Functional Buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-gray-50 rounded-xl border border-gray-200/80">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#007A33] text-white shadow-2xs font-bold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs (e.g. delivery, FDA)..."
                className="w-full pl-8 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#007A33] focus:outline-hidden focus:ring-2 focus:ring-emerald-600/15 transition-all"
              />
              <MagnifyingGlass
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear FAQ search"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqIds.includes(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-emerald-300 shadow-xs'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-emerald-800">
                        <span>{faq.badgeText || 'Pharmacy Advisory'}</span>
                      </div>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 mt-0.5 ${
                        isOpen
                          ? 'bg-emerald-100 text-[#007A33] rotate-180'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <CaretDown size={14} weight="bold" aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 space-y-3 border-t border-emerald-50 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in duration-150">
                      <p>{faq.answer}</p>

                      {faq.highlight && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2 text-xs text-emerald-950 font-medium">
                          <CheckCircle
                            size={16}
                            weight="fill"
                            className="text-[#007A33] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <p className="text-sm font-semibold text-gray-700">
                No questions matched "{searchQuery}"
              </p>
              <p className="text-xs text-gray-500">
                Try searching for terms like "delivery", "cold chain", "prescription", or clear the filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Clinical Support Callout Card */}
        <div className="p-5 sm:p-7 rounded-2xl bg-linear-to-r from-emerald-900 via-[#007A33] to-emerald-800 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left max-w-xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-emerald-200">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Superintendent Pharmacist on Duty</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
              Have an urgent question regarding your medication dosage?
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Our clinical pharmacists at No 5 Malm Street, Abelemkpe, are available to answer your prescription questions, check for drug interactions, or verify delivery status.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 shrink-0 w-full md:w-auto">
            {onOpenConsult && (
              <button
                type="button"
                onClick={onOpenConsult}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-[#007A33] hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PhoneCall size={15} aria-hidden="true" />
                <span>Consult Pharmacist</span>
              </button>
            )}

            {onOpenTracking && (
              <button
                type="button"
                onClick={onOpenTracking}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Truck size={15} aria-hidden="true" />
                <span>Track Fulfillment</span>
              </button>
            )}

            <a
              href={`tel:${SITE_IDENTITY.contact.phone}`}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-center text-emerald-200 hover:text-white text-xs font-semibold transition-colors underline"
            >
              Direct Line: {SITE_IDENTITY.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
