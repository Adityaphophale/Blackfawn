import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, AlertCircle, Edit3, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Coupon } from '../../../shared/types/types.ts';
import GiftHamperCustomizer, { CustomizationState } from './GiftHamperCustomizer';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateCustomization?: (cartItemId: string, newCustomization: Record<string, string>, newSize?: string) => void;
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
  onUpdateCustomization,
  onCheckout,
  couponApplied,
  onApplyCoupon,
  onRemoveCoupon,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Editing customization state
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

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

  const mapRecordToCustomizationState = (rec?: Record<string, string>): Partial<CustomizationState> => {
    if (!rec) return {};
    return {
      tshirtSize: rec['T-Shirt Size'],
      tshirtText: rec['T-Shirt Text'],
      tshirtColor: rec['T-Shirt Color'],
      mugText: rec['Mug Text'],
      bottleName: rec['Water Bottle Name'],
      wishCardMessage: rec['Wish Card Message'],
      nameTagText: rec['Name Tag Text'],
      keychainText: rec['Keychain Text'],
      magnetText: rec['Fridge Magnet Text'],
      pillowText: rec['Pillow Text'],
      towelText: rec['Towel Text'],
      napkinText: rec['Hand Napkin Text'],
      capText: rec['Cap Text'],
    };
  };

  const handleSaveEditedCustomization = (customData: CustomizationState) => {
    if (!editingCartItem || !onUpdateCustomization) return;
    const custMap: Record<string, string> = {
      'T-Shirt Size': customData.tshirtSize,
      'T-Shirt Text': customData.tshirtText || 'Default',
      'T-Shirt Color': customData.tshirtColor,
      'Mug Text': customData.mugText || 'Default',
      'Water Bottle Name': customData.bottleName || 'Default',
      'Wish Card Message': customData.wishCardMessage || 'Best Wishes',
      'Name Tag Text': customData.nameTagText || 'Default',
      'Keychain Text': customData.keychainText || 'Default',
      'Fridge Magnet Text': customData.magnetText || 'Default',
      'Pillow Text': customData.pillowText || 'Default',
      'Towel Text': customData.towelText || 'Default',
      'Hand Napkin Text': customData.napkinText || 'Default',
      'Cap Text': customData.capText || 'Default',
    };
    onUpdateCustomization(editingCartItem.id, custMap, customData.tshirtSize);
    setEditingCartItem(null);
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
                    {cart.length} item{cart.length === 1 ? '' : 's'}
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
                    <span className="text-[#C9A227] flex items-center gap-1">
                      <Sparkles size={11} /> Unlocked Complimentary Priority Air Delivery
                    </span>
                  ) : (
                    <span>Add <span className="text-[#C9A227] font-bold">₹{remainingForFree}</span> more for free priority shipping</span>
                  )}
                </div>
                <div className="w-full bg-[#E8E5DD] h-1.5 mt-2 overflow-hidden rounded-full">
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
                    Explore our high-fashion drops and gift hampers to build your order.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const variant = item.product.variants?.find(v => v.size === item.size && v.color === item.color);
                  const price = variant?.salePrice || variant?.price || item.product.discountPrice || item.product.price;
                  const originalPrice = variant?.salePrice ? variant.price : item.product.discountPrice ? item.product.price : null;
                  const itemImage = variant?.images?.[0] || item.product.images?.[0];
                  const isHamperItem = item.product.category === 'Hampers & Gifting' || !!item.customization;

                  return (
                    <div key={item.id} className="p-4 bg-[#FFFFFF] border border-[#E8E5DD] rounded space-y-3">
                      <div className="flex gap-4">
                        <img
                          src={itemImage}
                          alt={item.product.name}
                          className="w-16 h-20 object-cover border border-[#E8E5DD] rounded shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-xs font-serif font-bold text-[#0B0B0B] line-clamp-1 uppercase">{item.product.name}</h3>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 cursor-pointer p-0.5"
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
                              {originalPrice && originalPrice > price && (
                                <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E5DD]">
                            <span className="text-[9px] font-semibold text-[#666666] uppercase tracking-wider">Quantity</span>
                            <div className="flex items-center border border-[#E8E5DD] bg-[#F8F7F2] rounded overflow-hidden">
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

                      {/* Customization Details Summary for Hampers */}
                      {isHamperItem && item.customization && (
                        <div className="bg-[#F8F7F2] border border-[#E8E5DD] rounded p-3 text-[10px] space-y-1.5">
                          <div className="flex justify-between items-center border-b border-[#E8E5DD] pb-1">
                            <span className="font-bold text-[#0B0B0B] uppercase tracking-wider flex items-center gap-1">
                              <Sparkles size={11} className="text-[#C9A227]" /> Customization Summary
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingCartItem(item)}
                              className="text-[#C9A227] hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer text-[9.5px]"
                            >
                              <Edit3 size={10} /> Edit Customization
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
                            {item.customization['T-Shirt Size'] && (
                              <p><span className="font-semibold text-gray-900">T-Shirt Size:</span> {item.customization['T-Shirt Size']}</p>
                            )}
                            {item.customization['T-Shirt Text'] && (
                              <p className="truncate"><span className="font-semibold text-gray-900">T-Shirt Text:</span> {item.customization['T-Shirt Text']}</p>
                            )}
                            {item.customization['Mug Text'] && (
                              <p className="truncate"><span className="font-semibold text-gray-900">Mug Text:</span> {item.customization['Mug Text']}</p>
                            )}
                            {item.customization['Water Bottle Name'] && (
                              <p className="truncate"><span className="font-semibold text-gray-900">Bottle Name:</span> {item.customization['Water Bottle Name']}</p>
                            )}
                            {item.customization['Wish Card Message'] && (
                              <p className="col-span-2 truncate"><span className="font-semibold text-gray-900">Wish Card:</span> {item.customization['Wish Card Message']}</p>
                            )}
                            {item.customization['Keychain Text'] && (
                              <p className="truncate"><span className="font-semibold text-gray-900">Keychain:</span> {item.customization['Keychain Text']}</p>
                            )}
                          </div>
                        </div>
                      )}
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
                      className="flex-1 bg-[#F8F7F2] border border-[#E8E5DD] px-3 py-2 text-xs focus:border-[#C9A227] outline-none font-mono uppercase tracking-wider rounded"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B0B0B] text-white hover:text-[#C9A227] text-xs font-semibold tracking-wider uppercase cursor-pointer border border-[#0B0B0B] rounded"
                    >
                      APPLY
                    </button>
                  </form>
                ) : (
                  <div className="bg-[#F3F1EB] border border-[#C9A227]/40 p-2.5 flex justify-between items-center text-xs rounded">
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
                  className="w-full py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md rounded"
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

          {/* EDIT CUSTOMIZATION MODAL */}
          {editingCartItem && (
            <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-[#FFFFFF] border border-[#E8E5DD] rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
                <div className="flex justify-between items-center border-b border-[#E8E5DD] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#C9A227] uppercase">BLACKFAWN Concierge</span>
                    <h3 className="text-sm font-serif font-bold text-[#0B0B0B] uppercase mt-0.5">
                      Edit Customization - {editingCartItem.product.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingCartItem(null)}
                    className="p-1 text-gray-400 hover:text-black rounded"
                  >
                    <X size={18} />
                  </button>
                </div>

                <GiftHamperCustomizer
                  initialValues={mapRecordToCustomizationState(editingCartItem.customization)}
                  isEditingInCart={true}
                  onSaveCartEdit={handleSaveEditedCustomization}
                  onAddToCart={handleSaveEditedCustomization}
                />
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
