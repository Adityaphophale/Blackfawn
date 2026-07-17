import React, { useState } from 'react';
import { X, Star, Truck, ShieldCheck, RefreshCw, AlertCircle, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

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
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
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

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div id="quickview-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      {/* Absolute Backdrop Click Trigger */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-4xl bg-white border border-black/10 rounded-md overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto z-10 text-black shadow-2xl"
      >
        {/* Close Button */}
        <button
          id="close-quickview-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X size={16} />
        </button>

        {/* Left half: Immersive Image Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col bg-neutral-50">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-black/5 rounded-md">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1">
                -{discountPercent}% OFF
              </span>
            )}
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails indicator */}
          <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1.5">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-14 aspect-[3/4] object-cover rounded-md border transition-all relative shrink-0 overflow-hidden ${
                  activeImageIdx === idx ? 'border-black scale-[1.02]' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right half: Detailed metrics and add inputs */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-black/10">
          <div className="space-y-5">
            {/* Meta */}
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                {product.category}
              </span>
              <span className="text-neutral-300 text-[10px]">•</span>
              <span className="text-[8px] font-mono tracking-[0.25em] text-black uppercase font-bold">
                {product.fit} SILHOUETTE
              </span>
            </div>

            {/* Name */}
            <div>
              <h2 className="text-lg sm:text-xl font-serif text-black tracking-wide leading-tight">
                {product.name}
              </h2>
              {/* Ratings */}
              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  {product.rating} ({product.reviewCount} reports)
                </span>
              </div>
            </div>

            {/* Prices */}
            <div className="flex items-baseline gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-xl font-display font-black text-black font-serif">₹{product.discountPrice}</span>
                  <span className="text-xs font-mono text-neutral-400 line-through">₹{product.price}</span>
                  <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest font-bold">
                    You Save ₹{product.price - product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-xl font-display font-black text-black font-serif">₹{product.price}</span>
              )}
            </div>

            {/* Descriptive story block - Zara style */}
            <p className="text-[11px] text-neutral-600 leading-relaxed uppercase tracking-wider font-serif">
              {product.description}
            </p>

            {/* Specs list */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2 border-t border-b border-black/10 py-4">
              <div>
                <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">FABRIC MASS</span>
                <span className="text-[10px] font-mono text-black uppercase font-bold">{product.material}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">PATTERN TREATMENT</span>
                <span className="text-[10px] font-mono text-black uppercase font-bold">{product.pattern}</span>
              </div>
            </div>

            {/* Color swatches */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">
                SELECT COLOR: <span className="text-black font-bold">{selectedColor}</span>
              </span>
              <div className="flex gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      selectedColor === c.name ? 'border-black scale-110 shadow-xs' : 'border-black/10 opacity-50 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes selector */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">
                SELECT SIZE: <span className="text-black font-bold">{selectedSize}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 text-xs font-mono border uppercase tracking-wider transition-all rounded-md ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-neutral-100 border-black/10 text-neutral-600 hover:text-black hover:border-black/30'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Pincode checking tool */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">
                DELIVERY PINCODE VERIFICATION
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); setDeliveryMessage(''); }}
                  placeholder="ENTER 6-DIGIT PINCODE"
                  className="bg-white border border-black/15 text-black px-3 py-2 text-[10px] font-mono focus:border-black/30 outline-none uppercase tracking-widest flex-1 rounded-md"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-100 border border-black/15 text-black text-[10px] font-display font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-md"
                >
                  CHECK
                </button>
              </form>
              {deliveryMessage && (
                <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Truck size={10} className="text-neutral-700" /> {deliveryMessage}
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex gap-3 pt-6 border-t border-black/10 mt-6">
            <button
              id="quickview-add-cart-btn"
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="flex-1 py-3.5 bg-neutral-100 hover:bg-neutral-200 border border-black/15 text-black text-xs font-display font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 rounded-md"
            >
              <ShoppingBag size={14} /> ADD TO BAG
            </button>
            <button
              id="quickview-buy-now-btn"
              onClick={() => onBuyNow(product, selectedSize, selectedColor)}
              className="flex-1 py-3.5 bg-black text-white text-xs font-display font-black tracking-widest uppercase hover:bg-neutral-800 transition-all rounded-md"
            >
              BUY IT NOW
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
