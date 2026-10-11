import React, { useState, useEffect } from 'react';
import {
  X,
  MagnifyingGlass,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ShieldCheck,
  Thermometer,
  Copy,
  Check,
  PhoneCall,
  ArrowCounterClockwise,
  MapPin,
  User,
  Info,
  CircleNotch,
} from '@phosphor-icons/react';
import {
  TrackedOrder,
  PRESET_TRACKING_ORDERS,
  fetchOrderTracking,
} from '../data/mockFulfillmentService';
import { SITE_IDENTITY } from '../data/pharmacyData';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [activeOrder, setActiveOrder] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // When opened with an initial order ID (e.g. straight from Cart checkout), auto-load it
  useEffect(() => {
    if (isOpen) {
      const orderToLoad = initialOrderId || 'CPC-8492';
      setSearchInput(orderToLoad);
      handleSearch(orderToLoad);
    } else {
      setActiveOrder(null);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [isOpen, initialOrderId]);

  // Handle Escape key to close
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

  const handleSearch = async (orderIdToFetch?: string) => {
    const id = (orderIdToFetch || searchInput).trim();
    if (!id) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const result = await fetchOrderTracking(id);
      setActiveOrder(result);
    } catch {
      setActiveOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handlePresetClick = (presetId: string) => {
    setSearchInput(presetId);
    handleSearch(presetId);
  };

  const handleCopyOrderId = () => {
    if (!activeOrder) return;
    navigator.clipboard.writeText(activeOrder.orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setActiveOrder(null);
    setHasSearched(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-order-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 bg-linear-to-r from-emerald-900 via-[#007A33] to-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/15">
              <Package size={22} weight="duotone" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="track-order-modal-title" className="font-heading text-base sm:text-lg font-bold text-white tracking-tight">
                  Track Pharmacy Order
                </h2>
                <span className="text-[10px] uppercase font-semibold text-emerald-200 tracking-wider">
                  Accra Hub
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-normal">
                Cedar Point Chemist · Licensed Pharmacy Fulfillment GA-165
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close track order modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Search Box Form */}
          <form onSubmit={handleFormSubmit} className="space-y-2.5">
            <label htmlFor="order-id-input" className="block text-xs font-bold text-gray-700">
              Enter Order Reference ID
            </label>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="order-id-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. CPC-8492 or CPC-6120"
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 focus:border-[#007A33] rounded-xl text-xs sm:text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 transition-all uppercase"
                />
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Clear order input"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <CircleNotch size={16} className="animate-spin" aria-hidden="true" />
                    <span>Tracking...</span>
                  </>
                ) : (
                  <span>Track Status</span>
                )}
              </button>
            </div>

            {/* Quick Demo Order Chips */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                <span className="font-semibold text-gray-600">Sample fulfillment stages to test:</span>
                <span className="text-[10px] text-gray-400">Click to preview live update</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(PRESET_TRACKING_ORDERS).map((preset) => {
                  const isSelected = activeOrder?.orderId === preset.orderId;
                  const stageLabels: Record<string, string> = {
                    transit: 'In Transit',
                    review: 'Pharmacist Review',
                    dispensed: 'Dispensed',
                    delivered: 'Delivered',
                  };

                  return (
                    <button
                      key={preset.orderId}
                      type="button"
                      onClick={() => handlePresetClick(preset.orderId)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-mono text-[11px] text-[#007A33] font-bold">
                        {preset.orderId}
                      </span>
                      <span className="text-gray-400 text-[10px]">·</span>
                      <span className="text-[11px] text-gray-600">
                        {stageLabels[preset.currentStage]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in duration-150">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A33]">
                <CircleNotch size={26} className="animate-spin" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-gray-900">
                  Querying Abelemkpe Dispensary Logs...
                </div>
                <div className="text-xs text-gray-500">
                  Checking batch records, clinical sign-offs, and dispatch courier status
                </div>
              </div>
            </div>
          )}

          {/* Active Order Details */}
          {!isLoading && activeOrder && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Order Status Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-emerald-50/70 via-white to-gray-50 border border-emerald-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm sm:text-base font-bold text-emerald-900">
                      {activeOrder.orderId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOrderId}
                      className="p-1 rounded-md text-gray-400 hover:text-emerald-800 hover:bg-emerald-100/50 transition-colors cursor-pointer"
                      title="Copy Order ID"
                      aria-label="Copy order reference"
                    >
                      {copiedId ? (
                        <Check size={14} className="text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Copy size={14} aria-hidden="true" />
                      )}
                    </button>
                    {copiedId && (
                      <span className="text-[10px] text-emerald-700 font-semibold animate-in fade-in">
                        Copied!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock size={14} className="text-emerald-700" aria-hidden="true" />
                    <span>Placed {activeOrder.placedAt}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        activeOrder.currentStage === 'delivered'
                          ? 'bg-emerald-500'
                          : activeOrder.currentStage === 'transit'
                          ? 'bg-blue-500 animate-pulse'
                          : activeOrder.currentStage === 'dispensed'
                          ? 'bg-teal-500'
                          : 'bg-amber-500'
                      }`}
                      aria-hidden="true"
                    />
                    <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900">
                      {activeOrder.statusHeadline}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 pl-4.5 leading-relaxed">
                    {activeOrder.statusDetail}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-100 space-y-0.5">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Estimated Arrival
                    </div>
                    <div className="font-semibold text-gray-800">
                      {activeOrder.estimatedDelivery}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-gray-100 space-y-0.5">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Delivery Destination
                    </div>
                    <div className="font-semibold text-gray-800 truncate" title={activeOrder.destinationAddress}>
                      {activeOrder.destinationArea}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Fulfillment Timeline */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-heading text-sm sm:text-base font-bold text-gray-900">
                    Dispensary Fulfillment Milestones
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    Step{' '}
                    {activeOrder.steps.findIndex((s) => s.status === 'current') + 1 ||
                      (activeOrder.currentStage === 'delivered' ? 5 : 1)}{' '}
                    of 5
                  </span>
                </div>

                <div className="relative pl-6 sm:pl-8 space-y-6">
                  {/* Vertical Progress Line */}
                  <div
                    className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />

                  {activeOrder.steps.map((step) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    const isUpcoming = step.status === 'upcoming';

                    return (
                      <div key={step.id} className="relative group">
                        {/* Step Icon Node */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-[#007A33] text-white shadow-xs'
                              : isCurrent
                              ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-xs'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          }`}
                          aria-hidden="true"
                        >
                          {isCompleted ? (
                            <Check size={12} weight="bold" />
                          ) : isCurrent ? (
                            <Clock size={12} weight="bold" className="animate-spin" />
                          ) : (
                            <span className="text-[10px] font-bold">{step.stepNumber}</span>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span
                              className={`text-xs sm:text-sm font-bold ${
                                isCurrent
                                  ? 'text-amber-900'
                                  : isCompleted
                                  ? 'text-gray-900'
                                  : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-mono text-gray-500">
                              {step.timestamp}
                            </span>
                          </div>

                          <p
                            className={`text-xs leading-relaxed ${
                              isUpcoming ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {step.subtitle}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 pt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-gray-400" aria-hidden="true" />
                              <span>{step.location}</span>
                            </span>
                          </div>

                          {step.pharmacistNote && (
                            <div className="mt-1.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-1.5">
                              <ShieldCheck
                                size={14}
                                className="text-[#007A33] shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <div>
                                <span className="font-semibold">Pharmacist Sign-Off:</span>{' '}
                                {step.pharmacistNote}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pharmacy Verification & Order Dossier */}
              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <ShieldCheck size={16} className="text-[#007A33]" aria-hidden="true" />
                  <span>Clinical Pharmacy Verification Dossier</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Dispensary & Oversight
                    </span>
                    <div className="font-medium text-gray-900">
                      {activeOrder.superintendentPharmacist}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Reg. {activeOrder.pharmacistRegistration} · Cedar Point Abelemkpe
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Delivery & Handling
                    </span>
                    <div className="font-medium text-gray-900">
                      {activeOrder.courierService}
                    </div>
                    {activeOrder.courierRiderName && (
                      <div className="text-[11px] text-gray-500">
                        Rider: {activeOrder.courierRiderName}
                      </div>
                    )}
                  </div>
                </div>

                {activeOrder.coldChainRequired && (
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer size={16} className="text-sky-700 shrink-0" aria-hidden="true" />
                      <div>
                        <span className="font-semibold">Cold-Chain Protocol Verified:</span>{' '}
                        <span>Maintained at {activeOrder.coldChainTemperature || '2°C - 8°C'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-sky-200/70 text-sky-900 px-1.5 py-0.5 rounded">
                      Passed
                    </span>
                  </div>
                )}

                {/* Items Summary in package */}
                <div className="pt-2 border-t border-gray-200/70 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Prescribed Medication Package Contents
                  </span>
                  <ul className="space-y-1">
                    {activeOrder.itemsSummary.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-800 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Not Found State */}
          {!isLoading && hasSearched && !activeOrder && (
            <div className="py-8 px-4 text-center rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Info size={20} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-900">
                  No active record found for "{searchInput}"
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Please verify your receipt reference number (starts with CPC-). You can also click any of the sample orders above to see how fulfillment tracking works.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowCounterClockwise size={14} aria-hidden="true" />
                <span>Try Another Order ID</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Toolbar */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <a
              href={`tel:${SITE_IDENTITY.contact.phone}`}
              className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-semibold hover:underline"
            >
              <PhoneCall size={14} aria-hidden="true" />
              <span>Call Dispensary Desk ({SITE_IDENTITY.contact.phone})</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {activeOrder && (
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                {copiedId ? (
                  <>
                    <Check size={14} className="text-emerald-600" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} aria-hidden="true" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            )}

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
