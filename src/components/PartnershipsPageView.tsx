import React, { useState } from 'react';
import { SITE_IDENTITY } from '../data/pharmacyData';
import { BrandButton } from './BrandButton';
import {
  Handshake,
  MapPin,
  Phone,
  Envelope,
  Check,
} from '@phosphor-icons/react';

export const PartnershipsPageView: React.FC = () => {
  const [partnerType, setPartnerType] = useState<'hospital' | 'manufacturer' | 'corporate' | 'pharmacy'>('hospital');
  const [orgName, setOrgName] = useState('');
  const [repName, setRepName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div
        className="rounded-3xl p-8 sm:p-12 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #007A33 0%, #004D21 100%)' }}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <Handshake size={16} className="text-emerald-300" aria-hidden="true" />
            <span>Strategic Alliances & Distribution</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Partner with Cedar Point Chemist
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl">
            We collaborate with healthcare facilities, global pharmaceutical manufacturers, corporate institutions, and community pharmacies to expand access to high-quality medicine across Ghana.
          </p>
        </div>
      </div>

      {/* 2. Four Partnership Frameworks */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            How We Partner
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Structured engagement models designed for mutual growth, supply reliability, and optimal patient outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              id: 'hospital',
              index: '01',
              title: 'Hospitals, Clinics & Maternity Centers',
              desc: 'Dependable formulary supply for inpatient and outpatient wards. We offer priority dispatch across Greater Accra, 30-day payment accounts for accredited institutions, and emergency weekend deliveries.',
              benefits: [
                'Guaranteed cold-chain transport for vaccines and antibiotics',
                'Batch documentation & FDA Ghana Certificates of Analysis',
                'Consignment and scheduled monthly refill programs',
              ],
            },
            {
              id: 'manufacturer',
              index: '02',
              title: 'Pharmaceutical Manufacturers & Brands',
              desc: 'Expand your reach into the Ghanaian market. We act as local registration partners and wholesale distributors for international manufacturers seeking reputable representation in West Africa.',
              benefits: [
                'Established distribution network spanning all 16 regions of Ghana',
                'Climate-controlled warehousing at our Abelemkpe headquarters',
                'Dedicated field representatives visiting doctors and chemists',
              ],
            },
            {
              id: 'corporate',
              index: '03',
              title: 'Corporate Wellness & Employee Sickbays',
              desc: 'Tailored occupational health solutions for banks, telecom companies, schools, and corporate offices. Stock your sickbay with essential first-aid and daily micronutrient support.',
              benefits: [
                'Annual employee multivitamin packs (Zurion & Hemosoft)',
                'Quarterly on-site blood pressure and blood sugar screenings',
                'Direct-to-office rapid dispensing for staff prescriptions',
              ],
            },
            {
              id: 'pharmacy',
              index: '04',
              title: 'Community Pharmacy Alliances',
              desc: 'Independent retail pharmacies can access volume discount tiers on fast-moving medications like Cenart Forte, Ultrox, and Cantab without burdensome minimum order requirements.',
              benefits: [
                'Sale-or-return agreements on select promotional lines',
                'Free deliveries within Greater Accra on orders above GHS 500',
                'Direct WhatsApp reordering desk with dedicated account managers',
              ],
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-xs font-bold text-emerald-800 mb-3 tracking-wider">
                  {item.index}
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {item.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check size={16} className="text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Partnership Proposal Form */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xs">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Submit a Partnership Proposal
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Tell us about your organization and how we can collaborate. Our business development team will respond within 24 to 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100">
              <div className="w-10 h-10 rounded-full border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <Check size={20} aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                Partnership Proposal Received
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-gray-900">{repName}</span> from <span className="font-bold text-gray-900">{orgName}</span>. Our corporate partnerships desk has received your details and will initiate contact via <span className="font-semibold text-gray-900">{email || phone}</span>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Partnership Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'hospital', label: 'Hospital/Clinic' },
                    { id: 'manufacturer', label: 'Manufacturer' },
                    { id: 'corporate', label: 'Corporate Office' },
                    { id: 'pharmacy', label: 'Retail Chemist' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPartnerType(cat.id as any)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-colors ${
                        partnerType === cat.id
                          ? 'border-[#007A33] bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Organization / Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Ridge Wellness Center"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Representative Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    placeholder="e.g. Dr. Ama Serwaa (Medical Director)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Phone Number (Direct / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partnerships@organization.com.gh"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Partnership Scope or Product Line Interests *
                </label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Outline your expected monthly volume, specific therapeutic lines (e.g. Antimalarials, Hematinics, Multivitamins), and target timeline..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <BrandButton
                type="submit"
                variant="primary"
                size="md"
                fullWidth
              >
                Send Partnership Proposal
              </BrandButton>
            </form>
          )}
        </div>
      </section>

      {/* 4. Direct Contact Strip */}
      <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={16} className="text-emerald-700 shrink-0" aria-hidden="true" />
          <span>Prefer a direct meeting? Visit our executive office at No 5 Malm Street, Abelemkpe Accra.</span>
        </div>
        <div className="flex items-center gap-4 text-gray-900 font-bold shrink-0">
          <a href={`tel:${SITE_IDENTITY.contact.phone}`} className="flex items-center gap-1.5 hover:text-emerald-700">
            <Phone size={16} className="text-emerald-700" aria-hidden="true" />
            <span>{SITE_IDENTITY.contact.phone}</span>
          </a>
          <a href={`mailto:${SITE_IDENTITY.contact.email}`} className="flex items-center gap-1.5 hover:text-emerald-700">
            <Envelope size={16} className="text-emerald-700" aria-hidden="true" />
            <span>{SITE_IDENTITY.contact.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
