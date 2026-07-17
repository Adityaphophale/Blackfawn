import React, { useState, useEffect } from 'react';
import { User, LogIn, Lock, Mail, ClipboardList, MapPin, Ticket, ShieldCheck, Check, Plus, Trash2, Truck, Sparkles, Copy, ChevronRight, LogOut, CheckCircle2 } from 'lucide-react';
import { Address, Order, Coupon } from '../types';

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
        setAuthSuccess('ACCOUNT GENERATED SUCCESSFULLY! METROPOLIS ENTRANCE SECURED.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.error || 'Registration failed');
      }
    } else {
      const result = await onLogin(email, password);
      if (result.success) {
        setAuthSuccess('AUTHENTICATION SECURED. WELCOME BACK.');
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
      alert("Destination address saved successfully inside your BLACKFAWN profile.");
    } catch (err) {
      console.error(err);
    }
  };

  const renderProgressTracker = (status: string) => {
    const steps = ['placed', 'assembling', 'dispatched', 'delivered'];
    const currentIdx = steps.indexOf(status);

    return (
      <div className="pt-4 space-y-2.5">
        <div className="flex justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
          <span className={currentIdx >= 0 ? 'text-[#0B0B0B] font-bold' : ''}>PLACED</span>
          <span className={currentIdx >= 1 ? 'text-[#0B0B0B] font-bold' : ''}>ASSEMBLING</span>
          <span className={currentIdx >= 2 ? 'text-[#0B0B0B] font-bold' : ''}>DISPATCHED</span>
          <span className={currentIdx >= 3 ? 'text-[#C9A227] font-bold' : ''}>DELIVERED</span>
        </div>
        <div className="h-1 bg-neutral-200 rounded-none flex overflow-hidden">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-full border-r border-[#F8F8F6] last:border-r-0 transition-colors duration-500 ${
                currentIdx >= idx ? 'bg-[#0B0B0B]' : 'bg-neutral-200'
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div id="auth-panel" className="max-w-md mx-auto px-4 py-24 pt-[160px] font-sans bg-[#F8F8F6]">
        <div className="bg-white border border-[#0B0B0B]/10 p-8 rounded-none space-y-6 shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 text-[10rem] font-display font-black text-black/[0.01] select-none pointer-events-none uppercase">
            PASS
          </div>
          <div className="text-center space-y-2 relative z-10">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-400 uppercase">ACCESS SYSTEM</span>
            <h1 className="text-2xl font-display font-black tracking-widest text-[#0B0B0B] uppercase">
              {isRegisterMode ? 'JOIN THE BLACKFAWN CO' : 'METROPOLIS GATEWAY'}
            </h1>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider leading-relaxed">
              {isRegisterMode ? 'Register an account for early drop alerts' : 'Login to track orders and save profiles'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-widest relative z-10">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono uppercase tracking-widest relative z-10">
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
            {isRegisterMode && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">Receiver Name</label>
                <input
                  type="text"
                  required
                  placeholder="VIKRAM SEN"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] px-4 py-2.5 text-xs font-mono focus:border-[#C9A227] outline-none uppercase tracking-wider rounded-none"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">Email Address</label>
              <input
                type="email"
                required
                placeholder="VIKRAM@BLACKFAWN.IN"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] px-4 py-2.5 text-xs font-mono focus:border-[#C9A227] outline-none tracking-wider rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">Security Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] px-4 py-2.5 text-xs font-mono focus:border-[#C9A227] outline-none tracking-wider rounded-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B0B0B] text-[#F8F8F6] text-xs font-display font-black tracking-[0.25em] uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-all cursor-pointer rounded-none font-bold"
            >
              {isRegisterMode ? 'REGISTER ACCOUNT' : 'SECURE SIGN IN'}
            </button>
          </form>

          <div className="text-center pt-2 relative z-10">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-[10px] font-mono text-neutral-500 hover:text-black uppercase tracking-widest underline cursor-pointer"
            >
              {isRegisterMode ? 'Already registered? Gateway Login' : 'First session? Create Metropolis Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[140px] min-h-screen space-y-12 bg-[#F8F8F6] text-[#0B0B0B]">
      
      {/* 1. Header Profile Banner */}
      <div className="bg-white border border-[#0B0B0B]/10 p-6 rounded-none flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0B0B0B] text-[#F8F8F6] rounded-none flex items-center justify-center font-bold">
            <User size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-widest text-[#0B0B0B] uppercase">{currentUser.name}</h1>
              <span className="text-[8px] font-mono bg-amber-50 text-[#C9A227] border border-[#C9A227]/20 px-2 py-0.5 rounded-none font-bold">VIP MEMBER</span>
            </div>
            <p className="text-xs font-mono text-neutral-500 mt-0.5">{currentUser.email} • BLACKFAWN METROPOLIS NETWORK</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-5 py-2.5 bg-[#F8F8F6] border border-[#0B0B0B]/15 text-[#0B0B0B] text-[10px] font-mono tracking-widest uppercase hover:bg-[#0B0B0B] hover:text-[#F8F8F6] transition-colors cursor-pointer rounded-none flex items-center gap-1.5"
        >
          <LogOut size={12} /> Logout Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Left Column: Destinations & Coupons */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-[#0B0B0B]/10 p-5 rounded-none space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-[#0B0B0B]/10 pb-2.5">
              <h3 className="text-xs font-display font-bold tracking-widest text-[#0B0B0B] uppercase flex items-center gap-1.5">
                <MapPin size={14} className="text-neutral-400" /> SHIPPING DESTINATIONS
              </h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-[9px] font-mono text-neutral-400 hover:text-black flex items-center gap-1 cursor-pointer uppercase tracking-wider font-bold"
              >
                <Plus size={10} /> ADD NEW
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddressSubmit} className="space-y-3.5 p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none animate-fade-in">
                <input
                  type="text"
                  required
                  placeholder="Receiver Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3 py-2 text-xs font-mono focus:border-[#C9A227] outline-none w-full uppercase rounded-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Street Line 1"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  className="bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3 py-2 text-xs font-mono focus:border-[#C9A227] outline-none w-full uppercase rounded-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3 py-2 text-xs font-mono focus:border-[#C9A227] outline-none w-full uppercase rounded-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value.replace(/\D/g, '') })}
                    className="bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3 py-2 text-xs font-mono focus:border-[#C9A227] outline-none w-full uppercase rounded-none"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3 py-2 text-xs font-mono focus:border-[#C9A227] outline-none w-full uppercase rounded-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3 py-2 text-xs font-mono focus:border-[#C9A227] outline-none w-full uppercase rounded-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#0B0B0B] text-[#F8F8F6] text-[10px] font-display font-black tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors cursor-pointer rounded-none font-bold"
                >
                  SAVE DESTINATION
                </button>
              </form>
            )}

            <div className="space-y-3.5">
              {(!currentUser.addresses || currentUser.addresses.length === 0) ? (
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">No saved destinations registered.</p>
              ) : (
                currentUser.addresses.map((addr: Address) => (
                  <div key={addr.id} className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none space-y-1.5 font-mono text-xs text-neutral-500 relative">
                    <p className="text-[#0B0B0B] font-bold uppercase tracking-wide">{addr.name} ({addr.type})</p>
                    <p className="uppercase">{addr.addressLine1}, {addr.city}</p>
                    <p className="uppercase">{addr.state} - {addr.postalCode}</p>
                    <p>Phone: {addr.phone}</p>
                    
                    <button
                      onClick={() => onRemoveAddress(addr.id)}
                      className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-red-700 p-1 rounded-none cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVE PROMO CODES PANEL */}
          <div className="bg-white border border-[#0B0B0B]/10 p-5 rounded-none space-y-4 shadow-xs">
            <h3 className="text-xs font-display font-bold tracking-widest text-[#0B0B0B] uppercase flex items-center gap-1.5">
              <Ticket size={14} className="text-neutral-400" /> UNLOCKED SHADOW CODES
            </h3>
            
            <div className="space-y-3.5">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="p-3.5 bg-[#F8F8F6] border border-[#C9A227]/25 rounded-none flex justify-between items-center">
                  <div className="font-mono space-y-1.5 uppercase tracking-wider text-neutral-600">
                    <span className="text-[9px] bg-[#C9A227] text-[#0B0B0B] font-black px-2 py-0.5 rounded-none font-display font-bold">
                      {coupon.code}
                    </span>
                    <p className="text-xs text-[#0B0B0B] font-bold mt-2">{coupon.description}</p>
                    <p className="text-[9px] text-neutral-400">MIN SHOPPING BAG: ₹{coupon.minPurchase}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      alert(`Promo Code "${coupon.code}" copied! Input it inside your shopping bag.`);
                    }}
                    className="text-[9px] font-mono text-[#C9A227] hover:text-[#0B0B0B] uppercase underline cursor-pointer shrink-0 font-bold"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Right Columns: Orders Tracking List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#0B0B0B]/10 p-5 rounded-none space-y-6 shadow-xs">
            <h3 className="text-xs font-display font-bold tracking-widest text-[#0B0B0B] uppercase flex items-center gap-1.5 border-b border-[#0B0B0B]/10 pb-2.5">
              <ClipboardList size={14} className="text-neutral-400" /> ACTIVE RELEASES LOG ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">YOU HAVE NOT SECURED ANY APPAREL DROPS YET</p>
                <button
                  onClick={() => { setTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-2.5 bg-[#0B0B0B] text-[#F8F8F6] text-xs font-display font-black tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors rounded-none font-bold"
                >
                  SECURE YOUR FIRST RELEASE
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="p-4.5 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none space-y-4">
                    {/* Order header information */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#0B0B0B]/5 pb-3">
                      <div>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Order Drop ID: {order.id}</span>
                        <p className="text-xs text-[#0B0B0B] font-bold font-mono mt-0.5">LAUNCHED ON: {order.date}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Total amount:</span>
                        <p className="text-sm font-display font-black text-[#0B0B0B]">₹{order.total}</p>
                      </div>
                    </div>

                    {/* Order items line */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 text-xs font-mono uppercase text-neutral-500">
                          <img src={item.productImage} alt="" className="w-10 aspect-[3/4] object-cover rounded-none border border-[#0B0B0B]/10 shrink-0" referrerPolicy="no-referrer" />
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-[#0B0B0B] font-bold line-clamp-1">{item.productName}</h4>
                            <p className="text-neutral-400 text-[9px]">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                          </div>
                          <span className="text-[#0B0B0B] font-bold shrink-0">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live delivery tracking assembly progress */}
                    <div className="border-t border-[#0B0B0B]/5 pt-3">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase mb-2">
                        <Truck size={12} className="text-[#C9A227] animate-pulse" /> PRIORITY SHIPMENT TRACKING: <span className="text-[#0B0B0B] font-black">{order.orderStatus}</span>
                      </div>
                      {renderProgressTracker(order.orderStatus)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
