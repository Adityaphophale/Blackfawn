import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Shield, Menu, X, HelpCircle, Phone, ChevronDown, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Category } from '../../../shared/types/types.ts';
import { NavItemConfig, DEFAULT_NAVIGATION_CONFIG } from '../../../shared/types/navConfig';
import { BRAND_LOGO } from '../../../shared/types/businessConfig';

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
  products: Product[];
  categoriesList: Category[];
  navConfig?: NavItemConfig[];
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
  products,
  categoriesList,
  navConfig,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Active mega menu item ID for desktop
  const [activeNavId, setActiveNavId] = useState<string | null>(null);

  // Accordion state for mobile menu
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  // Combined nav items configuration
  const navItems = (navConfig || DEFAULT_NAVIGATION_CONFIG)
    .filter((item) => item.enabled !== false)
    .sort((a, b) => a.order - b.order);

  // Announcement Bar Ticker
  const announcements = [
    "COMPLIMENTARY AIR SHIPPING ON ALL ORDERS OVER ₹999",
    "CUSTOMIZE YOUR 14-PIECE LUXURY GIFT HAMPER TODAY",
    "10-DAY CONCIERGE EXCHANGES & SEAMLESS REVERSE PICKUPS",
    "OFFICIAL BUSINESS ADDRESS: BHAYLI ROAD, VADODARA"
  ];
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveNavId(null);
        setSearchFocused(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search and mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveNavId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (link: { url: string; categoryFilter?: string; subCategoryFilter?: string; collectionFilter?: string; personalizedFilter?: boolean }) => {
    setActiveNavId(null);
    setMobileMenuOpen(false);
    setSelectedProductId(null);
    setSearchFocused(false);

    if (link.categoryFilter) {
      setCategoryFilter(link.categoryFilter);
    } else {
      setCategoryFilter('');
    }

    if (link.collectionFilter) {
      setSearchQuery(`coll:${link.collectionFilter}`);
    } else if (link.personalizedFilter) {
      setSearchQuery('personalized');
    } else {
      setSearchQuery('');
    }

    setTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setTab('shop');
    setSearchFocused(false);
  };

  const handleSuggestionClick = (prodId: string) => {
    setSelectedProductId(prodId);
    setSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Filter live search suggestions
  const liveSuggestions = localSearch.trim().length > 0
    ? products.filter(p => 
        p.name.toLowerCase().includes(localSearch.toLowerCase()) || 
        p.category.toLowerCase().includes(localSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header id="bf-header" className="fixed top-0 left-0 right-0 z-50 w-full bg-[#F8F7F2] text-[#111111] border-b border-[#E8E5DD] shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div 
        id="announcement-bar" 
        className="w-full bg-[#0B0B0B] py-1.5 px-4 text-center text-[10px] font-medium tracking-widest text-[#C9A227] uppercase flex items-center justify-between gap-2 overflow-hidden h-7 border-b border-[#1A1A1A] max-w-7xl mx-auto"
      >
        <div className="flex-1 flex items-center justify-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={announcementIndex}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span>{announcements[announcementIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <a
          href="tel:+919274821162"
          className="hidden sm:inline-flex items-center gap-1.5 text-[9.5px] font-semibold text-gray-300 hover:text-[#C9A227] tracking-wider transition-colors shrink-0"
          title="Call BLACKFAWN Support"
        >
          <Phone size={11} className="text-[#C9A227]" /> +91 9274821162
        </a>
      </div>

      {/* 2. Main Logo, Search & Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Mobile menu trigger & Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#111111] hover:text-[#C9A227] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center md:hidden transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <button
              id="brand-logo"
              onClick={() => { setTab('home'); setSelectedProductId(null); setSearchFocused(false); }}
              className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img 
                src={BRAND_LOGO} 
                alt="BLACKFAWN" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex w-full bg-[#FFFFFF] rounded-none border border-[#E8E5DD] focus-within:border-[#C9A227] transition-all">
              <input
                type="text"
                value={localSearch}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search t-shirts, gift hampers, personalized products..."
                className="w-full bg-transparent px-4 py-2 text-xs text-[#111111] placeholder-gray-400 outline-none border-none font-sans"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="px-2 text-gray-400 hover:text-[#0B0B0B] text-xs font-medium cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-5 bg-[#0B0B0B] text-white hover:text-[#C9A227] transition-colors flex items-center justify-center shrink-0 border-none cursor-pointer"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocused && liveSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1 bg-[#FFFFFF] border border-[#E8E5DD] shadow-2xl overflow-hidden z-50 text-[#111111] max-h-80 overflow-y-auto"
                >
                  <div className="p-3 bg-[#F3F1EB] border-b border-[#E8E5DD] flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#666666] tracking-widest uppercase">Catalog Search Results</span>
                    <button onClick={() => setSearchFocused(false)} className="text-[10px] text-[#C9A227] hover:underline font-semibold cursor-pointer">Close</button>
                  </div>
                  <div className="divide-y divide-[#E8E5DD]">
                    {liveSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSuggestionClick(prod.id)}
                        className="flex items-center gap-3 p-3 hover:bg-[#F8F7F2] cursor-pointer transition-colors"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-12 object-cover border border-[#E8E5DD]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-serif font-bold text-[#0B0B0B] truncate uppercase">{prod.name}</p>
                          <p className="text-[10px] text-[#666666] capitalize">{prod.category}</p>
                        </div>
                        <div className="text-xs font-semibold text-[#0B0B0B]">
                          ₹{prod.discountPrice || prod.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Icons Group */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a
              href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
              className="p-2 min-h-[44px] min-w-[44px] text-[#111111] hover:text-[#C9A227] transition-colors relative flex items-center justify-center gap-1.5 cursor-pointer"
              title="Admin Control"
            >
              <Shield size={18} className="text-[#C9A227]" />
              <span className="text-xs font-medium uppercase tracking-wider hidden lg:inline">Admin</span>
            </a>

            <button
              onClick={() => setTab('profile')}
              className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer gap-1.5 ${
                currentTab === 'profile' ? 'text-[#C9A227]' : 'text-[#111111] hover:text-[#C9A227]'
              }`}
              title="My Account"
            >
              <UserIcon size={18} />
              <span className="text-xs font-medium uppercase tracking-wider hidden lg:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            <button
              onClick={() => { setCategoryFilter(''); setSearchQuery('coll:Best Sellers'); setTab('shop'); }}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#111111] hover:text-[#C9A227] transition-colors relative cursor-pointer"
              title="Wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-[#C9A227] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              id="cart-drawer-trigger"
              onClick={toggleCart}
              className="px-3.5 py-2 bg-[#0B0B0B] text-white hover:border-[#C9A227] border border-[#0B0B0B] transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
              title="Shopping Bag"
            >
              <ShoppingBag size={16} className="text-[#C9A227]" />
              <span className="text-xs font-medium tracking-wider uppercase hidden sm:inline">Bag</span>
              <span className="text-[11px] font-bold text-[#C9A227] sm:pl-1 sm:border-l border-gray-700">
                {cartCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Official 7-Item Desktop Main Navigation Bar */}
      <div ref={megaMenuRef} className="w-full bg-[#F3F1EB] text-[#111111] border-t border-[#E8E5DD] relative hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs tracking-wider uppercase">
          
          <nav className="flex items-center space-x-7 py-2.5 overflow-x-auto scrollbar-none font-medium">
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              const isHampers = item.label.includes('HAMPERS');
              const isSale = item.label === 'SALE';
              const isPersonalized = item.label === 'PERSONALIZED';

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveNavId(item.id)}
                >
                  <button
                    onClick={() => {
                      if (item.ctaUrl) {
                        handleNavClick({ url: item.ctaUrl, categoryFilter: item.slug === 't-shirts' ? 'T-Shirts' : item.slug === 'hampers' ? 'Hampers & Gifting' : undefined });
                      } else {
                        setActiveNavId(isActive ? null : item.id);
                      }
                    }}
                    className={`py-1 cursor-pointer flex items-center gap-1 font-bold transition-colors hover-gold-underline ${
                      isHampers || isPersonalized ? 'text-[#C9A227]' : isSale ? 'text-red-700' : 'text-[#0B0B0B]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${isActive ? 'rotate-180 text-[#C9A227]' : ''}`} />
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-4 text-[11px] text-[#666666] font-medium py-2.5">
            <button onClick={() => setTab('profile')} className="hover:text-[#0B0B0B] flex items-center gap-1.5 cursor-pointer">
              <HelpCircle size={13} className="text-[#C9A227]" /> Concierge & Support
            </button>
          </div>
        </div>

        {/* Desktop Full-Width Mega Menu Dropdown */}
        <AnimatePresence>
          {activeNavId && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              onMouseLeave={() => setActiveNavId(null)}
              className="absolute top-full left-0 right-0 w-full bg-[#FFFFFF] border-b border-[#E8E5DD] shadow-2xl z-50 text-[#111111]"
            >
              {(() => {
                const currentNavItem = navItems.find((i) => i.id === activeNavId);
                if (!currentNavItem) return null;

                return (
                  <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">
                    
                    {/* Left/Middle: Subcategory Columns */}
                    <div className="col-span-8 grid grid-cols-3 gap-6">
                      {currentNavItem.columns.map((col) => (
                        <div key={col.id} className="space-y-3">
                          <h4 className="text-[11px] font-serif font-bold text-[#0B0B0B] tracking-widest border-b border-[#E8E5DD] pb-2 uppercase flex items-center gap-1">
                            <Sparkles size={11} className="text-[#C9A227]" /> {col.title}
                          </h4>
                          <ul className="space-y-2 text-xs font-medium normal-case">
                            {col.links.map((link) => (
                              <li key={link.id}>
                                <button
                                  onClick={() => handleNavClick(link)}
                                  className="text-gray-700 hover:text-[#C9A227] transition-colors text-left block w-full cursor-pointer py-0.5"
                                >
                                  {link.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Right: Editorial Featured Image Card */}
                    {currentNavItem.featuredCard && (
                      <div className="col-span-4 bg-[#F8F7F2] border border-[#E8E5DD] p-4 flex flex-col justify-between relative overflow-hidden group shadow-xs">
                        <div className="relative z-10 space-y-2">
                          <span className="text-[9px] font-serif font-bold text-[#C9A227] tracking-widest uppercase">FEATURED CURATION</span>
                          <h3 className="text-base font-serif font-bold text-[#0B0B0B] uppercase tracking-wide leading-tight">
                            {currentNavItem.featuredCard.title}
                          </h3>
                          <p className="text-xs text-gray-600 font-sans line-clamp-2">
                            {currentNavItem.featuredCard.subtitle}
                          </p>
                        </div>

                        <div className="relative h-36 w-full my-3 overflow-hidden border border-[#E8E5DD]">
                          <img
                            src={currentNavItem.featuredCard.image}
                            alt={currentNavItem.featuredCard.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <button
                          onClick={() => handleNavClick({ url: currentNavItem.featuredCard!.ctaUrl })}
                          className="w-full py-2.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] text-xs font-bold uppercase tracking-widest border border-[#0B0B0B] transition-all flex items-center justify-center gap-2 cursor-pointer relative z-10"
                        >
                          <span>{currentNavItem.featuredCard.ctaText}</span>
                          <ArrowRight size={13} className="text-[#C9A227]" />
                        </button>
                      </div>
                    )}

                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Full-Screen Mobile Accordion Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 z-50 bg-[#F8F7F2] text-[#111111] flex flex-col h-full overflow-y-auto"
          >
            {/* Mobile Header Top Bar */}
            <div className="p-4 bg-[#FFFFFF] border-b border-[#E8E5DD] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="BLACKFAWN" className="h-8 w-8 rounded-full border border-[#C9A227] p-0.5" />
                <span className="text-lg font-serif font-bold uppercase tracking-wider text-[#0B0B0B]">
                  BLACK<span className="text-[#C9A227] italic font-normal">FAWN</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#0B0B0B] hover:text-[#C9A227] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="p-4 bg-[#F3F1EB] border-b border-[#E8E5DD]">
              <form onSubmit={handleSearchSubmit} className="flex w-full bg-white border border-[#E8E5DD]">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search t-shirts, hampers, caps..."
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-[#111111] outline-none border-none font-sans"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#0B0B0B] text-white flex items-center justify-center cursor-pointer min-h-[44px]"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Mobile Accordion Nav Links */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              <p className="text-[10px] font-serif font-bold text-[#C9A227] tracking-widest uppercase border-b border-[#E8E5DD] pb-2 mb-3">
                BLACKFAWN MERCHANDISING
              </p>

              {navItems.map((item) => {
                const isExpanded = expandedMobileId === item.id;

                return (
                  <div key={item.id} className="border-b border-[#E8E5DD] pb-2">
                    <button
                      onClick={() => setExpandedMobileId(isExpanded ? null : item.id)}
                      className="w-full py-3 min-h-[44px] flex items-center justify-between text-left font-serif font-bold text-sm uppercase text-[#0B0B0B] hover:text-[#C9A227] transition-colors cursor-pointer"
                    >
                      <span className={item.label.includes('HAMPERS') || item.label === 'PERSONALIZED' ? 'text-[#C9A227]' : item.label === 'SALE' ? 'text-red-700' : ''}>
                        {item.label}
                      </span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#C9A227]' : ''}`} />
                    </button>

                    {/* Expanded Accordion Column Links */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 py-2 space-y-4 overflow-hidden"
                        >
                          {item.columns.map((col) => (
                            <div key={col.id} className="space-y-1.5">
                              <span className="text-[10px] font-serif font-bold text-gray-500 tracking-wider uppercase block">
                                {col.title}
                              </span>
                              <div className="space-y-1">
                                {col.links.map((link) => (
                                  <button
                                    key={link.id}
                                    onClick={() => handleNavClick(link)}
                                    className="w-full text-left py-2 text-xs font-semibold text-gray-800 hover:text-[#C9A227] min-h-[44px] flex items-center cursor-pointer"
                                  >
                                    <ChevronRight size={12} className="text-[#C9A227] mr-1.5 shrink-0" />
                                    {link.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Mobile Footer CTAs */}
            <div className="p-4 bg-[#FFFFFF] border-t border-[#E8E5DD] space-y-2">
              <button
                onClick={() => { setTab('profile'); setMobileMenuOpen(false); }}
                className="w-full py-3 min-h-[44px] bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider border border-[#0B0B0B] hover:border-[#C9A227] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserIcon size={16} className="text-[#C9A227]" /> Customer Concierge & Account
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
