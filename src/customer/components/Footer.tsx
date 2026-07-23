import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Sparkles, Mail, Phone, MapPin } from 'lucide-react';

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
    <footer id="bf-footer" className="bg-[#131921] border-t border-slate-800 text-gray-400 font-sans pt-16 pb-8">
      {/* Trust Pillars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-850 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-800 text-[#f97316] rounded-md">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">EXPRESS SHIPPING</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Free express shipping within India for orders above ₹999. Sent via Premium Air Couriers.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-800 text-[#f97316] rounded-md">
            <RotateCcw size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">10-DAY RETURNS</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Hassle-free size exchanges and reverse-pickups scheduled within 24 hours of submission.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-800 text-[#f97316] rounded-md">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% SECURE PAYMENTS</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">UPI (Google Pay, PhonePe), Credit/Debit Cards, and Net Banking backed by 256-bit SSL encryption.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-800 text-[#f97316] rounded-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">AUTHENTIC CRAFT CODES</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Every garment carries a structural serial code verifying high-density GSM, pre-shrunk cotton, and custom wash.</p>
          </div>
        </div>
      </div>

      {/* Brand Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1: Brand Pitch */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-black tracking-wider text-white uppercase">BLACK<span className="text-[#f97316]">FAWN</span></h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            Designed in India. We construct slouchy heavyweight drops, drop-shoulder silhouettes, and tactical technical garments. Engineered for modern metropolitan survival.
          </p>
          <div className="flex gap-2.5 pt-2">
            <span className="text-[9px] font-bold text-white bg-slate-800 border border-slate-700 px-2.5 py-1 uppercase rounded-md">
              GST Registered
            </span>
            <span className="text-[9px] font-bold text-white bg-slate-800 border border-slate-700 px-2.5 py-1 uppercase rounded-md">
              Made In India
            </span>
          </div>
        </div>

        {/* Col 2: Shop Sections */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white tracking-wider uppercase">COLLECTIONS</h4>
          <ul className="space-y-2.5 text-[11px] font-medium tracking-wide">
            <li><button onClick={() => handleDeptClick('')} className="text-gray-400 hover:text-white transition-colors">Shop All Drops</button></li>
            <li><button onClick={() => handleDeptClick('Printed T-Shirts')} className="text-gray-400 hover:text-white transition-colors">Printed T-Shirts</button></li>
            <li><button onClick={() => handleDeptClick('Caps')} className="text-gray-400 hover:text-white transition-colors">Caps</button></li>
            <li><button onClick={() => handleDeptClick('Socks')} className="text-gray-400 hover:text-white transition-colors">Printed Socks</button></li>
            <li><button onClick={() => handleDeptClick('Hand Napkins')} className="text-gray-400 hover:text-white transition-colors">Hand Napkins</button></li>
            <li><button onClick={() => handleDeptClick('Towels')} className="text-gray-400 hover:text-white transition-colors">Printed Towels</button></li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white tracking-wider uppercase">HELP CENTER</h4>
          <ul className="space-y-2.5 text-[11px] font-medium tracking-wide">
            <li><button onClick={() => setTab('profile')} className="text-gray-400 hover:text-white transition-colors">Order Tracker</button></li>
            <li><button onClick={() => setTab('profile')} className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</button></li>
            <li><button onClick={() => setTab('shop')} className="text-gray-400 hover:text-white transition-colors">Size Guide Specs</button></li>
          </ul>
        </div>

        {/* Col 4: Corporate Contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white tracking-wider uppercase">HEADQUARTERS</h4>
          <ul className="space-y-3 text-[10px] text-gray-400 uppercase tracking-wide">
            <li className="flex items-center gap-2">
              <MapPin size={12} className="text-white shrink-0" />
              <span>Flat 402, Building A, Senapati Bapat Road, Pune, MH, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={12} className="text-white shrink-0" />
              <span>support@blackfawn.in</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={12} className="text-white shrink-0" />
              <span>+91 98765 43210</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-wider uppercase">
        <p className="text-gray-500 text-center sm:text-left">
          © {currentYear} BLACKFAWN APPARELS INC. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6 text-gray-400">
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
