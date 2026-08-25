import React, { useState } from 'react';
import { X, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../../shared/types/types.ts';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}: QuickViewModalProps) {
  const defaultVariant = product.variants?.[0];
  const price = defaultVariant?.price ?? product.variants?.[0]?.price ?? 999;
  const discountPrice = defaultVariant?.salePrice ?? product.variants?.[0]?.salePrice;

  const sizes = product.variants ? Array.from(new Set(product.variants.map(v => v.size))) : ['S', 'M', 'L'];
  const colors = product.variants ? Array.from(new Set(product.variants.map(v => v.color))).map(cName => ({
    name: cName,
    hex: cName.toLowerCase().includes('black') ? '#0B0B0B' : cName.toLowerCase().includes('white') ? '#F8F7F2' : cName.toLowerCase().includes('olive') ? '#4A5D4E' : '#8B8580'
  })) : [];

  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const discountPercent = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const images = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"];

  return (
    <div id="quickview-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0B]/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-4xl bg-[#F8F7F2] border border-[#E8E5DD] flex flex-col md:flex-row max-h-[90vh] overflow-y-auto z-10 text-[#111111] shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-gray-400 hover:text-[#0B0B0B] transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        {/* Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col bg-[#FFFFFF] border-r border-[#E8E5DD]">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8F7F2] border border-[#E8E5DD]">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-[#0B0B0B] text-[#C9A227] text-[10px] font-semibold uppercase tracking-widest px-3 py-1 border border-[#C9A227]">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={images[activeImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1.5 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-14 aspect-[3/4] border transition-all relative shrink-0 overflow-hidden ${
                  activeImageIdx === idx ? 'border-[#C9A227]' : 'border-[#E8E5DD] opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase">
                {product.category}
              </span>
              <h1 className="text-2xl font-serif font-bold text-[#0B0B0B] mt-2 capitalize">{product.name}</h1>
              
              <div className="flex items-center gap-1.5 mt-2">
                <Star size={12} className="fill-[#C9A227] text-[#C9A227]" />
                <span className="text-xs font-semibold text-[#0B0B0B]">{product.rating}</span>
                <span className="text-xs text-[#666666] font-medium">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-[#FFFFFF] p-4 border border-[#E8E5DD]">
              {discountPrice ? (
                <>
                  <span className="text-xl font-bold text-[#0B0B0B]">₹{discountPrice}</span>
                  <span className="text-sm text-gray-400 line-through">₹{price}</span>
                  <span className="text-[10px] font-semibold text-[#C9A227] tracking-widest ml-auto uppercase">Privilege Saved ₹{price - discountPrice}</span>
                </>
              ) : (
                <span className="text-xl font-bold text-[#0B0B0B]">₹{price}</span>
              )}
            </div>

            <p className="text-xs text-[#666666] leading-relaxed font-light">
              {product.shortDescription || "Curated heavyweight luxury apparel engineered for modern metropolitan style."}
            </p>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#666666] uppercase tracking-widest">Color: <span className="text-[#0B0B0B]">{selectedColor}</span></span>
                <div className="flex items-center gap-2">
                  {colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-full border transition-all relative ${
                        selectedColor === c.name ? 'border-[#C9A227] scale-110 ring-2 ring-[#C9A227]/30' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-widest">Select Size</span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 border text-xs font-medium transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                        : 'bg-[#FFFFFF] border-[#E8E5DD] text-[#0B0B0B] hover:border-[#C9A227]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-8 mt-6 border-t border-[#E8E5DD]">
            <button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="flex-1 py-3.5 bg-[#FFFFFF] border border-[#0B0B0B] text-[#0B0B0B] hover:text-[#C9A227] hover:border-[#C9A227] text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={14} className="text-[#C9A227]" /> Add to Bag
            </button>
            <button
              onClick={() => onBuyNow(product, selectedSize, selectedColor)}
              className="flex-1 py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              Express Buy <ArrowRight size={14} className="text-[#C9A227]" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

