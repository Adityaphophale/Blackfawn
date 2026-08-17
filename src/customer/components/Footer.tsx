import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Sparkles, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { BusinessInfo, DEFAULT_BUSINESS_INFO } from '../../shared/businessConfig';

interface FooterProps {
  setTab: (tab: string) => void;
  setCategoryFilter: (cat: string) => void;
  businessInfo?: BusinessInfo;
}

export default function Footer({ setTab, setCategoryFilter, businessInfo }: FooterProps) {
  const info = businessInfo || DEFAULT_BUSINESS_INFO;

  const handleDeptClick = (cat: string) => {
    setCategoryFilter(cat);
    setTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="bf-footer" className="bg-[#0B0B0B] border-t border-[#1A1A1A] text-gray-400 font-sans pt-16 pb-12">
      {/* Trust Pillars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#1A1A1A] grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1A1A1A] text-[#C9A227] border border-[#2A2A2A]">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-widest">EXPRESS DELIVERY</h4>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Complimentary priority air shipping across India on orders over ₹999.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1A1A1A] text-[#C9A227] border border-[#2A2A2A]">
            <RotateCcw size={20} />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-widest">10-DAY CONCIERGE EXCHANGES</h4>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Seamless size replacements and reverse pickups scheduled within 24 hours.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1A1A1A] text-[#C9A227] border border-[#2A2A2A]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-widest">ENCRYPTED CHECKOUT</h4>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Bank-grade SSL encryption for UPI, Cards, NetBanking, and Cash on Delivery.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1A1A1A] text-[#C9A227] border border-[#2A2A2A]">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-widest">AUTHENTIC CRAFT CODES</h4>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Pre-shrunk organic cottons, high-density GSM, and structural serial validation.</p>
          </div>
        </div>
      </div>

      {/* Brand Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1: Brand Pitch */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="BLACKFAWN Logo" 
              className="h-10 w-10 object-contain rounded-full border border-[#C9A227] p-0.5" 
            />
            <h3 className="text-xl font-serif font-bold tracking-wider text-white uppercase">
              BLACK<span className="text-[#C9A227] italic font-normal">FAWN</span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            Curated in India. We construct slouchy heavyweight drops, drop-shoulder silhouettes, bespoke hampers, and luxury apparel for modern high-fashion aficionados.
          </p>
          <div className="pt-2">
            <span className="text-[9px] font-semibold text-[#C9A227] bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1 uppercase tracking-widest">
              Official Registered Business
            </span>
          </div>
        </div>

        {/* Col 2: Shop Sections */}
        <div className="space-y-4">
          <h4 className="text-xs font-serif font-bold text-white tracking-widest uppercase">COLLECTIONS</h4>
          <ul className="space-y-2.5 text-xs font-medium tracking-wide">
            <li><button onClick={() => handleDeptClick('')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">All Collections</button></li>
            <li><button onClick={() => handleDeptClick('Hampers & Gifting')} className="text-[#C9A227] font-semibold hover:underline transition-colors flex items-center gap-1 cursor-pointer">Hampers & Gifting</button></li>
            <li><button onClick={() => handleDeptClick('Printed T-Shirts')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Printed T-Shirts</button></li>
            <li><button onClick={() => handleDeptClick('Caps')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Caps</button></li>
            <li><button onClick={() => handleDeptClick('Socks')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Printed Socks</button></li>
            <li><button onClick={() => handleDeptClick('Hand Napkins')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Hand Napkins</button></li>
            <li><button onClick={() => handleDeptClick('Towels')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Printed Towels</button></li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div className="space-y-4">
          <h4 className="text-xs font-serif font-bold text-white tracking-widest uppercase">CONCIERGE</h4>
          <ul className="space-y-2.5 text-xs font-medium tracking-wide">
            <li><button onClick={() => setTab('profile')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Order Tracking</button></li>
            <li><button onClick={() => setTab('profile')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Exchanges & Care</button></li>
            <li><button onClick={() => setTab('shop')} className="text-gray-400 hover:text-[#C9A227] transition-colors cursor-pointer">Size & Fitting Guide</button></li>
          </ul>
        </div>

        {/* Col 4: Official Contact / Visit Us Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-serif font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
            CONTACT / VISIT US
          </h4>

          <div className="space-y-3 text-[11px] text-gray-300">
            {/* Clickable Address opening Google Maps */}
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-[#C9A227] shrink-0 mt-0.5" />
              <a
                href={info.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C9A227] transition-colors block font-normal leading-relaxed group"
              >
                <span className="block font-semibold text-white">Office No. 413, 4th Floor,</span>
                <span className="block">Siddhivinayak Arcus,</span>
                <span className="block">Bhayli Road,</span>
                <span className="block">Bhayli, Vadodara.</span>
                <span className="text-[9.5px] text-[#C9A227] font-semibold tracking-wider flex items-center gap-1 mt-1 group-hover:underline uppercase">
                  Open Google Maps <ExternalLink size={9} />
                </span>
              </a>
            </div>

            {/* Clickable Email */}
            <div className="flex items-center gap-2.5 pt-1 border-t border-[#1A1A1A]">
              <Mail size={14} className="text-[#C9A227] shrink-0" />
              <a
                href={`mailto:${info.email}`}
                className="hover:text-[#C9A227] transition-colors font-medium text-gray-300 hover:underline"
              >
                {info.email}
              </a>
            </div>

            {/* Clickable Phone for mobile */}
            <div className="flex items-center gap-2.5 pt-1 border-t border-[#1A1A1A]">
              <Phone size={14} className="text-[#C9A227] shrink-0" />
              <a
                href={`tel:${info.phone.replace(/\s+/g, '')}`}
                className="hover:text-[#C9A227] transition-colors font-semibold text-white hover:underline font-mono"
              >
                {info.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1A1A1A] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-widest uppercase">
        <p className="text-gray-500 text-center sm:text-left">
          © {currentYear} BLACKFAWN HIGH FASHION ATELIER. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6 text-gray-400">
          <span className="hover:text-[#C9A227] cursor-pointer">Terms & Conditions</span>
          <span className="hover:text-[#C9A227] cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
