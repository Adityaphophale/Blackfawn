import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Ticket, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  couponApplied: Coupon | null;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  onRemoveCoupon: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  couponApplied,
  onApplyCoupon,
  onRemoveCoupon,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cart.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  // Free shipping threshold (₹999)
  const shippingThreshold = 999;
  const isFreeShipping = subtotal >= shippingThreshold;
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFree = shippingThreshold - subtotal;

  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 99;

  let discount = 0;
  if (couponApplied) {
    if (couponApplied.type === 'percentage') {
      discount = Math.round((subtotal * couponApplied.value) / 100);
    } else {
      discount = couponApplied.value;
    }
  }

  const finalTotal = Math.max(subtotal - discount + shippingFee, 0);

  const handleApplyCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    const result = await onApplyCoupon(couponCode.trim());
    if (result.success) {
      setCouponSuccess(`Coupon code "${couponCode.toUpperCase()}" applied successfully.`);
      setCouponCode('');
    } else {
      setCouponError(result.error || 'Invalid or expired coupon.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          />

          {/* Sliding Cart Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-black/10 shadow-2xl flex flex-col h-full text-black"
          >
            {/* Header */}
            <div className="p-5 border-b border-black/10 bg-neutral-50 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-black" />
                <div>
                  <h2 className="text-xs font-display font-black tracking-[0.2em] text-black uppercase">SHOPPING BAG</h2>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase">
                    {cart.length} unique item{cart.length === 1 ? '' : 's'} loaded
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 hover:text-black hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Free Shipping meter progress */}
            {cart.length > 0 && (
              <div className="bg-neutral-50 px-5 py-3 border-b border-black/10">
                <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest mb-1.5">
                  <span>METROPOLIS EXPRESS TIMELINE</span>
                  {isFreeShipping ? (
                    <span className="text-black font-bold flex items-center gap-1 font-serif">
                      <Sparkles size={10} /> FREE SHIPPING UNLOCKED
                    </span>
                  ) : (
                    <span className="text-black font-bold">₹{remainingForFree} to free shipping</span>
                  )}
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${isFreeShipping ? 'bg-black' : 'bg-neutral-600'}`}
                  />
                </div>
                {!isFreeShipping && (
                  <p className="text-[9px] text-neutral-500 uppercase font-mono mt-1">
                    Add items worth ₹{remainingForFree} or above to avoid our premium shipping flat fee.
                  </p>
                )}
              </div>
            )}

            {/* Cart Items list scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4 py-12"
                  >
                    <div className="p-4 bg-neutral-100 border border-black/10 rounded-full text-neutral-400">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-display font-bold tracking-widest text-black uppercase">Your Bag is Empty</h3>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider leading-relaxed">
                        There is no architectural apparel registered in this container. Let's fill it with drops!
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-black text-white text-[10px] font-display font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all rounded-md"
                    >
                      BROWSE ALL PRODUCTS
                    </button>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4 p-3 bg-white border border-black/10 rounded-md relative group"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 aspect-[3/4] object-cover rounded-md border border-black/10"
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h4 className="text-[11px] font-display font-bold text-black uppercase tracking-wider line-clamp-1 font-serif">
                          {item.product.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1 text-[9px] font-mono uppercase text-neutral-500">
                          <span>Size: <span className="text-black font-bold">{item.size}</span></span>
                          <span>•</span>
                          <span>Color: <span className="text-black font-bold">{item.color}</span></span>
                        </div>

                        {/* Quantity adjusters */}
                        <div className="flex items-center gap-3.5 mt-3">
                          <div className="flex items-center border border-black/10 rounded-md bg-neutral-50">
                            <button
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-black/5 transition-all"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-[10px] font-mono font-bold text-black px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-black/5 transition-all"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                            title="Remove garment"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-between shrink-0">
                        <div className="text-xs font-display font-bold text-black font-mono">
                          ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                        </div>
                        {item.product.discountPrice && (
                          <div className="text-[9px] font-mono text-neutral-400 line-through">
                            ₹{item.product.price * item.quantity}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Summary Sticky Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-black/10 bg-neutral-50 space-y-4 text-black">
                {/* Coupon Code section */}
                <div>
                  {couponApplied ? (
                    <div className="flex justify-between items-center bg-neutral-100 border border-black/10 px-3 py-2 rounded-md">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-black">
                        <Ticket size={12} />
                        <span className="font-bold uppercase tracking-widest">{couponApplied.code}</span>
                        <span className="text-neutral-500">APPLIED</span>
                      </div>
                      <button
                        onClick={onRemoveCoupon}
                        className="text-[9px] font-mono uppercase text-red-600 hover:text-black font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                        placeholder="ENTER COUPON CODE"
                        className="bg-white border border-black/15 text-black px-3 py-2 text-[10px] font-mono focus:border-black/30 outline-none uppercase tracking-widest flex-1 rounded-md"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black border border-black/10 text-white text-[10px] font-display font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors rounded-md"
                      >
                        APPLY
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[9px] font-mono text-red-600 mt-1 uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle size={10} /> {couponError}
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-[9px] font-mono text-black mt-1 uppercase tracking-wider">
                      {couponSuccess}
                    </p>
                  )}
                </div>

                {/* Subtotals layout */}
                <div className="space-y-2 text-[11px] font-mono uppercase tracking-widest">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="text-black">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-black font-bold">
                      <span>Voucher Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-500">
                    <span>Premium Air Delivery</span>
                    {shippingFee === 0 ? (
                      <span className="text-black font-bold">FREE</span>
                    ) : (
                      <span className="text-black">₹{shippingFee}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs font-display font-bold text-black pt-2 border-t border-black/10">
                    <span>Estimated Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                {/* High conversion Checkout Action Buttons */}
                <div className="pt-2">
                  <button
                    id="checkout-btn"
                    onClick={onCheckout}
                    className="w-full py-3.5 bg-black text-white text-xs font-display font-black tracking-[0.25em] uppercase hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 rounded-md"
                  >
                    PROCEED TO CHECKOUT <ArrowRight size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-neutral-500 uppercase tracking-widest pt-2">
                  <ShieldCheck size={12} className="text-neutral-700" />
                  <span>256-bit safe checkout portal</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
