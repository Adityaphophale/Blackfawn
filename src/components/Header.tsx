import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Shield, Menu, X, ArrowRight, Sparkles, ChevronDown, HelpCircle } from 'lucide-react';
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
  products,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Announcement carousel
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const announcements = [
    "⚡ FASHION MEGA DROP: FLAT 50% OFF ON SELECTED ITEMS ⚡",
    "🚚 FREE EXPRESS AIR SHIPPING NATIONWIDE ON ORDERS ABOVE ₹999",
    "✨ 10-DAY EASY RETURNS & REPLACEMENTS • COD AVAILABLE ✨"
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

  const categories = [
    { label: 'Oversized Fit', value: 'Oversized' },
    { label: 'T-Shirts', value: 'T-Shirts' },
    { label: 'Hoodies & Fleece', value: 'Hoodies' },
    { label: 'Cargo Pants', value: 'Cargo Pants' },
    { label: 'Sneakers', value: 'Sneakers' },
    { label: 'Accessories', value: 'Accessories' }
  ];

  const liveSuggestions = localSearch.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(localSearch.toLowerCase()) || p.category.toLowerCase().includes(localSearch.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <header id="bf-header" className="fixed top-0 left-0 right-0 z-50 w-full shadow-md bg-[#131921] text-white">
      {/* 1. Top Announcement Bar */}
      <div 
        id="announcement-bar" 
        className="w-full bg-[#f97316] py-1.5 px-4 text-center text-[10px] font-bold tracking-wider text-white uppercase flex items-center justify-center gap-2 overflow-hidden h-7"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={announcementIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span>{announcements[announcementIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Main Navigation & Search Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Menu & Logo Group */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[#f97316] p-1.5 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <button
              id="brand-logo"
              onClick={() => { setTab('home'); setSelectedProductId(null); setSearchFocused(false); }}
              className="flex items-center gap-1.5 text-lg sm:text-2xl font-black tracking-wider text-white uppercase cursor-pointer hover:opacity-95"
            >
              <ShoppingBag className="text-[#f97316] h-6 w-6 sm:h-7 sm:w-7" />
              <span>BLACK<span className="text-[#f97316]">FAWN</span></span>
            </button>
          </div>

          {/* Persistent E-commerce Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex w-full bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-[#f97316] transition-all">
              <input
                type="text"
                value={localSearch}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search premium apparel, oversized tees, sneakers, cargos..."
                className="w-full bg-transparent px-4 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none border-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="px-2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-6 bg-[#f97316] text-white hover:bg-[#e0620d] transition-colors flex items-center justify-center shrink-0 border-none cursor-pointer"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocused && liveSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50 text-gray-900 max-h-80 overflow-y-auto"
                >
                  <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Products Found</span>
                    <button onClick={() => setSearchFocused(false)} className="text-[10px] text-[#f97316] hover:underline font-bold">Close</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {liveSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSuggestionClick(prod.id)}
                        className="flex items-center gap-3 p-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-9 h-11 object-cover rounded-md border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate uppercase">{prod.name}</p>
                          <p className="text-[10px] text-gray-500 capitalize">{prod.category} • {prod.fit}</p>
                        </div>
                        <div className="text-xs font-bold text-[#f97316]">
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
          <div className="flex items-center space-x-1 sm:space-x-3">


            {/* Account Profile */}
            <button
              onClick={() => setTab('profile')}
              className={`p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                currentTab === 'profile' ? 'bg-[#f97316] text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              title="My Account"
            >
              <UserIcon size={20} />
              <span className="text-xs font-semibold hidden lg:inline">
                {currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Sign In'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => { setCategoryFilter(''); setSearchQuery(''); setTab('shop'); }}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
              title="My Saved Wishlist"
            >
              <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-bounce"></span>
              )}
            </button>

            {/* Cart Box */}
            <button
              id="header-cart-btn"
              onClick={toggleCart}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors relative cursor-pointer flex items-center gap-1"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#f97316] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#131921]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden lg:inline">Cart</span>
            </button>

            {/* Admin Badge */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setTab('admin')}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  currentTab === 'admin' ? 'bg-[#f97316] text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="Admin Control"
              >
                <Shield size={20} className={currentTab === 'admin' ? 'text-white' : 'text-amber-400'} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search input strip (Only shown on small viewports) */}
      <div className="px-4 pb-3 pt-0.5 md:hidden bg-[#131921]">
        <form onSubmit={handleSearchSubmit} className="flex w-full bg-white rounded-lg overflow-hidden border border-gray-300">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search fashion catalog..."
            className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 outline-none border-none"
          />
          <button
            type="submit"
            className="px-4 bg-[#f97316] text-white hover:bg-[#e0620d] flex items-center justify-center shrink-0 border-none"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* 3. Sub-Navigation Categories Strip */}
      <div className="w-full bg-[#f8fafc] text-gray-800 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none py-2 text-xs font-semibold tracking-wide">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => { setCategoryFilter(''); setTab('shop'); }}
              className={`hover:text-[#f97316] cursor-pointer ${currentTab === 'shop' && !localSearch ? 'text-[#f97316] border-b-2 border-[#f97316] pb-0.5' : 'text-gray-600'}`}
            >
              All Fashion
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.value)}
                className="text-gray-600 hover:text-[#f97316] cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-4 text-[11px] text-gray-500 font-medium">
            <button onClick={() => setTab('profile')} className="hover:text-gray-800 flex items-center gap-1 cursor-pointer">
              <HelpCircle size={12} /> Easy Returns Policies
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-[110px] z-40 bg-white flex flex-col justify-between py-6 px-5 overflow-y-auto border-t border-gray-200 text-gray-900"
          >
            <div className="flex flex-col space-y-4">
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase border-b border-gray-100 pb-2">PRODUCT CATEGORIES</p>
              <button
                onClick={() => { setMobileMenuOpen(false); setCategoryFilter(''); setTab('shop'); }}
                className="text-sm font-semibold text-left text-gray-700 hover:text-[#f97316] py-1 border-b border-gray-50"
              >
                All Apparel
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.value)}
                  className="text-sm font-semibold text-left text-gray-700 hover:text-[#f97316] py-1 border-b border-gray-50"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col space-y-2 border-t border-gray-100 pt-6">
              <button
                onClick={() => { setTab('profile'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-[#131921] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
              >
                <UserIcon size={14} /> Account Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
