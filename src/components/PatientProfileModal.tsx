import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Package,
  Truck,
  FileText,
  Clock,
  MapPin,
  Check,
  Copy,
  Calendar,
  Pill,
  ShieldCheck,
  ArrowRight,
  ChatCircleText,
  Phone,
  Envelope,
  FloppyDisk,
} from '@phosphor-icons/react';
import {
  RecentOrderItem,
  PatientProfile,
  PrescriptionItem,
  INITIAL_PRESCRIPTIONS,
  loadPatientProfile,
  savePatientProfile,
} from '../data/patientProfileData';
import { SITE_IDENTITY } from '../data/pharmacyData';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: RecentOrderItem[];
  onTrackOrder: (orderId: string) => void;
  onConsultPharmacist: () => void;
  defaultTab?: 'orders' | 'profile' | 'prescriptions';
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  orders,
  onTrackOrder,
  onConsultPharmacist,
  defaultTab = 'orders',
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'prescriptions'>(defaultTab);
  const [profile, setProfile] = useState<PatientProfile>(loadPatientProfile);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(INITIAL_PRESCRIPTIONS);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const [refillRequestedId, setRefillRequestedId] = useState<string | null>(null);

  // Sync profile when opened
  useEffect(() => {
    if (isOpen) {
      setProfile(loadPatientProfile());
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    savePatientProfile(profile);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleRequestRefill = (rxId: string) => {
    setRefillRequestedId(rxId);
    setTimeout(() => setRefillRequestedId(null), 3000);
  };

  const activeInTransitCount = orders.filter(
    (o) => o.stage === 'transit' || o.stage === 'dispensed' || o.stage === 'review'
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 bg-[#007A33] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
              <User size={22} weight="bold" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="profile-modal-title" className="font-heading text-base sm:text-lg font-bold text-white tracking-tight">
                  {profile.fullName}
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-200 tracking-wider">
                  {profile.id}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-normal">
                Cedar Point Patient Portal · Licensed Pharmacy GA-165
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50/90 px-4 sm:px-6 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#007A33] text-[#007A33] bg-white rounded-t-lg -mb-px'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package size={16} aria-hidden="true" />
            <span>Recent Orders</span>
            <span className="bg-emerald-100 text-[#007A33] px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#007A33] text-[#007A33] bg-white rounded-t-lg -mb-px'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <User size={16} aria-hidden="true" />
            <span>Patient Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prescriptions')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'border-[#007A33] text-[#007A33] bg-white rounded-t-lg -mb-px'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Pill size={16} aria-hidden="true" />
            <span>Prescriptions</span>
            <span className="bg-emerald-100 text-[#007A33] px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums">
              {prescriptions.length}
            </span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: RECENT ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Summary Metrics Bar */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Total Orders
                    </span>
                    <span className="font-heading font-bold text-gray-900 text-sm">
                      {orders.length} Fulfilled
                    </span>
                  </div>
                  <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Active In-Transit
                    </span>
                    <span className="font-heading font-bold text-emerald-800 text-sm">
                      {activeInTransitCount} Processing
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500">Abelemkpe Dispatch Hub GA-165</span>
                </div>
              </div>

              {/* List of Orders */}
              <div className="space-y-3">
                {orders.map((order) => {
                  const isDelivered = order.stage === 'delivered';
                  const isTransit = order.stage === 'transit';
                  const isReview = order.stage === 'review';
                  const isDispensed = order.stage === 'dispensed';

                  return (
                    <div
                      key={order.orderId}
                      className="p-4 sm:p-4.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-all shadow-2xs space-y-3"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-gray-900">
                            {order.orderId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyOrderId(order.orderId)}
                            className="p-1 rounded-md text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Copy Order ID"
                            aria-label="Copy order reference"
                          >
                            {copiedOrderId === order.orderId ? (
                              <Check size={14} className="text-emerald-600" aria-hidden="true" />
                            ) : (
                              <Copy size={14} aria-hidden="true" />
                            )}
                          </button>
                          {copiedOrderId === order.orderId && (
                            <span className="text-[10px] text-emerald-700 font-semibold animate-in fade-in">
                              Copied
                            </span>
                          )}
                        </div>

                        {/* Status Label with colored indicator dot (anti-pill rule) */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isDelivered
                                ? 'bg-emerald-500'
                                : isTransit
                                ? 'bg-blue-500 animate-pulse'
                                : isDispensed
                                ? 'bg-teal-500'
                                : 'bg-amber-500'
                            }`}
                            aria-hidden="true"
                          />
                          <span
                            className={
                              isDelivered
                                ? 'text-emerald-800'
                                : isTransit
                                ? 'text-blue-700'
                                : isDispensed
                                ? 'text-teal-800'
                                : 'text-amber-800'
                            }
                          >
                            {order.statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Items and Destination */}
                      <div className="space-y-1.5 text-xs">
                        <div className="text-gray-500 flex flex-wrap items-center gap-2 text-[11px]">
                          <span>{order.createdAt}</span>
                          <span aria-hidden="true">·</span>
                          <span>{order.deliveryMethod}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-gray-600 truncate max-w-xs">
                            {order.destinationArea}
                          </span>
                        </div>

                        {/* Item list */}
                        <div className="pt-1 space-y-1">
                          {order.itemsSummary.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-800 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" aria-hidden="true" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer of Card: Price & Track Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Total Paid
                          </span>
                          <span className="font-heading font-bold text-emerald-800 text-sm sm:text-base tabular-nums">
                            GHS {order.totalAmountGhs.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onTrackOrder(order.orderId);
                            }}
                            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            title={`Track live status for ${order.orderId}`}
                          >
                            <Truck size={15} aria-hidden="true" />
                            <span>Track Fulfillment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PATIENT INFO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#007A33]" aria-hidden="true" />
                  <span>Verified Patient File · Cedar Point Chemist Clinical Record</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-800">
                  {profile.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-1">
                  <label htmlFor="patient-name" className="font-bold text-gray-700">
                    Full Legal Name
                  </label>
                  <input
                    id="patient-name"
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#007A33] focus:outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="patient-phone" className="font-bold text-gray-700">
                    Phone (Mobile Money & Delivery)
                  </label>
                  <input
                    id="patient-phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#007A33] focus:outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="patient-email" className="font-bold text-gray-700">
                    Email for Digital Invoices
                  </label>
                  <input
                    id="patient-email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#007A33] focus:outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="patient-nhis" className="font-bold text-gray-700">
                    NHIS / Private Insurance Number
                  </label>
                  <input
                    id="patient-nhis"
                    type="text"
                    value={profile.nhisNumber || ''}
                    onChange={(e) => setProfile({ ...profile, nhisNumber: e.target.value })}
                    placeholder="e.g. NHIS-GA-09248102"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#007A33] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label htmlFor="patient-address" className="font-bold text-gray-700">
                  Primary Greater Accra Delivery Address
                </label>
                <input
                  id="patient-address"
                  type="text"
                  value={profile.primaryAddress}
                  onChange={(e) => setProfile({ ...profile, primaryAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#007A33] focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1 text-xs">
                <label htmlFor="patient-allergies" className="font-bold text-gray-700">
                  Medical Allergies & Adverse Drug Reactions (For Pharmacist Screening)
                </label>
                <textarea
                  id="patient-allergies"
                  rows={2}
                  value={profile.knownAllergies}
                  onChange={(e) => setProfile({ ...profile, knownAllergies: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-[#007A33] focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FloppyDisk size={16} aria-hidden="true" />
                  <span>Save Profile Details</span>
                </button>

                {profileSavedToast && (
                  <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1 animate-in fade-in">
                    <Check size={14} className="text-emerald-600" />
                    <span>Profile saved successfully</span>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB 3: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs border-b border-gray-100 pb-2">
                <span className="font-semibold text-gray-600">Active Prescriptions on File</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onConsultPharmacist();
                  }}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <ChatCircleText size={14} />
                  <span>Consult Pharmacist</span>
                </button>
              </div>

              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-all shadow-2xs space-y-2.5 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Pill size={16} className="text-[#007A33]" aria-hidden="true" />
                        <span className="font-heading font-bold text-gray-900 text-sm">
                          {rx.medicationName}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-semibold ${
                          rx.refillStatus === 'due-soon'
                            ? 'text-amber-800'
                            : 'text-emerald-800'
                        }`}
                      >
                        {rx.daysRemaining} days of supply remaining
                      </span>
                    </div>

                    <div className="space-y-1 text-gray-700">
                      <div className="font-medium text-gray-900">
                        Directions: <span className="text-gray-700 font-normal">{rx.dosage}</span>
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        Prescriber: {rx.prescribingDoctor} · Issued {rx.issuedDate}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <span className="text-[11px] text-gray-500">
                        Next scheduled refill: <span className="font-semibold text-gray-800">{rx.nextRefillDate}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRequestRefill(rx.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs transition-colors cursor-pointer"
                        >
                          {refillRequestedId === rx.id ? 'Refill Docket Queued!' : 'Order Refill'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <a
              href={`tel:${SITE_IDENTITY.contact.phone}`}
              className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-semibold hover:underline"
            >
              <Phone size={14} aria-hidden="true" />
              <span>Pharmacy Helpline ({SITE_IDENTITY.contact.phone})</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
