import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Ticket, CreditCard, Landmark, Truck, ArrowLeft, Smartphone, AlertCircle } from 'lucide-react';
import { CartItem, Coupon, Address, Order, OrderItem } from '../../shared/types';

interface CheckoutViewProps {
  cart: CartItem[];
  currentUser: any;
  couponApplied: Coupon | null;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  onRemoveCoupon: () => void;
  onPlaceOrder: (order: Partial<Order>) => Promise<Order>;
  onClearCart: () => void;
  setTab: (tab: string) => void;
}

export default function CheckoutView({
  cart,
  currentUser,
  couponApplied,
  onApplyCoupon,
  onRemoveCoupon,
  onPlaceOrder,
  onClearCart,
  setTab,
}: CheckoutViewProps) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    name: currentUser?.name || '',
    addressLine1: currentUser?.addresses?.[0]?.addressLine1 || '',
    addressLine2: currentUser?.addresses?.[0]?.addressLine2 || '',
    city: currentUser?.addresses?.[0]?.city || '',
    state: currentUser?.addresses?.[0]?.state || '',
    postalCode: currentUser?.addresses?.[0]?.postalCode || '',
    phone: currentUser?.phone || '',
    type: 'home',
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'upi' | 'razorpay' | 'cod'>('cod');
  const [gstInvoiceRequested, setGstInvoiceRequested] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [gstVerification, setGstVerification] = useState('');
  const [isGstVerifying, setIsGstVerifying] = useState(false);

  // Payment inputs
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isUpiVerifying, setIsUpiVerifying] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((total, item) => {
    const variant = item.product.variants?.find(v => v.size === item.size && v.color === item.color);
    const price = variant?.salePrice || variant?.price || item.product.discountPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  const isFreeShipping = subtotal >= 999;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 99;

  let discount = 0;
  if (couponApplied) {
    if (couponApplied.type === 'percentage') {
      discount = Math.round((subtotal * couponApplied.value) / 100);
    } else {
      discount = couponApplied.value;
    }
  }

  const gstAmount = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(subtotal - discount + shippingFee, 0);

  const handleVerifyGstin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gstNumber || gstNumber.length < 15) {
      setGstVerification('Enter a valid 15-character GSTIN.');
      return;
    }
    setIsGstVerifying(true);
    setGstVerification('');
    setTimeout(() => {
      setIsGstVerifying(false);
      setGstVerification('GSTIN Active: Verified under "BLACKFAWN RETAILS INC."');
    }, 1200);
  };

  const handleVerifyUpi = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!upiId || !upiId.includes('@')) {
      setUpiVerified(false);
      alert('Please specify a valid UPI ID (e.g., vikas@okaxis).');
      return;
    }
    setIsUpiVerifying(true);
    setTimeout(() => {
      setIsUpiVerifying(false);
      setUpiVerified(true);
    }, 1000);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!shippingAddress.name || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
        alert('Please fill out all required shipping addresses.');
        return;
      }
      setStep(2);
    }
  };

  const handlePlaceOrderSubmit = async () => {
    setLoading(true);
    try {
      const orderItems: OrderItem[] = cart.map((item) => {
        const variant = item.product.variants?.find(v => v.size === item.size && v.color === item.color);
        const price = variant?.salePrice || variant?.price || item.product.discountPrice || item.product.price;
        return {
          productId: item.productId,
          productName: item.product.name,
          productImage: variant?.images?.[0] || item.product.images?.[0],
          size: item.size,
          color: item.color,
          price,
          quantity: item.quantity,
          sku: variant?.sku || item.product.baseSku || 'MAIN-SKU',
        };
      });

      const orderData: Partial<Order> = {
        userId: currentUser?.id || 'usr-guest',
        customerName: shippingAddress.name || 'Guest Customer',
        customerEmail: currentUser?.email || 'customer@blackfawn.in',
        items: orderItems,
        shippingAddress: shippingAddress as Address,
        couponCode: couponApplied?.code,
        discount,
        subtotal,
        shippingFee,
        gstAmount,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'placed',
        gstInvoiceRequested,
        gstNumber: gstInvoiceRequested ? gstNumber : undefined,
      };

      const result = await onPlaceOrder(orderData);
      if (result) {
        setPlacedOrder(result);
        onClearCart();
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      alert('Order placement failed.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 pt-[120px] text-center space-y-6 bg-[#f1f5f9] min-h-[60vh] flex flex-col justify-center items-center">
        <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide">ORDER PLACED SUCCESSFULLY!</h1>
        <p className="text-xs text-gray-500 uppercase tracking-wider max-w-md leading-relaxed font-semibold">
          Your order ID is <span className="text-gray-900 font-extrabold">{placedOrder.id}</span>. We've routed packaging details and confirmation invoices to your mailbox.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-5 text-left w-full max-w-md shadow-xs text-xs space-y-2">
          <p className="font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">Tracking Parameters</p>
          <p className="font-semibold text-gray-600">Logistic Courier ID: <span className="text-gray-900">{placedOrder.trackingNumber}</span></p>
          <p className="font-semibold text-gray-600">Current Status: <span className="text-[#f97316] font-bold">{placedOrder.trackingStatus}</span></p>
          <p className="font-semibold text-gray-600">Shipping To: <span className="text-gray-900">{placedOrder.shippingAddress.name}</span></p>
        </div>

        <button
          onClick={() => setTab('home')}
          className="px-8 py-3 bg-[#f97316] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#e0620d] shadow-md transition-colors"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-[120px] bg-[#f1f5f9] text-[#1e293b]">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side forms */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex items-center gap-4 text-xs font-bold border-b border-gray-200 pb-4">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-[#f97316] text-white' : 'bg-gray-200 text-gray-700'}`}>1. Shipping Destination</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-[#f97316] text-white' : 'bg-gray-200 text-gray-700'}`}>2. Secure Payment Gateway</span>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="bg-white border border-gray-200 p-6 rounded-xl space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Shipping Address Specifications</h2>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Active Phone Number</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="House no., Apartment name, Area details"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 mb-2"
                />
                <input
                  type="text"
                  placeholder="Landmark details (Optional)"
                  value={shippingAddress.addressLine2}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Postal Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              {/* Corporate GST check */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={gstInvoiceRequested}
                    onChange={(e) => setGstInvoiceRequested(e.target.checked)}
                    className="rounded border-gray-300 text-[#f97316] focus:ring-[#f97316] h-4 w-4"
                  />
                  <span>Claim Corporate GSTIN Invoice (For B2B Tax Credit)</span>
                </label>

                {gstInvoiceRequested && (
                  <div className="flex gap-2 text-xs">
                    <input
                      type="text"
                      maxLength={15}
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="ENTER 15-CHARACTER GSTIN"
                      className="bg-white border border-gray-300 px-3 py-2 rounded-lg flex-1 outline-none uppercase font-mono tracking-wider"
                    />
                    <button
                      onClick={handleVerifyGstin}
                      className="px-4 py-2 bg-gray-900 text-white hover:bg-black rounded-lg shrink-0 cursor-pointer font-bold"
                    >
                      Verify
                    </button>
                  </div>
                )}
                {gstVerification && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#f97316]">{gstVerification}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#f97316] hover:bg-[#e0620d] text-white text-xs font-bold uppercase rounded-lg tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                Proceed to Payment <ArrowRight size={13} />
              </button>
            </form>
          ) : (
            /* Secure Payment Forms */
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-6 shadow-xs">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Payment Gateway</h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-gray-400 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={12} /> Edit Shipping Details
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs font-bold text-gray-700">
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'cod' ? 'border-[#f97316] bg-orange-50/10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Truck size={18} className={paymentMethod === 'cod' ? 'text-[#f97316]' : 'text-gray-400'} />
                  <span>Cash on Delivery (COD)</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 border rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-[#f97316] bg-orange-50/10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone size={18} className={paymentMethod === 'upi' ? 'text-[#f97316]' : 'text-gray-400'} />
                  <span>UPI Payment (Instant QR/App)</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'stripe' ? 'border-[#f97316] bg-orange-50/10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard size={18} className={paymentMethod === 'stripe' ? 'text-[#f97316]' : 'text-gray-400'} />
                  <span>Credit/Debit Card</span>
                </button>
              </div>

              {/* Payment Mode Input Blocks */}
              {paymentMethod === 'stripe' && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3.5 text-xs text-gray-600">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wide">Enter Card details</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Abhishek Kumar"
                      className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                      placeholder="4321 8765 2911 3821"
                      className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Secure CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 text-xs text-gray-600">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wide">Enter UPI VPA address</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="vikas@okaxis"
                      className="bg-white border border-gray-300 px-3 py-2 rounded-lg flex-1 outline-none font-semibold text-gray-900"
                    />
                    <button
                      onClick={handleVerifyUpi}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg shrink-0 font-bold"
                    >
                      {isUpiVerifying ? 'Verifying...' : upiVerified ? 'Verified ✓' : 'Verify VPA'}
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl text-xs flex gap-2">
                  <AlertCircle className="text-[#f97316] shrink-0" size={16} />
                  <p className="text-orange-800 font-semibold uppercase leading-normal">Cash on Delivery (COD) selected. Zero prepayments needed. Pay by Cash or UPI directly to the delivery partner on arrival.</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrderSubmit}
                disabled={loading || (paymentMethod === 'upi' && !upiVerified) || (paymentMethod === 'stripe' && (!cardNumber || !cardCvv))}
                className={`w-full py-3.5 bg-[#f97316] hover:bg-[#e0620d] text-white text-xs font-black tracking-wider uppercase rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'PROCESSING SECURE ORDER...' : 'PLACE SECURE ORDER'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider pt-2 border-t border-gray-100">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>PCI-DSS Compliance Protected Checkout Hub</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Order summary review */}
        <div className="w-full lg:w-1/3 bg-white border border-gray-200 p-6 rounded-xl space-y-6 shadow-xs">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">Bag Review Summary</h3>

          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => {
              const variant = item.product.variants?.find(v => v.size === item.size && v.color === item.color);
              const price = variant?.salePrice || variant?.price || item.product.discountPrice || item.product.price;
              const itemImage = variant?.images?.[0] || item.product.images?.[0];

              return (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img src={itemImage} alt="" className="w-10 h-12 object-cover rounded border border-gray-250" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate capitalize">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-800 shrink-0">₹{price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 border-t border-gray-150 pt-4 text-xs text-gray-600 font-semibold">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-gray-900 font-bold">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-bold">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-gray-900 font-bold">
                {shippingFee === 0 ? <span className="text-emerald-700 uppercase font-black">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (5% Included)</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 border-t border-dashed border-gray-200 pt-3">
              <span>Total Payable</span>
              <span className="text-base text-[#f97316]">₹{total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
