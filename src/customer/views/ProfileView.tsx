import React, { useState, useEffect } from 'react';
import { User, LogIn, Lock, Mail, ClipboardList, MapPin, Ticket, ShieldCheck, Check, Plus, Trash2, Truck, Copy, LogOut } from 'lucide-react';
import { Address, Order, Coupon } from '../../shared/types';

interface ProfileViewProps {
  currentUser: any;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  onRegister: (name: string, email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  onLogout: () => void;
  onAddAddress: (address: Partial<Address>) => Promise<any>;
  onRemoveAddress: (addressId: string) => Promise<any>;
  coupons: Coupon[];
  setTab: (tab: string) => void;
}

export default function ProfileView({
  currentUser,
  onLogin,
  onRegister,
  onLogout,
  onAddAddress,
  onRemoveAddress,
  coupons,
  setTab,
}: ProfileViewProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    type: 'home',
  });

  const [orders, setOrders] = useState<Order[]>([]);

  // Load user orders
  useEffect(() => {
    if (currentUser) {
      fetch(`/api/orders/user/${currentUser.id}`)
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isRegisterMode) {
      const result = await onRegister(name, email, password);
      if (result.success) {
        setAuthSuccess('Account generated successfully. Welcome to Blackfawn.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.error || 'Registration failed');
      }
    } else {
      const result = await onLogin(email, password);
      if (result.success) {
        setAuthSuccess('Authentication successful. Welcome back.');
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.error || 'Authentication failed');
      }
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddAddress(newAddress);
      setShowAddressForm(false);
      setNewAddress({
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        type: 'home',
      });
      alert("Address saved successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestReturn = async (orderId: string, item: any, type: 'return' | 'exchange') => {
    const reason = prompt(`Specify the reason for the ${type}:`);
    if (!reason) return;
    try {
      const res = await fetch('/api/orders/request-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: type, reason, sku: item.sku, qty: item.quantity }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${type === 'return' ? 'Return' : 'Exchange'} requested successfully.`);
        // reload orders
        fetch(`/api/orders/user/${currentUser.id}`)
          .then((res) => res.json())
          .then((o) => setOrders(o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="profile-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[120px] bg-[#f1f5f9] text-[#1e293b]">
      
      {!currentUser ? (
        /* Login / Register Portal */
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-wide uppercase">
              {isRegisterMode ? 'CREATE ACCOUNT' : 'SECURE SIGN IN'}
            </h1>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {isRegisterMode ? 'Join the Blackfawn community' : 'Access your e-commerce profile'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Abhishek Kumar"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:ring-1 focus:ring-[#f97316] outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:ring-1 focus:ring-[#f97316] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-gray-400" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:ring-1 focus:ring-[#f97316] outline-none"
                />
              </div>
            </div>

            {authError && <p className="text-[10px] text-red-600 font-bold uppercase">{authError}</p>}
            {authSuccess && <p className="text-[10px] text-emerald-600 font-bold uppercase">{authSuccess}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer shadow-md"
            >
              {isRegisterMode ? 'REGISTER NOW' : 'AUTHENTICATE'}
            </button>
          </form>

          <div className="text-center border-t border-gray-200 pt-4">
            <button
              onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); setAuthSuccess(''); }}
              className="text-[10px] text-[#f97316] hover:underline font-bold uppercase tracking-wider"
            >
              {isRegisterMode ? 'ALREADY A MEMBER? SECURE SIGN IN' : 'NEW TO BLACKFAWN? CREATE PROFILE'}
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Col 1: Profile Summary */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-orange-100 rounded-full flex items-center justify-center text-lg font-black text-[#f97316] uppercase">
                {currentUser.name.substring(0, 2)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 capitalize">{currentUser.name}</h2>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[8.5px] bg-[#f97316] text-white font-bold px-2 py-0.5 rounded-md uppercase">
                  {currentUser.role} Account
                </span>
              </div>
            </div>

            {/* Loyalty points card */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Loyalty Points Balance</span>
              <span className="text-3xl font-black text-[#f97316] mt-1 block">🏆 {currentUser.points}</span>
              <p className="text-[9px] text-orange-700 font-semibold uppercase mt-1 leading-normal">Points auto-earned on orders. Cash back redeemable on next checkout.</p>
            </div>

            {/* Account Settings */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <button
                onClick={onLogout}
                className="w-full py-2.5 border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut size={14} /> SIGN OUT
              </button>
            </div>
          </div>

          {/* Col 2 & 3: Tabs details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Orders Archive */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <ClipboardList size={18} className="text-[#f97316]" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">ORDERS TRACKER ARCHIVE</h3>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-gray-500 font-medium py-4">No order instances located in your client registry.</p>
              ) : (
                <div className="space-y-6 divide-y divide-gray-150">
                  {orders.map((order, idx) => (
                    <div key={order.id} className={`space-y-4 ${idx > 0 ? 'pt-6' : ''}`}>
                      <div className="flex flex-wrap justify-between items-center gap-2.5">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block">ORDER NUMBER</span>
                          <span className="text-xs font-bold text-gray-900">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block">ORDER PLACED</span>
                          <span className="text-xs font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block">TOTAL VALUE</span>
                          <span className="text-xs font-extrabold text-[#f97316]">₹{order.total}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block">STATUS</span>
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'
                          }`}>
                            {order.orderStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Courier Tracking Details */}
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-700">🚚 COURIER LINK: {order.trackingNumber || 'NA'}</p>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">{order.trackingStatus || 'Pending warehouse packaging.'}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-xs gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={item.productImage} alt="" className="w-10 h-12 object-cover rounded border border-gray-200 shrink-0" referrerPolicy="no-referrer" />
                              <div className="min-w-0">
                                <p className="font-bold text-gray-800 truncate capitalize">{item.productName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                              {order.orderStatus === 'delivered' && (
                                <>
                                  <button
                                    onClick={() => handleRequestReturn(order.id, item, 'return')}
                                    className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold hover:bg-red-100 cursor-pointer"
                                  >
                                    Return
                                  </button>
                                  <button
                                    onClick={() => handleRequestReturn(order.id, item, 'exchange')}
                                    className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-[9px] font-bold hover:bg-orange-100 cursor-pointer"
                                  >
                                    Exchange
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Addresses list */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-6 shadow-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#f97316]" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">SHIPPING ADDRESS BLUEPRINTS</h3>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-[10px] font-bold text-[#f97316] hover:underline uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={11} /> {showAddressForm ? 'Cancel Form' : 'Add New Address'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddressSubmit} className="p-4 bg-gray-50 border border-gray-250 rounded-xl space-y-3.5">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Type</label>
                      <select
                        value={newAddress.type}
                        onChange={(e: any) => setNewAddress({ ...newAddress, type: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      >
                        <option value="home">Home (Delivery all day)</option>
                        <option value="work">Work (Office hours delivery)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Street Address</label>
                      <input
                        type="text"
                        required
                        placeholder="House no., Apartment name, Area details"
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Landmark details (Optional)"
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Postal Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Active Phone Number</label>
                      <input
                        type="text"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
                  >
                    Save Address Blueprint
                  </button>
                </form>
              )}

              {/* Saved addresses lists */}
              <div className="space-y-4">
                {currentUser.addresses.length === 0 ? (
                  <p className="text-xs text-gray-500 font-medium">No address configurations loaded. Add one above.</p>
                ) : (
                  currentUser.addresses.map((a: Address) => (
                    <div key={a.id} className="flex justify-between items-start gap-4 p-4 border border-gray-200 rounded-xl">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-800 capitalize">{a.name}</span>
                          <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{a.type}</span>
                          {a.isDefault && <span className="text-[8px] bg-orange-50 text-[#f97316] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Default</span>}
                        </div>
                        <p className="text-gray-600 font-medium">{a.addressLine1}, {a.addressLine2 && `${a.addressLine2}, `}{a.city}, {a.state} - {a.postalCode}</p>
                        <p className="text-gray-500 font-semibold">Phone: {a.phone}</p>
                      </div>
                      <button
                        onClick={() => onRemoveAddress(a.id)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                        title="Remove Address"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Coupons rewards board */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Ticket size={18} className="text-[#f97316]" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">MY LOYALTY REWARDS & COUPONS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="border border-dashed border-gray-300 bg-orange-50/20 p-4 rounded-xl relative space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">PROMO CODE</span>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-sm font-black text-gray-900 uppercase font-mono tracking-widest">{c.code}</span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(c.code); alert(`Code "${c.code}" copied to clipboard!`); }}
                        className="text-[9px] text-[#f97316] font-bold uppercase tracking-wide cursor-pointer hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-[10.5px] text-gray-600 font-medium">{c.description}</p>
                    <p className="text-[8.5px] text-gray-400 font-bold uppercase">Min Purchase: ₹{c.minPurchase} • Expires: {new Date(c.expiresAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Concierge & Support Assistance */}
            <div className="bg-white border border-[#E8E5DD] p-6 rounded-xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#C9A227]" />
                  <h3 className="text-xs font-serif font-bold text-gray-900 uppercase tracking-wider">CONCIERGE & CLIENT SUPPORT</h3>
                </div>
                <span className="text-[9px] font-bold text-[#C9A227] bg-slate-900 px-2 py-0.5 uppercase tracking-widest">
                  Direct Assistance
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#F8F7F2] border border-[#E8E5DD] rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">SUPPORT PHONE</span>
                  <a href="tel:+919274821162" className="text-sm font-bold text-[#0B0B0B] hover:text-[#C9A227] font-mono block">
                    +91 9274821162
                  </a>
                  <p className="text-[10px] text-gray-500 font-medium">Available Mon-Sat for order & sizing help</p>
                </div>

                <div className="p-4 bg-[#F8F7F2] border border-[#E8E5DD] rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">CUSTOMER ENQUIRIES</span>
                  <a href="mailto:info@blackfawn.in" className="text-xs font-bold text-[#0B0B0B] hover:text-[#C9A227] font-mono block">
                    info@blackfawn.in
                  </a>
                  <p className="text-[10px] text-gray-500 font-medium">Guaranteed priority response within 24h</p>
                </div>

                <div className="p-4 bg-[#F8F7F2] border border-[#E8E5DD] rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">REGISTERED ATELIER</span>
                  <a
                    href="https://maps.google.com/?q=Office+No.+413,+4th+Floor,+Siddhivinayak+Arcus,+Bhayli+Road,+Bhayli,+Vadodara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#0B0B0B] hover:text-[#C9A227] block leading-tight"
                  >
                    Office No. 413, 4th Floor, Siddhivinayak Arcus, Bhayli Road, Bhayli, Vadodara.
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
