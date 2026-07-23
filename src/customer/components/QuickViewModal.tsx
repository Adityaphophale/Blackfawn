import React, { useState } from 'react';
import { X, Star, Truck, ShieldCheck, RefreshCw, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../shared/types';

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
    hex: cName.toLowerCase().includes('black') ? '#1A1A1A' : cName.toLowerCase().includes('white') ? '#F3F4F6' : cName.toLowerCase().includes('olive') ? '#4A5D4E' : '#8B8580'
  })) : [];

  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setDeliveryMessage('Please enter a valid 6-digit PIN code.');
      return;
    }
    const firstDigit = pincode[0];
    if (['1', '2', '3', '4'].includes(firstDigit)) {
      setDeliveryMessage(`Express Shipping Active. Guaranteed delivery in ${product.deliveryDaysEst} days.`);
    } else {
      setDeliveryMessage(`Standard Shipping Active. Estimated arrival in ${product.deliveryDaysEst + 2} days.`);
    }
  };

  const discountPercent = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const images = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"];

  return (
    <div id="quickview-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto z-10 text-gray-900 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        {/* Left half: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col bg-gray-50">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-gray-100 rounded-lg">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
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

          {/* Thumbnails */}
          <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1.5 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-14 aspect-[3/4] rounded-md border transition-all relative shrink-0 overflow-hidden ${
                  activeImageIdx === idx ? 'border-[#f97316] scale-102 shadow-xs' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right half: Detailed Info */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-[#f97316] tracking-wider uppercase bg-orange-50 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <h1 className="text-xl font-bold text-gray-900 mt-2 capitalize">{product.name}</h1>
              
              {/* Stars */}
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center text-amber-500">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                </div>
                <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-400 font-medium">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {discountPrice ? (
                <>
                  <span className="text-xl font-black text-gray-900">₹{discountPrice}</span>
                  <span className="text-sm text-gray-400 line-through">₹{price}</span>
                  <span className="text-xs font-bold text-emerald-600 ml-auto bg-emerald-50 px-2 py-0.5 rounded">SAVE ₹{price - discountPrice}</span>
                </>
              ) : (
                <span className="text-xl font-black text-gray-900">₹{price}</span>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {product.shortDescription || "Premium high-quality streetwear design crafted for comfort and custom styles."}
            </p>

            {/* Colors Selection */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Color: <span className="text-gray-900 font-extrabold">{selectedColor}</span></span>
                <div className="flex items-center gap-2">
                  {colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-full border transition-all relative ${
                        selectedColor === c.name ? 'border-[#f97316] scale-110 shadow-xs ring-2 ring-[#f97316]/30' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Size</span>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 border text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#f97316] text-white border-[#f97316] shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#f97316] hover:text-[#f97316]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Check Pincode */}
            <div className="space-y-2 border-t border-gray-150 pt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery Availability Check</span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-Digit PIN code"
                  className="bg-white border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-[#f97316] outline-none rounded-lg flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black cursor-pointer shrink-0"
                >
                  Verify
                </button>
              </form>
              {deliveryMessage && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#f97316]">{deliveryMessage}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="flex-1 py-3 bg-white border border-[#f97316] text-[#f97316] text-xs font-bold rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(product, selectedSize, selectedColor)}
              className="flex-1 py-3 bg-[#f97316] hover:bg-[#e0620d] text-white text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-sm"
            >
              Buy It Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
