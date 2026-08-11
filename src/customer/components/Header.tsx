import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Shield, Menu, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Category } from '../../shared/types';

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
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Announcement carousel
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const announcements = [
    "BLACKFAWN HIGH FASHION • EXCLUSIVE SEASONAL DROPS",
    "COMPLIMENTARY AIR SHIPPING WITHIN INDIA ON ORDERS OVER ₹999",
    "10-DAY COMPLIMENTARY EXCHANGES • COD AVAILABLE NATIONWIDE"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Close search suggestions on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (cat: string) => {
    setCategoryFilter(cat);
    setTab('shop');
    setMobileMenuOpen(false);
    setSearchFocused(false);
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

  const categories = categoriesList.map(c => ({
    label: c.name,
    value: c.slug
  }));

  const liveSuggestions = localSearch.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(localSearch.toLowerCase()) || p.category.toLowerCase().includes(localSearch.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <header id="bf-header" className="fixed top-0 left-0 right-0 z-50 w-full bg-[#F8F7F2] text-[#111111] border-b border-[#E8E5DD] shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div 
        id="announcement-bar" 
        className="w-full bg-[#0B0B0B] py-1.5 px-4 text-center text-[10px] font-medium tracking-widest text-[#C9A227] uppercase flex items-center justify-center gap-2 overflow-hidden h-7 border-b border-[#1A1A1A]"
      >
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

      {/* 2. Main Navigation & Search Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Menu & Logo Group */}
          <div className="flex items-center gap-4">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#111111] hover:text-[#C9A227] p-1 md:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <button
              id="brand-logo"
              onClick={() => { setTab('home'); setSelectedProductId(null); setSearchFocused(false); }}
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity group"
            >
              <img 
                src="/logo.jpg" 
                alt="BLACKFAWN Emblem" 
                className="h-9 w-9 sm:h-11 sm:w-11 object-contain rounded-full border border-[#C9A227] p-0.5 shadow-xs group-hover:scale-105 transition-transform" 
              />
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-[#0B0B0B] uppercase">
                BLACK<span className="text-[#C9A227] italic font-normal">FAWN</span>
              </span>
            </button>
          </div>

          {/* Persistent Luxury Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex w-full bg-[#FFFFFF] rounded-none border border-[#E8E5DD] focus-within:border-[#C9A227] transition-all">
              <input
                type="text"
                value={localSearch}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search luxury drops, garments, accessories..."
                className="w-full bg-transparent px-4 py-2 text-xs text-[#111111] placeholder-gray-400 outline-none border-none font-sans"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="px-2 text-gray-400 hover:text-[#0B0B0B] text-xs font-medium"
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
                    <span className="text-[10px] font-bold text-[#666666] tracking-widest uppercase">Catalog Match</span>
                    <button onClick={() => setSearchFocused(false)} className="text-[10px] text-[#C9A227] hover:underline font-semibold">Close</button>
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
                          <p className="text-[10px] text-[#666666] capitalize">{prod.category} • {prod.fit}</p>
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

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Admin Portal Button */}
            <a
              href="#/admin"
              onClick={() => { setTab('admin'); setSearchFocused(false); }}
              className="p-2 text-[#111111] hover:text-[#C9A227] transition-colors relative flex items-center gap-1.5 cursor-pointer"
              title="Admin Portal"
            >
              <Shield size={18} className="text-[#C9A227]" />
              <span className="text-xs font-medium uppercase tracking-wider hidden lg:inline">Admin</span>
            </a>

            {/* Profile */}
            <button
              onClick={() => setTab('profile')}
              className={`p-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'profile' ? 'text-[#C9A227]' : 'text-[#111111] hover:text-[#C9A227]'
              }`}
              title="My Account"
            >
              <UserIcon size={18} />
              <span className="text-xs font-medium uppercase tracking-wider hidden lg:inline">
                {currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Account'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => { setCategoryFilter(''); setSearchQuery(''); setTab('shop'); }}
              className="p-2 text-[#111111] hover:text-[#C9A227] transition-colors relative cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart size={18} className={wishlist.length > 0 ? 'fill-[#C9A227] text-[#C9A227]' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-[#C9A227] rounded-full"></span>
              )}
            </button>

            {/* Cart Box */}
            <button
              id="header-cart-btn"
              onClick={toggleCart}
              className="px-3 py-1.5 bg-[#0B0B0B] text-white hover:border-[#C9A227] border border-[#0B0B0B] transition-all cursor-pointer flex items-center gap-2"
              title="Bag"
            >
              <ShoppingBag size={16} className="text-[#C9A227]" />
              <span className="text-xs font-medium tracking-wider uppercase">Bag</span>
              <span className="text-[11px] font-bold text-[#C9A227] pl-1 border-l border-gray-700">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search input strip */}
      <div className="px-4 pb-3 pt-1 md:hidden bg-[#F8F7F2]">
        <form onSubmit={handleSearchSubmit} className="flex w-full bg-white border border-[#E8E5DD]">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search fashion catalog..."
            className="w-full bg-transparent px-3 py-1.5 text-xs text-[#111111] outline-none border-none"
          />
          <button
            type="submit"
            className="px-3 bg-[#0B0B0B] text-white hover:text-[#C9A227] flex items-center justify-center shrink-0 border-none"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* 3. Sub-Navigation Categories Strip */}
      <div className="w-full bg-[#F3F1EB] text-[#111111] border-t border-[#E8E5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none py-2.5 text-xs tracking-wider uppercase">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => { setCategoryFilter(''); setTab('shop'); }}
              className={`hover-gold-underline font-medium cursor-pointer ${currentTab === 'shop' && !localSearch ? 'text-[#C9A227] font-semibold' : 'text-[#111111]'}`}
            >
              All Garments
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.value)}
                className={`cursor-pointer font-medium hover-gold-underline ${
                  cat.label === 'Hampers & Gifting' 
                    ? 'text-[#C9A227] font-semibold flex items-center gap-1.5' 
                    : 'text-[#666666] hover:text-[#0B0B0B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-4 text-[11px] text-[#666666] font-medium">
            <button onClick={() => setTab('profile')} className="hover:text-[#0B0B0B] flex items-center gap-1.5 cursor-pointer">
              <HelpCircle size={13} className="text-[#C9A227]" /> Concierge & Size Guide
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-[110px] z-40 bg-[#F8F7F2] flex flex-col justify-between py-6 px-6 overflow-y-auto border-t border-[#E8E5DD] text-[#111111]"
          >
            <div className="flex flex-col space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-[#666666] uppercase border-b border-[#E8E5DD] pb-2">Collections</p>
              <button
                onClick={() => { setMobileMenuOpen(false); setCategoryFilter(''); setTab('shop'); }}
                className="text-sm font-serif font-semibold text-left text-[#0B0B0B] hover:text-[#C9A227] py-1.5 border-b border-[#E8E5DD]"
              >
                All Products
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`text-sm font-serif font-semibold text-left py-1.5 border-b border-[#E8E5DD] ${
                    cat.label === 'Hampers & Gifting' ? 'text-[#C9A227]' : 'text-[#0B0B0B] hover:text-[#C9A227]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col space-y-3 border-t border-[#E8E5DD] pt-6">
              <button
                onClick={() => { setTab('profile'); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-[#0B0B0B] text-white text-xs font-semibold uppercase tracking-wider border border-[#0B0B0B] hover:border-[#C9A227] flex items-center justify-center gap-2"
              >
                <UserIcon size={14} className="text-[#C9A227]" /> My Client Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

