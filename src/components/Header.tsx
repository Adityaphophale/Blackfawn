import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Shield, Menu, X, ArrowRight, MessageSquareCode, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem } from '../types';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  setCategoryFilter: (cat: string) => void;
  setSelectedProductId: (id: string | null) => void;
  cart: CartItem[];
  wishlist: Product[];
  currentUser: any;
  setSearchQuery: (query: string) => void;
  toggleCart: () => void;
  toggleAIAssistant: () => void;
  products: Product[];
}

export default function Header({
  currentTab,
  setTab,
  setCategoryFilter,
  setSelectedProductId,
  cart,
  wishlist,
  currentUser,
  setSearchQuery,
  toggleCart,
  toggleAIAssistant,
  products,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  
  // Sticky scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Announcement index carousel
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const announcements = [
    "ACT II: SHADOWS OF INDUS • PREMIUM STREETWEAR CAPSULE DROP OUT NOW",
    "FREE EXPRESS AIR SHIPPING IN INDIA ON ALL BAGS ABOVE ₹999",
    "SUPPORTING CASH ON DELIVERY (COD) NATIONWIDE • NO HIDDEN FEES"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (cat: string) => {
    setCategoryFilter(cat);
    setTab('shop');
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setTab('shop');
    setSearchOpen(false);
    setActiveMegaMenu(null);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setSearchOpen(false);
    setActiveMegaMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = [
    { 
      label: 'Shop All', 
      hasMega: true,
      action: () => { setCategoryFilter(''); setTab('shop'); setActiveMegaMenu(null); setSearchOpen(false); } 
    },
    { 
      label: 'Oversized', 
      hasMega: true,
      action: () => handleCategoryClick('Oversized') 
    },
    { 
      label: 'T-Shirts', 
      hasMega: false,
      action: () => handleCategoryClick('T-Shirts') 
    },
    { 
      label: 'Hoodies', 
      hasMega: false,
      action: () => handleCategoryClick('Hoodies') 
    },
    { 
      label: 'Cargos', 
      hasMega: false,
      action: () => handleCategoryClick('Cargo Pants') 
    },
  ];

  // Filters search suggestions dynamically
  const liveSuggestions = localSearch.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(localSearch.toLowerCase()) || p.category.toLowerCase().includes(localSearch.toLowerCase()))
        .slice(0, 5)
    : [];

  return (
    <header 
      id="bf-header" 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#F8F8F6]/95 backdrop-blur-md shadow-xs border-b border-[#0B0B0B]/5' 
          : 'bg-[#F8F8F6] border-b border-[#0B0B0B]/10'
      } text-[#0B0B0B]`}
    >
      {/* Announcement Bar Carousel */}
      <div 
        id="announcement-bar" 
        className="w-full bg-[#0B0B0B] py-2 px-4 text-center text-[9px] font-mono tracking-[0.25em] text-[#F8F8F6] uppercase flex items-center justify-center gap-2 overflow-hidden h-9 border-b border-[#0B0B0B]/10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={announcementIndex}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <span>{announcements[announcementIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-18'}`}>
          
          {/* Mobile Toggle */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#0B0B0B] hover:text-[#C9A227] p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Luxury Logo */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
            <button
              id="brand-logo"
              onClick={() => { setTab('home'); setSelectedProductId(null); setActiveMegaMenu(null); setSearchOpen(false); }}
              className="text-xl sm:text-2xl font-display font-black tracking-[0.35em] text-[#0B0B0B] uppercase select-none cursor-pointer hover:text-[#C9A227] transition-all"
            >
              BLACKFAWN
            </button>
          </div>

          {/* Premium Desktop Mega-Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <div 
                key={index} 
                className="relative"
                onMouseEnter={() => item.hasMega ? setActiveMegaMenu(item.label) : setActiveMegaMenu(null)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={item.action}
                  className={`group flex items-center gap-1 text-[11px] font-display font-bold tracking-[0.2em] uppercase py-5 transition-all cursor-pointer ${
                    currentTab === 'shop' && index < 2 ? 'text-[#C9A227]' : 'text-neutral-500 hover:text-[#0B0B0B]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasMega && (
                    <ChevronDown size={10} className="text-neutral-400 group-hover:text-[#C9A227] transition-transform group-hover:rotate-180" />
                  )}
                </button>
              </div>
            ))}
            <button
              onClick={() => { setTab('home'); setTimeout(() => { document.getElementById('reviews-instagram-feed')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
              className="text-[11px] font-display font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-[#0B0B0B] transition-all cursor-pointer"
            >
              METROPOLIS LABS
            </button>
          </nav>

          {/* Controls Bar */}
          <div className="flex items-center space-x-1 sm:space-x-2">

            {/* Search Toggle */}
            <button
              id="header-search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${searchOpen ? 'bg-[#0B0B0B] text-[#F8F8F6]' : 'text-neutral-500 hover:text-[#0B0B0B] hover:bg-neutral-100'}`}
              title="Search Apparel"
            >
              <Search size={16} />
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => { setTab('shop'); setSearchQuery(''); setCategoryFilter(''); }}
              className="p-2 text-neutral-500 hover:text-[#0B0B0B] hover:bg-neutral-100 rounded-full transition-colors relative cursor-pointer"
              title="My Wishlist"
            >
              <Heart size={16} className={wishlist.length > 0 ? 'fill-[#0B0B0B] text-[#0B0B0B]' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-[#C9A227] rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Shopping bag */}
            <button
              id="header-cart-btn"
              onClick={toggleCart}
              className="p-2 text-neutral-500 hover:text-[#0B0B0B] hover:bg-neutral-100 rounded-full transition-colors relative cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C9A227] text-[#0B0B0B] text-[8px] font-mono font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Dashboard */}
            <button
              id="header-account-btn"
              onClick={() => setTab('profile')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                currentTab === 'profile' ? 'bg-[#0B0B0B] text-[#F8F8F6]' : 'text-neutral-500 hover:text-[#0B0B0B] hover:bg-neutral-100'
              }`}
              title="User Dashboard"
            >
              <UserIcon size={16} />
            </button>

            {/* Admin Badge */}
            {currentUser?.role === 'admin' && (
              <button
                id="header-admin-btn"
                onClick={() => setTab('admin')}
                className={`p-2 rounded-full transition-colors cursor-pointer text-[#0B0B0B] hover:bg-neutral-100 ${
                  currentTab === 'admin' ? 'bg-[#0B0B0B]' : ''
                }`}
                title="Admin Control Panel"
              >
                <Shield size={16} className={currentTab === 'admin' ? 'text-[#F8F8F6]' : 'text-[#C9A227]'} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Premium Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
            className="absolute left-0 right-0 w-full bg-[#F8F8F6] border-b border-[#0B0B0B]/10 shadow-lg z-40 hidden md:block text-[#0B0B0B]"
          >
            <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-4 gap-10">
              {/* Col 1: Categories */}
              <div className="space-y-4">
                <p className="text-[9px] font-mono tracking-widest text-[#C9A227] uppercase border-b border-[#0B0B0B]/5 pb-2">METROPOLIS CUTS</p>
                <div className="flex flex-col space-y-2.5">
                  <button onClick={() => handleCategoryClick('')} className="text-[11px] text-left font-display tracking-widest uppercase text-neutral-600 hover:text-[#0B0B0B] transition-colors">Shop All Garments</button>
                  <button onClick={() => handleCategoryClick('Oversized')} className="text-[11px] text-left font-display tracking-widest uppercase text-neutral-600 hover:text-[#0B0B0B] transition-colors">Oversized Silhouettes</button>
                  <button onClick={() => handleCategoryClick('T-Shirts')} className="text-[11px] text-left font-display tracking-widest uppercase text-neutral-600 hover:text-[#0B0B0B] transition-colors">Premium Heavy Tees</button>
                  <button onClick={() => handleCategoryClick('Hoodies')} className="text-[11px] text-left font-display tracking-widest uppercase text-neutral-600 hover:text-[#0B0B0B] transition-colors">Heavy Fleece Hoodies</button>
                  <button onClick={() => handleCategoryClick('Cargo Pants')} className="text-[11px] text-left font-display tracking-widest uppercase text-neutral-600 hover:text-[#0B0B0B] transition-colors">Ripstop Utility Cargos</button>
                  <button onClick={() => handleCategoryClick('Sneakers')} className="text-[11px] text-left font-display tracking-widest uppercase text-neutral-600 hover:text-[#0B0B0B] transition-colors">Stealth Sneakers</button>
                  <button onClick={() => handleCategoryClick('Accessories')} className="text-[11px] text-left font-display tracking-widest uppercase text-neutral-600 hover:text-[#0B0B0B] transition-colors">Accessories & Beanies</button>
                </div>
              </div>

              {/* Col 2: Fabric Specs */}
              <div className="space-y-4">
                <p className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase border-b border-[#0B0B0B]/5 pb-2">FABRIC GEOMETRY</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[9px] font-mono text-[#0B0B0B] tracking-widest uppercase font-bold">240 GSM SINGLE JERSEY</h4>
                    <p className="text-[9px] text-neutral-500 uppercase mt-0.5 leading-relaxed">Compact premium knit structure with high shape-retention collar lines.</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-mono text-[#0B0B0B] tracking-widest uppercase font-bold">400 GSM BRUSHED FRENCH TERRY</h4>
                    <p className="text-[9px] text-neutral-500 uppercase mt-0.5 leading-relaxed">Dense, high-weight protective armor with premium garment enzyme washes.</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-mono text-[#0B0B0B] tracking-widest uppercase font-bold">WATER-RESISTANT RIPSTOP</h4>
                    <p className="text-[9px] text-neutral-500 uppercase mt-0.5 leading-relaxed">Durable cotton elastane weave with tactical modular adjustments.</p>
                  </div>
                </div>
              </div>

              {/* Col 3: Visual Feature 1 */}
              <div className="relative group overflow-hidden border border-[#0B0B0B]/5 h-[160px]">
                <div className="absolute inset-0 bg-[#0B0B0B]/15 group-hover:bg-[#0B0B0B]/5 transition-colors z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400" 
                  alt="Drop Lookbook" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="text-[7px] font-mono text-[#0B0B0B] tracking-widest uppercase bg-[#F8F8F6] px-1.5 py-0.5">ACT II</span>
                  <h4 className="text-xs font-display font-black text-white uppercase tracking-widest mt-1">SHADOWS OF INDUS</h4>
                  <button onClick={() => handleCategoryClick('Oversized')} className="text-[8px] font-mono uppercase text-white hover:underline flex items-center gap-1 mt-1 font-bold">EXPLORE <ArrowRight size={8} /></button>
                </div>
              </div>

              {/* Col 4: Visual Feature 2 */}
              <div className="relative group overflow-hidden border border-[#0B0B0B]/5 h-[160px]">
                <div className="absolute inset-0 bg-[#0B0B0B]/15 group-hover:bg-[#0B0B0B]/5 transition-colors z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" 
                  alt="Acid Wash" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="text-[7px] font-mono text-[#0B0B0B] tracking-widest uppercase bg-[#F8F8F6] px-1.5 py-0.5">GARMENT DYED</span>
                  <h4 className="text-xs font-display font-black text-white uppercase tracking-widest mt-1">ENZYME WASH</h4>
                  <button onClick={() => handleCategoryClick('Hoodies')} className="text-[8px] font-mono uppercase text-white hover:underline flex items-center gap-1 mt-1 font-bold">SECURE <ArrowRight size={8} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Search & Suggestions Drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 right-0 w-full bg-[#F8F8F6] border-b border-[#0B0B0B]/10 overflow-hidden shadow-lg z-40 text-[#0B0B0B]"
          >
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 border-b border-[#0B0B0B]/10 pb-2">
                <Search className="text-neutral-400 shrink-0" size={18} />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="SEARCH METROPOLIS COLLECTIONS..."
                  className="w-full bg-transparent text-[#0B0B0B] placeholder-neutral-400 border-none outline-none text-xs font-mono uppercase tracking-[0.2em] py-1"
                  autoFocus
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => setLocalSearch('')}
                    className="text-neutral-400 hover:text-black text-[9px] uppercase font-mono tracking-wider shrink-0"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B0B0B] text-[#F8F8F6] text-[9px] font-display font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all rounded-xs flex items-center gap-1"
                >
                  SEARCH <ArrowRight size={10} />
                </button>
              </form>

              {/* Autocomplete / Live Search Suggestions */}
              {liveSuggestions.length > 0 && (
                <div className="py-2 space-y-2">
                  <p className="text-[8px] font-mono tracking-widest text-neutral-400 uppercase">SUGGESTED MATCHES</p>
                  <div className="divide-y divide-[#0B0B0B]/5 border-t border-b border-[#0B0B0B]/5">
                    {liveSuggestions.map((prod) => (
                      <div 
                        key={prod.id} 
                        onClick={() => handleProductClick(prod.id)}
                        className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-neutral-50 px-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={prod.images[0]} 
                            alt={prod.name} 
                            className="w-8 h-10 object-cover object-top border border-black/5" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-[10px] font-display tracking-widest text-[#0B0B0B] uppercase font-bold line-clamp-1">{prod.name}</p>
                            <p className="text-[8px] font-mono text-neutral-500 uppercase">{prod.category} • {prod.fit}</p>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-[#0B0B0B] font-bold">
                          ₹{prod.discountPrice || prod.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="md:hidden fixed inset-0 top-[120px] z-40 bg-[#F8F8F6] flex flex-col justify-between py-6 px-6 overflow-y-auto border-t border-[#0B0B0B]/5 text-[#0B0B0B]"
          >
            <div className="flex flex-col space-y-5">
              <p className="text-[9px] font-mono tracking-widest text-[#C9A227] uppercase border-b border-black/5 pb-2">METROPOLIS CUTS</p>
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="text-sm font-display text-left font-bold tracking-[0.2em] text-[#0B0B0B] uppercase hover:text-neutral-600 flex justify-between items-center py-1 border-b border-black/5"
                >
                  <span>{item.label}</span>
                  <ArrowRight size={12} className="text-neutral-400" />
                </button>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); setCategoryFilter('Sneakers'); setTab('shop'); }}
                className="text-sm font-display text-left font-bold tracking-[0.2em] text-[#0B0B0B] uppercase flex justify-between items-center py-1 border-b border-black/5"
              >
                <span>Sneakers</span>
                <ArrowRight size={12} className="text-neutral-400" />
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setCategoryFilter('Accessories'); setTab('shop'); }}
                className="text-sm font-display text-left font-bold tracking-[0.2em] text-[#0B0B0B] uppercase flex justify-between items-center py-1 border-b border-black/5"
              >
                <span>Accessories</span>
                <ArrowRight size={12} className="text-neutral-400" />
              </button>
            </div>

            <div className="flex flex-col space-y-3.5 border-t border-black/5 pt-6">
              <button
                onClick={() => { setTab('profile'); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-[#0B0B0B] text-[#F8F8F6] text-[9px] font-display tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 rounded-xs"
              >
                <UserIcon size={12} /> My Account
              </button>
              <button
                onClick={() => { toggleAIAssistant(); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-neutral-100 border border-black/10 text-[#0B0B0B] text-[9px] font-display tracking-[0.2em] uppercase flex items-center justify-center gap-2 rounded-xs"
              >
                <Sparkles size={12} className="text-[#C9A227]" /> Stylist Consult
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
