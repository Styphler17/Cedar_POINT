import React, { useState } from 'react';
import { SITE_IDENTITY } from '../data/pharmacyData';
import { X, Check, MapPin } from '@phosphor-icons/react';

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'wholesale' | 'consult';
}

export const WholesaleModal: React.FC<WholesaleModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'wholesale',
}) => {
  const [tab, setTab] = useState<'wholesale' | 'consult'>(defaultTab);
  const [facilityName, setFacilityName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTab('wholesale');
                setSubmitted(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                tab === 'wholesale'
                  ? 'bg-[#007A33] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Wholesale & Institutional
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('consult');
                setSubmitted(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                tab === 'consult'
                  ? 'bg-[#007A33] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pharmacist Consultation
            </button>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-10 h-10 rounded-full border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <Check size={20} aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                {tab === 'wholesale' ? 'Wholesale Inquiry Registered' : 'Consultation Scheduled'}
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-gray-900">{contactName}</span>. Our superintendent pharmacist desk at Abelemkpe will contact you within 2 business hours at <span className="font-mono font-medium text-gray-900">{phone}</span>.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors"
              >
                Return to Store
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  {tab === 'wholesale'
                    ? 'Bulk Hospital & Community Pharmacy Supply'
                    : 'Speak with a Licensed Superintendent Pharmacist'}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {tab === 'wholesale'
                    ? 'Cedar Point Chemist supplies certified batches of Cenart Forte, Ultrox, Cantab, Zurion, and Hemosoft to healthcare institutions nationwide.'
                    : 'Confidential clinical guidance on drug interactions, chronic therapy refills, or prenatal supplement plans.'}
                </p>
              </div>

              {tab === 'wholesale' && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Hospital, Clinic, or Pharmacy Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. Ridge Health Center / Prime Pharmacy"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Contact Person Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Dr. Akosua Mensah"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 30 273 7720"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pharmacy@organization.com.gh"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {tab === 'wholesale'
                    ? 'Requested Products & Estimated Carton Volume'
                    : 'Your Clinical Question or Prescription Refill Details'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    tab === 'wholesale'
                      ? 'e.g. Requesting wholesale price list and 50 cartons of Cenart Forte, 30 cartons of Ultrox 10mg, and 40 cartons of Zurion.'
                      : 'e.g. Looking for pharmacist advice regarding switching from imported brand to Zurion and Hemosoft...'
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-700 shrink-0" aria-hidden="true" />
                  {SITE_IDENTITY.contact.address}
                </span>
                <span className="font-semibold text-gray-900">
                  {SITE_IDENTITY.contact.phone}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors shadow-sm"
              >
                {tab === 'wholesale'
                  ? 'Request Official Wholesale Price Catalog'
                  : 'Request Pharmacist Callback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
