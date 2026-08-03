import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, AlertCircle } from 'lucide-react';
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
    const price = item.product.variants?.find(v => v.size === item.size && v.color === item.color)?.salePrice 
                  || item.product.variants?.find(v => v.size === item.size && v.color === item.color)?.price 
                  || item.product.discountPrice 
                  || item.product.price;
    return total + price * item.quantity;
  }, 0);

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
      setCouponSuccess(`Code "${couponCode.toUpperCase()}" applied successfully.`);
      setCouponCode('');
    } else {
      setCouponError(result.error || 'Invalid or expired promo code.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0B0B0B]/60 backdrop-blur-xs"
          />

          {/* Sliding Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#F8F7F2] border-l border-[#E8E5DD] shadow-2xl flex flex-col h-full text-[#111111]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E8E5DD] bg-[#FFFFFF] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-[#C9A227]" />
                <div>
                  <h2 className="text-xs font-serif font-bold tracking-widest text-[#0B0B0B] uppercase">SHOPPING BAG</h2>
                  <p className="text-[10px] text-[#666666] uppercase font-medium">
                    {cart.length} garment{cart.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-[#0B0B0B] transition-colors cursor-pointer"
                aria-label="Close bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {subtotal > 0 && (
              <div className="bg-[#F3F1EB] border-b border-[#E8E5DD] px-6 py-3.5">
                <div className="flex justify-between items-center text-[10px] font-semibold text-[#0B0B0B] uppercase tracking-wider">
                  {isFreeShipping ? (
                    <span className="text-[#C9A227]">Unlocked Complimentary Air Delivery</span>
                  ) : (
                    <span>Add <span className="text-[#C9A227] font-bold">₹{remainingForFree}</span> more for free priority shipping</span>
                  )}
                </div>
                <div className="w-full bg-[#E8E5DD] h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-[#C9A227] transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={44} className="text-gray-300" />
                  <p className="text-sm font-serif font-bold text-[#0B0B0B] uppercase tracking-wider">Your shopping bag is empty</p>
                  <p className="text-xs text-[#666666] max-w-xs leading-relaxed font-light">
                    Explore our high-fashion drops and select garments to build your order.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer"
                  >
                    Explore Drops
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const variant = item.product.variants?.find(v => v.size === item.size && v.color === item.color);
                  const price = variant?.salePrice || variant?.price || item.product.discountPrice || item.product.price;
                  const originalPrice = variant?.salePrice ? variant.price : item.product.discountPrice ? item.product.price : null;
                  const itemImage = variant?.images?.[0] || item.product.images?.[0];

                  return (
                    <div key={item.id} className="flex gap-4 p-4 bg-[#FFFFFF] border border-[#E8E5DD]">
                      <img
                        src={itemImage}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover border border-[#E8E5DD]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-xs font-serif font-bold text-[#0B0B0B] line-clamp-1 uppercase">{item.product.name}</h3>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-gray-400 hover:text-[#C9A227] cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <p className="text-[10px] text-[#666666] uppercase mt-0.5 font-medium">
                            Size: {item.size} • Color: {item.color}
                          </p>
                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="text-xs font-semibold text-[#0B0B0B]">₹{price}</span>
                            {originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8E5DD]">
                          <span className="text-[9px] font-semibold text-[#666666] uppercase tracking-wider">Quantity</span>
                          <div className="flex items-center border border-[#E8E5DD] bg-[#F8F7F2]">
                            <button
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="px-2 py-0.5 text-gray-600 hover:text-[#0B0B0B] cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={10} />
                            </button>
                            <span className="px-2 text-xs font-semibold text-[#0B0B0B]">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="px-2 py-0.5 text-gray-600 hover:text-[#0B0B0B] cursor-pointer"
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
              <div className="p-6 border-t border-[#E8E5DD] bg-[#FFFFFF] space-y-4">
                {/* Coupon Form */}
                {!couponApplied ? (
                  <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="ENTER PROMO CODE"
                      className="flex-1 bg-[#F8F7F2] border border-[#E8E5DD] px-3 py-2 text-xs focus:border-[#C9A227] outline-none font-mono uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B0B0B] text-white hover:text-[#C9A227] text-xs font-semibold tracking-wider uppercase cursor-pointer border border-[#0B0B0B]"
                    >
                      APPLY
                    </button>
                  </form>
                ) : (
                  <div className="bg-[#F3F1EB] border border-[#C9A227]/40 p-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-[#0B0B0B] uppercase tracking-wider">{couponApplied.code}</span>
                      <span className="text-[#C9A227] font-medium ml-1.5">applied ({couponApplied.description})</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-red-500 hover:underline text-[10px] font-bold tracking-wider uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-red-600 font-bold uppercase flex items-center gap-1"><AlertCircle size={10} /> {couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-[#C9A227] font-bold uppercase">{couponSuccess}</p>}

                {/* Subtotals */}
                <div className="space-y-2.5 border-t border-b border-[#E8E5DD] py-4 text-xs text-[#666666]">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-[#0B0B0B]">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#C9A227]">
                      <span>Privilege Discount</span>
                      <span className="font-semibold">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-[#0B0B0B]">
                      {shippingFee === 0 ? <span className="text-[#C9A227] font-bold uppercase">COMPLIMENTARY</span> : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#0B0B0B] border-t border-[#E8E5DD] pt-3">
                    <span className="font-serif uppercase">Total Due</span>
                    <span className="text-base text-[#0B0B0B]">₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  PROCEED TO CHECKOUT <ArrowRight size={14} className="text-[#C9A227]" />
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[9px] text-gray-400 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-[#C9A227]" />
                  <span>256-bit Encrypted SSL Concierge Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

