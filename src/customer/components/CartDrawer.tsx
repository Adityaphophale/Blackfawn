import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Ticket, AlertCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Coupon } from '../../shared/types';

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
    // Look up price from variant or product
    const price = item.product.variants?.find(v => v.size === item.size && v.color === item.color)?.salePrice 
                  || item.product.variants?.find(v => v.size === item.size && v.color === item.color)?.price 
                  || item.product.discountPrice 
                  || item.product.price;
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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-gray-250 shadow-2xl flex flex-col h-full text-black"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-gray-900" />
                <div>
                  <h2 className="text-xs font-bold tracking-wider text-gray-900 uppercase">SHOPPING BAG</h2>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">
                    {cart.length} item{cart.length === 1 ? '' : 's'} added
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {subtotal > 0 && (
              <div className="bg-orange-50 border-b border-orange-100 px-5 py-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-800 uppercase tracking-wide">
                  {isFreeShipping ? (
                    <span className="text-emerald-700">🎉 Congratulations! You have unlocked Free Express Shipping!</span>
                  ) : (
                    <span>Add <span className="text-[#f97316]">₹{remainingForFree}</span> more for FREE EXPRESS SHIPPING</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-[#f97316] transition-all duration-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3.5">
                  <ShoppingBag size={48} className="text-gray-300" />
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Your shopping bag is empty</p>
                  <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                    Explore our curated fashion collection and add items to your cart to checkout.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#f97316] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#e0620d] transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const variant = item.product.variants?.find(v => v.size === item.size && v.color === item.color);
                  const price = variant?.salePrice || variant?.price || item.product.discountPrice || item.product.price;
                  const originalPrice = variant?.salePrice ? variant.price : item.product.discountPrice ? item.product.price : null;
                  const itemImage = variant?.images?.[0] || item.product.images?.[0];

                  return (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <img
                        src={itemImage}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded-md border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-xs font-bold text-gray-900 line-clamp-1 capitalize">{item.product.name}</h3>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">
                            Size: {item.size} • Color: {item.color}
                          </p>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-xs font-bold text-gray-900">₹{price}</span>
                            {originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Quantity</span>
                          <div className="flex items-center border border-gray-250 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="p-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={10} />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="p-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-4">
                {/* Coupon Form */}
                {!couponApplied ? (
                  <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="ENTER PROMO CODE"
                      className="flex-1 bg-white border border-gray-350 px-3 py-2 text-xs focus:ring-1 focus:ring-[#f97316] outline-none rounded-lg uppercase font-mono tracking-wide"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#131921] hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      APPLY
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-emerald-800 uppercase tracking-wider">{couponApplied.code}</span>
                      <span className="text-emerald-700 font-semibold ml-1.5">applied ({couponApplied.description})</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold tracking-wider uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-red-600 font-bold uppercase flex items-center gap-1"><AlertCircle size={10} /> {couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold uppercase">{couponSuccess}</p>}

                {/* Subtotals */}
                <div className="space-y-2 border-t border-b border-gray-200 py-3.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo Discount</span>
                      <span className="font-bold">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-gray-900">
                      {shippingFee === 0 ? <span className="text-emerald-700 uppercase font-black">FREE</span> : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-900 border-t border-dashed border-gray-200 pt-3">
                    <span>Order Total</span>
                    <span className="text-base text-[#f97316]">₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-3 bg-[#f97316] hover:bg-[#e0620d] text-white text-xs font-black tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  SECURE CHECKOUT <ArrowRight size={13} />
                </button>
                
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  <span>256-bit SSL Encrypted Transaction Gateway</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
