import React from 'react';
import { BlogPost, Product, PRODUCTS } from '../data/pharmacyData';
import { X, Check, ArrowRight } from '@phosphor-icons/react';

interface BlogReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({
  post,
  onClose,
  onSelectProduct,
}) => {
  if (!post) return null;

  const relevantProducts =
    post.id === 'choosing-right-pharmacy'
      ? PRODUCTS.slice(0, 3)
      : PRODUCTS.filter((p) => p.category === 'Blood Pressure Management' || p.category === 'Cholesterol Management');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="font-semibold text-emerald-800">{post.category}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h2>

          <div className="mt-2 text-xs text-gray-600 pb-4 border-b border-gray-100">
            Author: <span className="font-semibold text-gray-900">{post.author}</span> · Cedar Point Chemist Clinical Desk
          </div>

          {/* Key Takeaways */}
          <div className="my-5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
              Clinical Takeaways
            </div>
            <ul className="space-y-1.5">
              {post.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-emerald-900">
                  <Check size={16} className="text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Prose */}
          <div className="space-y-3.5 text-xs md:text-sm text-gray-700 leading-relaxed">
            {post.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Related Formulations */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">
              Relevant Products at Cedar Point Chemist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {relevantProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-600 bg-gray-50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-heading font-semibold text-xs text-gray-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">
                      GHS {p.price.toFixed(2)}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-emerald-700 shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
