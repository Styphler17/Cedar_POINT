import React from 'react';
import {
  SITE_IDENTITY,
  PHARMACY_GOOGLE_MAPS_URL,
  PHARMACY_MAPS_EMBED_URL,
} from '../data/pharmacyData';
import { BrandButton } from './BrandButton';
import {
  Check,
  MapPin,
  Phone,
  Clock,
  ArrowSquareOut,
} from '@phosphor-icons/react';

interface AboutPageViewProps {
  onNavigateToShop: () => void;
  onNavigateToPartnerships: () => void;
  onNavigateToWholesale: () => void;
}

export const AboutPageView: React.FC<AboutPageViewProps> = ({
  onNavigateToShop,
  onNavigateToPartnerships,
  onNavigateToWholesale,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-sm"
        style={{ background: 'linear-gradient(135deg, #007A33 0%, #004D21 100%)' }}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <span>Company Profile & Heritage</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            About Cedar Point Chemist
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl">
            Redefining the standard of healthcare in Ghana through trust, care, and consistency. Quality in every dose, passion in every service.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-emerald-300" aria-hidden="true" />
              Founded & Operating in Accra
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-emerald-300" aria-hidden="true" />
              FDA Ghana & Pharmacy Council Licensed
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-emerald-300" aria-hidden="true" />
              Over 30 Years of Pharmaceutical Care
            </span>
          </div>
        </div>
      </div>

      {/* 2. Mission, Vision, and Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold font-heading text-lg">
              01
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To empower individuals and communities across Ghana with dependable, high-efficacy pharmaceutical solutions. We believe quality healthcare should never be an unaffordable luxury; every patient deserves rigorously tested, bioequivalent medications dispensed with genuine compassion.
            </p>
          </div>
          <div className="pt-6 border-t border-gray-100 mt-6 text-xs text-emerald-800 font-semibold">
            "Quality in every dose, passion in every service."
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold font-heading text-lg">
              02
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To be West Africa's benchmark healthcare provider and pharmaceutical distributor, recognized for uncompromising cold-chain standards, scientific integrity, affordable proprietary formulations like Zurion and Hemosoft, and empathetic patient consultation.
            </p>
          </div>
          <div className="pt-6 border-t border-gray-100 mt-6 text-xs text-emerald-800 font-semibold">
            Serving over 1 Million happy patients & partner clinics nationwide.
          </div>
        </div>
      </section>

      {/* 3. The 4 Pillars of Cedar Point Healthcare */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            The Pillars of Our Practice
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Why Ghanaian healthcare professionals and families place their trust in Cedar Point Chemist.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              index: '01',
              title: 'Clinical Integrity',
              desc: 'Every prescription and OTC medicine is reviewed by licensed pharmacists. We verify dosages and check for dangerous drug-drug interactions before any medication leaves our counter.',
            },
            {
              index: '02',
              title: 'Continuous Cold-Chain',
              desc: 'Accra’s tropical heat can degrade sensitive medicines. Our storage rooms and dispensary shelves are monitored 24/7 under strict climate controls below 25°C to preserve active strength.',
            },
            {
              index: '03',
              title: 'True Bioequivalence',
              desc: 'Through our Switch & Save commitment, we supply proven bioequivalent alternatives to expensive imported labels—saving Ghanaian households up to 59% with identical active molecules.',
            },
            {
              index: '04',
              title: 'Accessible Counseling',
              desc: 'Healthcare goes beyond dispensing boxes. We offer free routine blood pressure checks, lifestyle advice, and direct phone counseling with superintendent pharmacists.',
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-xs font-bold text-emerald-800 mb-3 tracking-wider">
                  {pillar.index}
                </div>
                <h3 className="font-heading font-bold text-base text-gray-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Heritage & Abelemkpe Flagship Facility */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Dispensary & Corporate Headquarters
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Rooted in Abelemkpe, Serving All of Ghana
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Located on Malm Street in the heart of Abelemkpe, Accra, Cedar Point Chemist operates as both a community-facing retail apothecary and a high-volume institutional wholesale depot.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Whether you are an outpatient filling a specialized prescription or a hospital procurement officer placing an order for hundreds of cartons, our facility delivers verified batch authenticity, certificates of analysis, and rapid dispatch across Greater Accra and all sixteen regions of Ghana.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <MapPin size={16} className="text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-gray-900">Physical Address</div>
                  <div>{SITE_IDENTITY.contact.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Clock size={16} className="text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-gray-900">Operating Hours</div>
                  <div>{SITE_IDENTITY.contact.hours}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-6 rounded-2xl border border-emerald-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white shadow-xs text-emerald-800 flex items-center justify-center mx-auto font-heading font-black text-xl">
              CP
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">
              Accredited Quality Standards
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fully compliant with the Pharmacy Council Act (Act 857) and Food and Drugs Authority regulations. All proprietary brands including Cenart Forte, Ultrox, and Zurion are manufactured in WHO-GMP certified partner laboratories.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <BrandButton
                variant="primary"
                size="md"
                onClick={onNavigateToShop}
                className="w-full sm:w-auto"
              >
                Browse Our Formulary Products
              </BrandButton>
              <BrandButton
                variant="outline"
                size="md"
                onClick={onNavigateToWholesale}
                className="w-full sm:w-auto"
              >
                Learn About Wholesale Supply
              </BrandButton>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Location & Facility Map */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin size={16} className="text-emerald-700" aria-hidden="true" />
              <span>Official Pharmacy Street Location</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Visit Cedar Point Chemist
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              Official verified pharmacy street location on Google Maps. Visit our walk-in community apothecary counter or coordinate direct pickups and consultation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={PHARMACY_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#007A33] hover:bg-[#006028] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <MapPin size={16} aria-hidden="true" />
              <span>Get Directions</span>
              <ArrowSquareOut size={16} className="opacity-80" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50 h-[380px] sm:h-[450px]">
          <iframe
            src={PHARMACY_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Cedar Point Chemist - Official Street Map"
            className="w-full h-full"
          />
        </div>

        {/* Landmark & Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
            <MapPin size={20} className="text-[#007A33] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-heading font-bold text-xs text-gray-900">Official Pharmacy Address</div>
              <p className="text-[11px] text-gray-600 mt-0.5">
                CEDAR POINT CHEMIST LTD, Nmai Dzorn Adjiringano Road, Greater Accra, Ghana.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
            <Clock size={20} className="text-[#007A33] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-heading font-bold text-xs text-gray-900">Walk-In & Dispensary Hours</div>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Monday – Saturday: 7:30 AM – 9:00 PM | Sunday: 1:00 PM – 7:00 PM
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
            <Phone size={20} className="text-[#007A33] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-heading font-bold text-xs text-gray-900">Phone Assistance</div>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Call +233-247-575-002 for live arrival directions or dispatch inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Leadership & Clinical Team */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Clinical Leadership
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Guided by experienced pharmaceutical scientists committed to Ghanaian community health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Kwame Mensah, PharmD',
              role: 'Superintendent Pharmacist',
              bio: 'Over 18 years of clinical and community pharmacy governance in Accra, specializing in infectious disease pharmacology and cold-chain compliance.',
            },
            {
              name: 'Abena Osei-Bonsu, BPharm, MPSGH',
              role: 'Head of Clinical Services & Patient Care',
              bio: 'Leads patient consultation programs, chronic cardiovascular therapy adherence, and prenatal nutrition initiatives across our Abelemkpe clinic desk.',
            },
            {
              name: 'Kofi Asante, MBA, BPharm',
              role: 'Director of Wholesale Distribution',
              bio: 'Oversees nationwide medical logistics, hospital formulary supply agreements, and regional supply chain cold-chain integrity across Ghana.',
            },
          ].map((leader) => (
            <div
              key={leader.name}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4">
                  {leader.name.split(' ')[1]?.[0] || 'CP'}
                </div>
                <h3 className="font-heading font-bold text-base text-gray-900">
                  {leader.name}
                </h3>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {leader.role}
                </div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
