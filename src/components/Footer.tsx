import React from 'react';
import { ShieldCheck, Truck, RotateCcw, AlertCircle, Sparkles, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  setTab: (tab: string) => void;
  setCategoryFilter: (cat: string) => void;
}

export default function Footer({ setTab, setCategoryFilter }: FooterProps) {
  const handleDeptClick = (cat: string) => {
    setCategoryFilter(cat);
    setTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="bf-footer" className="bg-[#f9f9f9] border-t border-black/10 text-neutral-600 font-sans pt-16 pb-8">
      {/* Trust Pillars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-black/10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-100 border border-black/10 rounded-md text-black">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-black uppercase tracking-widest">EXPRESS SHIPPING</h4>
            <p className="text-[10px] text-neutral-500 uppercase mt-1 leading-relaxed">Free express shipping within India for orders above ₹999. Sent via Premium Air Couriers.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-100 border border-black/10 rounded-md text-black">
            <RotateCcw size={20} />
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-black uppercase tracking-widest">7-DAY RETURNS & EXCHANGES</h4>
            <p className="text-[10px] text-neutral-500 uppercase mt-1 leading-relaxed">Hassle-free size exchanges and reverse-pickups scheduled within 24 hours of submission.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-100 border border-black/10 rounded-md text-black">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-black uppercase tracking-widest">100% SECURE PAYMENTS</h4>
            <p className="text-[10px] text-neutral-500 uppercase mt-1 leading-relaxed">UPI (Google Pay, PhonePe), Credit/Debit Cards, and Net Banking backed by 256-bit SSL encryption.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-100 border border-black/10 rounded-md text-black">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-black uppercase tracking-widest">AUTHENTIC CRAFT CODES</h4>
            <p className="text-[10px] text-neutral-500 uppercase mt-1 leading-relaxed">Every garment carries a structural serial code verifying high-density GSM, pre-shrunk cotton, and custom wash.</p>
          </div>
        </div>
      </div>

      {/* Brand Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1: Brand Pitch */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-display font-black tracking-[0.3em] text-black uppercase">BLACKFAWN</h3>
          <p className="text-xs text-neutral-500 leading-relaxed uppercase tracking-wider max-w-sm font-serif">
            Designed in India. We construct slouchy heavyweight drops, drop-shoulder silhouettes, and tactical technical garments. Engineered for modern metropolitan survival.
          </p>
          <div className="flex gap-2.5 pt-2">
            <span className="text-[9px] font-mono text-black bg-neutral-100 border border-black/15 px-2.5 py-1 uppercase rounded-md">
              GST Registered
            </span>
            <span className="text-[9px] font-mono text-black bg-neutral-100 border border-black/15 px-2.5 py-1 uppercase rounded-md">
              Made In India
            </span>
          </div>
        </div>

        {/* Col 2: Shop Sections */}
        <div className="space-y-4">
          <h4 className="text-xs font-display font-bold text-black tracking-widest uppercase">COLLECTIONS</h4>
          <ul className="space-y-2.5 text-[11px] font-mono uppercase tracking-wider">
            <li><button onClick={() => handleDeptClick('')} className="text-neutral-500 hover:text-black transition-colors">Shop All Drops</button></li>
            <li><button onClick={() => handleDeptClick('Oversized')} className="text-neutral-500 hover:text-black transition-colors">Oversized Tees</button></li>
            <li><button onClick={() => handleDeptClick('Hoodies')} className="text-neutral-500 hover:text-black transition-colors">Heavy Hoodies</button></li>
            <li><button onClick={() => handleDeptClick('Cargo Pants')} className="text-neutral-500 hover:text-black transition-colors">Tactical Cargos</button></li>
            <li><button onClick={() => handleDeptClick('Sneakers')} className="text-neutral-500 hover:text-black transition-colors">Metropolis Shoes</button></li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div className="space-y-4">
          <h4 className="text-xs font-display font-bold text-black tracking-widest uppercase">HELP CENTER</h4>
          <ul className="space-y-2.5 text-[11px] font-mono uppercase tracking-wider">
            <li><button onClick={() => setTab('profile')} className="text-neutral-500 hover:text-black transition-colors">Order Tracker</button></li>
            <li><button onClick={() => setTab('profile')} className="text-neutral-500 hover:text-black transition-colors">Returns & Exchanges</button></li>
            <li><button onClick={() => setTab('profile')} className="text-neutral-500 hover:text-black transition-colors">My Loyalty Rewards</button></li>
            <li><button onClick={() => setTab('shop')} className="text-neutral-500 hover:text-black transition-colors">Size Guide Specs</button></li>
            <li><button onClick={() => setTab('home')} className="text-neutral-500 hover:text-black transition-colors">Corporate GST Details</button></li>
          </ul>
        </div>

        {/* Col 4: Corporate Contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-display font-bold text-black tracking-widest uppercase">METROPOLIS HEADQUARTERS</h4>
          <ul className="space-y-3 text-[10px] uppercase tracking-wider text-neutral-500">
            <li className="flex items-center gap-2">
              <MapPin size={12} className="text-black shrink-0" />
              <span>Flat 402, Building A, Senapati Bapat Road, Pune, MH, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={12} className="text-black shrink-0" />
              <span>support@blackfawn.in</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={12} className="text-black shrink-0" />
              <span>+91 98765 43210</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest">
        <p className="text-neutral-500 text-center sm:text-left">
          © {currentYear} BLACKFAWN APPARELS INC. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6 text-neutral-400">
          <span className="hover:text-black cursor-pointer">Terms of Service</span>
          <span className="hover:text-black cursor-pointer">Privacy Policy</span>
          <span className="hover:text-black cursor-pointer">CIN-U19283MH2026PTC19283</span>
        </div>
      </div>
    </footer>
  );
}
