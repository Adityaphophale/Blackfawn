import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Ticket, CreditCard, Landmark, Truck, Eye, ArrowLeft, RefreshCw, Smartphone, AlertCircle, HelpCircle } from 'lucide-react';
import { CartItem, Coupon, Address, Order } from '../types';

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
    const price = item.product.discountPrice || item.product.price;
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

  // 5% Central/State GST included
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
      setGstVerification('GSTIN Active: Verified under "BLACKFAWN METROPOLIS RETAILS INC." MH-GST division.');
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

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload: Partial<Order> = {
      userId: currentUser?.id || 'guest-user',
      customerName: shippingAddress.name,
      customerEmail: currentUser?.email || 'guest@blackfawn.in',
      items: cart.map((c) => ({
        productId: c.productId,
        productName: c.product.name,
        productImage: c.product.images[0],
        size: c.size,
        color: c.color,
        price: c.product.discountPrice || c.product.price,
        quantity: c.quantity,
      })),
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

    try {
      const order = await onPlaceOrder(orderPayload);
      setPlacedOrder(order);
      setStep(3);
      onClearCart();
    } catch (err) {
      console.error(err);
      alert("Order processing disruption. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center pt-[140px] text-black">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Archive Secure</span>
        <h2 className="text-sm font-display font-bold tracking-widest text-black uppercase mt-2 font-serif">Your Shopping Bag is empty</h2>
        <p className="text-[10px] font-mono text-neutral-500 uppercase mt-1">There are no garments configured to checkout in this session.</p>
        <button onClick={() => setTab('shop')} className="mt-6 px-6 py-2.5 bg-black text-white text-[10px] font-display font-black tracking-widest uppercase hover:bg-neutral-800 transition-colors rounded-md">
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  if (step === 3 && placedOrder) {
    return (
      <div id="checkout-success" className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 pt-[140px] animate-fade-in text-black">
        <div className="flex justify-center">
          <div className="p-4 bg-neutral-100 border border-black/10 rounded-full text-black">
            <CheckCircle2 size={48} />
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">TRANSACTION SECURE</span>
          <h1 className="text-2xl font-serif tracking-widest text-black uppercase">ORDER SECURED</h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            YOUR SECURED TRACKING CODE IS: <span className="text-black font-bold">{placedOrder.id}</span>
          </p>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed uppercase tracking-wider max-w-md mx-auto font-serif">
          Thank you for trusting BLACKFAWN. Your order drop is being prepared and packed in our Pune Metropolis warehouse. An invoice receipt has been dispatched to your mailbox.
        </p>

        {/* Order summary card */}
        <div className="bg-neutral-50 border border-black/10 p-5 rounded-md text-left text-xs font-mono max-w-md mx-auto space-y-4 shadow-xs">
          <h4 className="font-serif font-bold tracking-widest text-black uppercase border-b border-black/10 pb-2">SHIPMENT SUMMARY</h4>
          
          <div className="space-y-1.5 text-neutral-600 uppercase text-[10px]">
            <p>NAME: <span className="text-black font-semibold">{placedOrder.customerName}</span></p>
            <p>DESTINATION: <span className="text-black">{placedOrder.shippingAddress.addressLine1}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.postalCode}</span></p>
            <p>DISPATCH METHOD: <span className="text-neutral-800 font-bold">Bluedart Express Courier Active</span></p>
            <p>PAYMENT STATUS: <span className="text-black uppercase font-bold">{placedOrder.paymentStatus === 'paid' ? 'Prepaid Secure' : 'Cash on Delivery'}</span></p>
            <p>GST COMMERCIAL INVOICE: <span className="text-black">{placedOrder.gstInvoiceRequested ? `Yes (GSTIN: ${placedOrder.gstNumber})` : 'No'}</span></p>
          </div>

          <div className="border-t border-black/10 pt-3 flex justify-between text-black font-bold uppercase tracking-wider">
            <span>TOTAL AMOUNT SECURED:</span>
            <span>₹{placedOrder.total}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => { setTab('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-6 py-3 bg-neutral-100 border border-black/15 text-black text-[10px] font-display font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-md"
          >
            Track My Order
          </button>
          <button
            onClick={() => { setTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-6 py-3 bg-black text-white text-[10px] font-display font-black tracking-widest uppercase hover:bg-neutral-800 transition-colors rounded-md"
          >
            Continue Drops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[140px] min-h-screen">
      
      {/* Checkout Stepper Progress */}
      <div className="max-w-md mx-auto mb-12 flex justify-between text-[10px] font-mono tracking-widest uppercase text-neutral-400">
        <span className={step >= 1 ? 'text-black font-bold border-b border-black pb-1' : ''}>1. Destination</span>
        <span>────</span>
        <span className={step >= 2 ? 'text-black font-bold border-b border-black pb-1' : ''}>2. Payment Method</span>
        <span>────</span>
        <span>3. Complete</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Steps panels */}
        <div className="flex-1">
          {step === 1 ? (
            /* STEP 1: Address Shipping */
            <form onSubmit={handleAddressSubmit} className="space-y-6 bg-white border border-black/10 p-6 rounded-md shadow-xs">
              <h2 className="text-xs font-serif font-bold tracking-widest text-black uppercase border-b border-black/10 pb-3">SHIPMENT DESTINATION</h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Receiver Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. VIKRAM SEN"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="w-full bg-white border border-black/15 text-black px-4 py-2.5 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-wider rounded-md"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Street Address Line 1</label>
                  <input
                    type="text"
                    required
                    placeholder="FLAT, HOUSE NO., APARTMENT BLOCK"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    className="w-full bg-white border border-black/15 text-black px-4 py-2.5 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-wider rounded-md"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Street Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="LANDMARK, SECTOR, LOCALITY"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                    className="w-full bg-white border border-black/15 text-black px-4 py-2.5 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-wider rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">City</label>
                    <input
                      type="text"
                      required
                      placeholder="PUNE"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-white border border-black/15 text-black px-4 py-2.5 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-wider rounded-md"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">State</label>
                    <input
                      type="text"
                      required
                      placeholder="MAHARASHTRA"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-white border border-black/15 text-black px-4 py-2.5 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-wider rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Postal PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="411001"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border border-black/15 text-black px-4 py-2.5 text-xs font-mono focus:border-black/30 outline-none tracking-widest rounded-md"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Contact Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-white border border-black/15 text-black px-4 py-2.5 text-xs font-mono focus:border-black/30 outline-none tracking-wider rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* GST commercial invoice option - Highly professional Indian eCommerce */}
              <div className="border-t border-black/10 pt-4 space-y-3.5">
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-mono text-neutral-500 select-none">
                  <input
                    type="checkbox"
                    checked={gstInvoiceRequested}
                    onChange={(e) => setGstInvoiceRequested(e.target.checked)}
                    className="accent-black h-4 w-4"
                  />
                  <span>REQUEST GST COMMERCIAL TAX INVOICE?</span>
                </label>
                {gstInvoiceRequested && (
                  <div className="space-y-2 animate-fade-in p-4 bg-neutral-50 border border-black/10 rounded-md">
                    <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">Enter GSTIN Code (15-characters)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="27AAAAA1111A1Z1"
                        value={gstNumber}
                        onChange={(e) => { setGstNumber(e.target.value.toUpperCase()); setGstVerification(''); }}
                        className="bg-white border border-black/15 text-black px-3 py-2 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-widest flex-1 rounded-md"
                      />
                      <button
                        onClick={handleVerifyGstin}
                        className="px-4 py-2 bg-neutral-100 border border-black/15 text-black text-[10px] font-display font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-md flex items-center gap-1.5"
                      >
                        {isGstVerifying ? <RefreshCw size={10} className="animate-spin" /> : 'VERIFY'}
                      </button>
                    </div>
                    {gstVerification && (
                      <p className="text-[9px] font-mono text-black uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={10} /> {gstVerification}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white text-xs font-display font-black tracking-[0.25em] uppercase hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 rounded-md cursor-pointer"
                >
                  NEXT: SELECT PAYMENT METHOD <ArrowRight size={14} />
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Address Payment Selection */
            <form onSubmit={handlePaymentSubmit} className="space-y-6 bg-white border border-black/10 p-6 rounded-md shadow-xs animate-fade-in">
              <div className="flex justify-between items-center border-b border-black/10 pb-3">
                <h2 className="text-xs font-serif font-bold tracking-widest text-black uppercase">SELECT PAYMENT METHOD</h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[9px] font-mono text-neutral-500 hover:text-black flex items-center gap-1"
                >
                  <ArrowLeft size={10} /> BACK TO ADDRESS
                </button>
              </div>

              {/* Payment selector grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border text-left flex flex-col justify-between h-28 rounded-md transition-all relative ${
                    paymentMethod === 'cod' ? 'border-black bg-neutral-50' : 'border-black/10 bg-white'
                  }`}
                >
                  <Truck size={18} className="text-black" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-black uppercase tracking-wider">CASH ON DELIVERY</h3>
                    <p className="text-[8px] font-mono text-neutral-500 uppercase mt-1">PAY IN CASH/UPI AT DISPATCH</p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <span className="absolute top-2 right-2 text-[9px] font-mono bg-black text-white font-bold px-1.5 py-0.5 rounded-md shadow">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 border text-left flex flex-col justify-between h-28 rounded-md transition-all relative ${
                    paymentMethod === 'upi' ? 'border-black bg-neutral-50' : 'border-black/10 bg-white'
                  }`}
                >
                  <Smartphone size={18} className="text-black" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-black uppercase tracking-wider">UPI / G-PAY / PE</h3>
                    <p className="text-[8px] font-mono text-neutral-600 uppercase mt-1 font-bold">FASTEST REFUNDS ACTIVE</p>
                  </div>
                  {paymentMethod === 'upi' && (
                    <span className="absolute top-2 right-2 text-[9px] font-mono bg-black text-white font-bold px-1.5 py-0.5 rounded-md shadow">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border text-left flex flex-col justify-between h-28 rounded-md transition-all relative ${
                    paymentMethod === 'stripe' ? 'border-black bg-neutral-50' : 'border-black/10 bg-white'
                  }`}
                >
                  <CreditCard size={18} className="text-black" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-black uppercase tracking-wider">CREDIT / DEBIT CARD</h3>
                    <p className="text-[8px] font-mono text-neutral-500 uppercase mt-1">VISA, MASTERCARD, AMEX, RUPAY</p>
                  </div>
                  {paymentMethod === 'stripe' && (
                    <span className="absolute top-2 right-2 text-[9px] font-mono bg-black text-white font-bold px-1.5 py-0.5 rounded-md shadow">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 border text-left flex flex-col justify-between h-28 rounded-md transition-all relative ${
                    paymentMethod === 'razorpay' ? 'border-black bg-neutral-50' : 'border-black/10 bg-white'
                  }`}
                >
                  <Landmark size={18} className="text-black" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-black uppercase tracking-wider">NET BANKING</h3>
                    <p className="text-[8px] font-mono text-neutral-500 uppercase mt-1">SBI, HDFC, ICICI, AXIS, ETC.</p>
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <span className="absolute top-2 right-2 text-[9px] font-mono bg-black text-white font-bold px-1.5 py-0.5 rounded-md shadow">✓</span>
                  )}
                </button>
              </div>

              {/* Dynamic Input fields depending on method */}
              <div className="p-4 bg-neutral-50 border border-black/10 rounded-md">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3.5 animate-fade-in">
                    <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">Enter UPI Address ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="USERNAME@OKICICI"
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }}
                        className="bg-white border border-black/15 text-black px-3 py-2 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-widest flex-1 rounded-md"
                      />
                      <button
                        onClick={handleVerifyUpi}
                        className="px-4 py-2 bg-neutral-100 border border-black/15 text-black text-[10px] font-display font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-md flex items-center gap-1"
                      >
                        {isUpiVerifying ? <RefreshCw size={10} className="animate-spin" /> : 'VERIFY'}
                      </button>
                    </div>
                    {upiVerified && (
                      <p className="text-[9px] font-mono text-black uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={10} /> UPI ACCOUNT AUTHORISED SECURELY
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === 'stripe' && (
                  <div className="space-y-3.5 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="VIKRAM SEN"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-white border border-black/15 text-black px-3.5 py-2 text-xs font-mono focus:border-black/30 outline-none uppercase tracking-widest rounded-md"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Card Number</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4321 8765 1234 5678"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                        className="w-full bg-white border border-black/15 text-black px-3.5 py-2 text-xs font-mono focus:border-black/30 outline-none tracking-widest rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Expiry MM/YY</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-black/15 text-black px-3.5 py-2 text-xs font-mono focus:border-black/30 outline-none tracking-widest rounded-md text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">CVV Code</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white border border-black/15 text-black px-3.5 py-2 text-xs font-mono focus:border-black/30 outline-none tracking-widest rounded-md text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider leading-relaxed">
                    ● Cash on Delivery: Please keep exact cash change or be prepared to scan our courier's UPI code at delivery dispatch.
                  </p>
                )}

                {paymentMethod === 'razorpay' && (
                  <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider leading-relaxed">
                    ● Net Banking: You will be safely redirected to your secure Indian banking portal (HDFC/ICICI/SBI) once you click complete.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white text-xs font-display font-black tracking-[0.25em] uppercase hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 rounded-md cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={14} /> SECURING GATEWAY CONTROLLER...
                    </>
                  ) : (
                    <>
                      SECURE AND PLACE MY ORDER (₹{total}) <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-black" />
                <span>Encrypted 256-bit Metropolis Payment Core</span>
              </div>
            </form>
          )}
        </div>

        {/* Right side: Shopping Bag summary breakdown */}
        <div className="w-full lg:w-96 bg-white border border-black/10 p-6 rounded-md h-fit shadow-xs space-y-6">
          <h3 className="text-xs font-serif font-bold tracking-widest text-black uppercase border-b border-black/10 pb-2.5">ORDER SPECIFICATIONS</h3>
          
          {/* Items review block */}
          <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs font-mono uppercase text-neutral-600">
                <img src={item.product.images[0]} alt="" className="w-12 aspect-[3/4] object-cover rounded-md border border-black/10" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-black font-semibold line-clamp-1 text-[11px] font-serif">{item.product.name}</h4>
                  <p className="text-[9px] text-neutral-500 mt-0.5">SIZE {item.size} • COLOR {item.color}</p>
                  <p className="text-[10px] text-neutral-800 mt-1">QTY {item.quantity} × ₹{item.product.discountPrice || item.product.price}</p>
                </div>
                <span className="text-black font-bold self-start shrink-0">₹{(item.product.discountPrice || item.product.price) * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Vouchers display */}
          <div className="border-t border-black/10 pt-4">
            {couponApplied ? (
              <div className="flex justify-between items-center bg-neutral-100 border border-black/15 p-2.5 rounded-md text-[10px] font-mono text-black font-semibold">
                <span>VOUCHER "{couponApplied.code}" ACTIVE</span>
                <button type="button" onClick={onRemoveCoupon} className="text-neutral-500 font-bold uppercase hover:text-black">REMOVE</button>
              </div>
            ) : (
              <div className="flex gap-2 p-2.5 bg-neutral-50 border border-black/10 rounded-md text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex justify-between items-center">
                <span>Have a discount coupon? Apply it inside shopping bag</span>
                <HelpCircle className="text-neutral-400 cursor-pointer hover:text-black" size={14} />
              </div>
            )}
          </div>

          {/* Cost breakdown ledger */}
          <div className="border-t border-black/10 pt-4 space-y-2.5 text-[11px] font-mono uppercase tracking-widest">
            <div className="flex justify-between text-neutral-500">
              <span>BAG SUBTOTAL</span>
              <span className="text-black font-semibold">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-black font-bold">
                <span>ACTIVE VOUCHER SAVINGS</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-500">
              <span>INCLUDED TAXES (5% GST)</span>
              <span className="text-neutral-600">₹{gstAmount}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>AIR EXPRESS DISPATCH</span>
              {shippingFee === 0 ? (
                <span className="text-black font-bold">FREE</span>
              ) : (
                <span className="text-black font-semibold">₹{shippingFee}</span>
              )}
            </div>
            <div className="flex justify-between text-xs font-serif font-bold text-black pt-3 border-t border-black/10">
              <span>ESTIMATED TOTAL</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 border border-black/10 rounded-md space-y-2">
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase block">Estimated Delivery Dispatch</span>
            <p className="text-[10px] font-mono text-neutral-600 uppercase">
              Guaranteed metropolis priority dispatch within 24 hours. Delivery expected in 2-4 working days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
