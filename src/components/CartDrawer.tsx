import React, { useState } from 'react';
import { Product, SITE_IDENTITY } from '../data/pharmacyData';
import { ProductCardVisual } from './ProductCardVisual';
import { RecentOrderItem } from '../data/patientProfileData';
import { X, Plus, Minus, Trash, ArrowRight, Check, MapPin, Truck, ShoppingCart } from '@phosphor-icons/react';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenTrackOrder?: (orderId: string) => void;
  onOrderPlaced?: (order: RecentOrderItem) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenTrackOrder,
  onOrderPlaced,
}) => {
  const [stage, setStage] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentOption, setPaymentOption] = useState<'momo' | 'card' | 'cod'>('momo');
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeDeliveryGoal = 150;
  const deliveryFee = deliveryMethod === 'pickup' || subtotal >= freeDeliveryGoal || subtotal === 0 ? 0 : 15;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `CPC-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderId(orderNum);

    const newOrder: RecentOrderItem = {
      orderId: orderNum,
      createdAt: 'Just now',
      stage: 'review',
      statusLabel: 'Pharmacist Clinical Review',
      itemsSummary: items.map((i) => `${i.product.name} (${i.product.dosage}) x${i.quantity}`),
      totalAmountGhs: grandTotal,
      destinationArea: deliveryAddress || (deliveryMethod === 'delivery' ? 'Accra Delivery' : 'Abelemkpe Dispensary'),
      deliveryMethod: deliveryMethod === 'delivery' ? 'Accra Express Courier' : 'Abelemkpe Pickup',
      canTrack: true,
    };
    onOrderPlaced?.(newOrder);

    setStage('confirmed');
    onClearCart();
  };

  const handleCloseReset = () => {
    setStage('cart');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleCloseReset}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div>
            <h2 className="font-heading text-base sm:text-lg font-bold text-gray-900">
              {stage === 'cart' && 'Dispensing Cart'}
              {stage === 'checkout' && 'Checkout & Prescription Verification'}
              {stage === 'confirmed' && 'Order Received'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Cedar Point Chemist · Licensed Pharmacy #GA-165
            </p>
          </div>
          <button
            onClick={handleCloseReset}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200 transition-colors cursor-pointer"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5">
          {stage === 'cart' && (
            <>
              {/* Free delivery threshold */}
              {items.length > 0 && (
                <div className="mb-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-emerald-900">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Truck size={16} className="text-[#007A33] shrink-0" aria-hidden="true" />
                      {subtotal >= freeDeliveryGoal
                        ? 'Free Accra Express Delivery Unlocked!'
                        : `Add GHS ${(freeDeliveryGoal - subtotal).toFixed(2)} for Free Delivery`}
                    </span>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007A33] transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeDeliveryGoal) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <ShoppingCart size={32} aria-hidden="true" />
                  </div>
                  <div className="font-heading font-bold text-gray-800 text-base">
                    Your cart is empty
                  </div>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Browse our pharmaceutical catalog or health bundles to select your products.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all flex flex-col gap-2.5"
                    >
                      {/* Top Row: Thumbnail + Product Info + Delete */}
                      <div className="flex items-start gap-3">
                        {/* Square product thumbnail */}
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <ProductCardVisual product={product} size="sm" showBadges={false} />
                        </div>

                        {/* Product Title and Pack Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="font-heading font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-2">
                              {product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(product.id)}
                              aria-label={`Remove ${product.name} from cart`}
                              className="p-1.5 -mr-1 -mt-0.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50/80 transition-colors shrink-0 cursor-pointer"
                            >
                              <Trash size={15} aria-hidden="true" />
                            </button>
                          </div>

                          {/* Classification & Pack Size Subtitle */}
                          <div className="mt-0.5 flex items-center flex-wrap gap-1.5 text-[11px] text-gray-500">
                            <span className="font-medium text-emerald-800">
                              {product.classification}
                            </span>
                            {product.packSize && (
                              <>
                                <span>·</span>
                                <span className="truncate max-w-[150px] sm:max-w-[180px]">
                                  {product.packSize}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Unit price */}
                          <div className="mt-1 text-[11px] text-gray-500 font-medium">
                            GHS {product.price.toFixed(2)} <span className="text-gray-400 font-normal">each</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Quantity Controls (Left) & Price Summary (Right) Clearly Aligned */}
                      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                        {/* Quantity Stepper with accessible tap targets */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Qty
                          </span>
                          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50/80 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            >
                              <Minus size={13} weight="bold" aria-hidden="true" />
                            </button>
                            <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-900 tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              aria-label={`Increase quantity of ${product.name}`}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            >
                              <Plus size={13} weight="bold" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {/* Line Total Price - Aligned to the Right */}
                        <div className="text-right">
                          <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-none mb-0.5">
                            Line Total
                          </span>
                          <span className="font-heading font-bold text-sm sm:text-base text-gray-900 tabular-nums">
                            GHS {(product.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {stage === 'checkout' && (
            <form id="cart-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Full Name / Patient Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Samuel K. Mensah"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Phone Number (for Courier & Pharmacist SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +233 24 000 0000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Delivery Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      deliveryMethod === 'delivery'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-semibold'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="text-xs">Accra Delivery</div>
                    <div className="text-[10px] text-gray-500">
                      {subtotal >= freeDeliveryGoal ? 'Free' : 'GHS 15.00'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      deliveryMethod === 'pickup'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-semibold'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="text-xs">Abelemkpe Pickup</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Free (20 mins)</div>
                  </button>
                </div>
              </div>

              {deliveryMethod === 'delivery' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Delivery Address / GhanaPost GPS *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Airport Residential, Accra (GA-012-3456)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
                  <div className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
                    <MapPin size={16} className="text-[#007A33]" aria-hidden="true" />
                    <span>Dispensary Counter Pickup</span>
                  </div>
                  <div>No 5 Malm Street, Abelemkpe Accra</div>
                  <div className="text-gray-400 mt-1">Open Mon-Sat 7:30am - 9:00pm</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Payment Method
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'momo', label: 'MTN Mobile Money / Telecel Cash' },
                    { id: 'card', label: 'Debit / Credit Card' },
                    { id: 'cod', label: 'Cash / POS on Delivery' },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                        paymentOption === pm.id
                          ? 'border-emerald-600 bg-emerald-50/50 font-medium text-emerald-900'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentOption === pm.id}
                        onChange={() => setPaymentOption(pm.id as any)}
                        className="accent-[#007A33]"
                      />
                      <span>{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 text-[11px] text-emerald-800">
                A duty pharmacist will review your order to confirm dosage safety prior to packaging.
              </div>
            </form>
          )}

          {stage === 'confirmed' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#007A33] flex items-center justify-center mx-auto">
                <Check size={32} weight="bold" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Order #{confirmedOrderId} Confirmed
                </span>
                <h3 className="font-heading text-xl font-bold text-gray-900 mt-1">
                  Medication Dispensing Scheduled
                </h3>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Thank you, <span className="font-semibold text-gray-900">{customerName || 'Valued Patient'}</span>. Our Abelemkpe dispensary team has received your order and is preparing batch packaging.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono font-bold text-gray-900">{confirmedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fulfillment:</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryMethod === 'delivery' ? 'Accra Express Courier' : 'Abelemkpe In-Store Pickup'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                  <span>Total Paid / Payable:</span>
                  <span className="text-emerald-800 font-heading">GHS {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500">
                Helpline: {SITE_IDENTITY.contact.phone} (quote your Order ID)
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {stage === 'cart' && items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  GHS {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Accra Express Delivery</span>
                <span className="font-semibold text-emerald-700">
                  {deliveryFee === 0 ? 'Free' : `GHS ${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-1.5">
                <span>Total</span>
                <span className="font-heading tabular-nums text-emerald-800">
                  GHS {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('checkout')}
              className="w-full py-3 px-4 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        {stage === 'checkout' && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex gap-2">
            <button
              type="button"
              onClick={() => setStage('cart')}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              form="cart-checkout-form"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Confirm Order (GHS {grandTotal.toFixed(2)})
            </button>
          </div>
        )}

        {stage === 'confirmed' && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 space-y-2">
            {onOpenTrackOrder && (
              <button
                type="button"
                onClick={() => {
                  handleCloseReset();
                  onOpenTrackOrder(confirmedOrderId);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Truck size={16} aria-hidden="true" />
                <span>Track Order Live ({confirmedOrderId})</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseReset}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Back to Pharmacy Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
