import React, { useState } from 'react';
import { Product, PRODUCTS } from '../data/pharmacyData';
import { X, Check, ShoppingCart, ArrowRight } from '@phosphor-icons/react';

interface SwitchSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const SwitchSaveModal: React.FC<SwitchSaveModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [months, setMonths] = useState<number>(3);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'zurion-multivitamin',
    'hemosoft-softgels',
    'cenart-forte',
  ]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const switchableProducts = PRODUCTS.filter(
    (p) => p.referencePrice && p.referencePrice > p.price
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedProducts = switchableProducts.filter((p) => selectedIds.includes(p.id));

  const referenceTotal = selectedProducts.reduce(
    (sum, p) => sum + (p.referencePrice || p.price) * months,
    0
  );
  const cedarTotal = selectedProducts.reduce((sum, p) => sum + p.price * months, 0);
  const totalSavings = referenceTotal - cedarTotal;
  const savingsPct = referenceTotal > 0 ? Math.round((totalSavings / referenceTotal) * 100) : 0;

  const handleSwitchAndAdd = () => {
    selectedProducts.forEach((p) => onAddToCart(p, months));
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div
          className="p-6 md:p-8 text-white flex items-start justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #007A33 0%, #004D21 100%)' }}
        >
          <div>
            <div className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Cedar Point Bioequivalence & Value Promise
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mt-1">
              Switch & Save Up to 59% Calculator
            </h2>
            <p className="text-xs md:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              Compare imported originator brands against recommended Cedar Point formulations like Zurion and Hemosoft. Same therapeutic power, FDA approved, significantly lower price.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="text-sm font-bold text-gray-900">
                Regimen Supply Duration (Packs / Months)
              </div>
              <p className="text-xs text-gray-500">
                Select your intended family or individual supply length.
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    months === m
                      ? 'bg-[#007A33] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {m} {m === 1 ? 'Month' : 'Months'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs">
                  <th className="py-2.5 pr-2">Select</th>
                  <th className="py-2.5 pr-4 font-bold text-gray-800">Cedar Point Brand</th>
                  <th className="py-2.5 pr-4 font-semibold">Imported Reference Brand</th>
                  <th className="py-2.5 pr-4 text-right">Originator Price</th>
                  <th className="py-2.5 pr-4 text-right font-bold text-emerald-800">Cedar Price</th>
                  <th className="py-2.5 text-right font-bold">You Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {switchableProducts.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  const pct = Math.round(
                    (((item.referencePrice || item.price) - item.price) /
                      (item.referencePrice || item.price)) *
                      100
                  );
                  return (
                    <tr
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      className={`cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="accent-[#007A33] w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-[11px] text-gray-500">{item.category}</div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-gray-600">
                        {item.referenceBrand}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-400 line-through tabular-nums">
                        GHS {item.referencePrice?.toFixed(2)}
                      </td>
                      <td className="py-3 pr-4 text-right font-bold text-emerald-800 tabular-nums">
                        GHS {item.price.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-900 tabular-nums">
                        Save {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Total Comparison Card */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-6 w-full md:w-auto text-left">
              <div>
                <div className="text-[11px] text-gray-500">Imported Total</div>
                <div className="text-sm font-semibold text-gray-400 line-through tabular-nums">
                  GHS {referenceTotal.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-500">Cedar Point Total</div>
                <div className="text-base font-bold text-gray-900 tabular-nums font-heading">
                  GHS {cedarTotal.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-800">Total Savings</div>
                <div className="text-base font-bold text-emerald-800 tabular-nums font-heading">
                  GHS {totalSavings.toFixed(2)} ({savingsPct}%)
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={selectedProducts.length === 0}
              onClick={handleSwitchAndAdd}
              className="w-full md:w-auto py-3 px-6 rounded-xl bg-[#007A33] hover:bg-[#005A25] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {addedSuccess ? (
                <>
                  <Check size={16} aria-hidden="true" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} aria-hidden="true" />
                  <span>Switch & Add Selected ({selectedProducts.length})</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
