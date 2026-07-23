import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, Sparkles, TrendingUp, ShieldCheck, Truck, RefreshCw, BadgePercent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../../shared/types';
import ProductCard from '../components/ProductCard';

interface HomeViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  onQuickView: (product: Product) => void;
  setTab: (tab: string) => void;
  setCategoryFilter: (cat: string) => void;
  categoriesList: Category[];
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600",
    title: "UP TO 60% OFF: SEASON SALE",
    subtitle: "Upgrade your casual wardrobe with our premium printed tees, caps, and towels. Limited stock availability.",
    tag: "TODAY'S HOT DEAL",
    category: "Printed T-Shirts"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1600",
    title: "SIGNATURE EMBROIDERY CAPS",
    subtitle: "Engineered with brass slide adjustments and canvas cotton layers. Experience style & comfort.",
    tag: "NEW LAUNCH SPECIAL",
    category: "Caps"
  }
];

export default function HomeView({
  products,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onQuickView,
  setTab,
  setCategoryFilter,
  categoriesList,
}: HomeViewProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 44, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 44, seconds: 12 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerAction = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe checks since products come dynamically from database
  const dealsProducts = products.filter(p => p.variants?.some(v => v.salePrice)).slice(0, 4);
  const trendingProducts = products.filter((p) => p.isBestSeller || p.isTrending).slice(0, 4);

  const formatNum = (num: number) => String(num).padStart(2, '0');

  return (
    <div id="home-view-container" className="space-y-16 pb-20 pt-10 overflow-x-hidden bg-[#f1f5f9] text-[#1e293b]">
      
      {/* 1. HERO CAROUSEL */}
      <section id="hero-slider-section" className="relative h-[480px] bg-slate-900 overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent z-10" />
            
            <img
              src={HERO_SLIDES[activeSlide].image}
              alt={HERO_SLIDES[activeSlide].title}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center items-start">
              <div className="max-w-2xl space-y-4">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#f97316] uppercase bg-white/95 px-3 py-1 rounded-md"
                >
                  <Sparkles size={12} className="animate-pulse text-[#f97316]" /> {HERO_SLIDES[activeSlide].tag}
                </motion.span>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl font-extrabold tracking-wide text-white leading-tight"
                >
                  {HERO_SLIDES[activeSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-lg"
                >
                  {HERO_SLIDES[activeSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2"
                >
                  <button
                    onClick={() => handleBannerAction(HERO_SLIDES[activeSlide].category)}
                    className="px-6 py-3 bg-[#f97316] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#e0620d] transition-all flex items-center gap-2 rounded-lg cursor-pointer shadow-lg"
                  >
                    SHOP THIS DEAL <ArrowRight size={14} />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 transition-all rounded-full ${activeSlide === idx ? 'w-6 bg-[#f97316]' : 'w-2 bg-gray-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. TRUST / VALUES PILLARS */}
      <section id="trust-pillars-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex items-center gap-3.5 p-2">
            <div className="p-3 bg-orange-50 text-[#f97316] rounded-full">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Free Air Shipping</h4>
              <p className="text-[10px] text-gray-500 font-medium">Free express delivery on orders &gt; ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-2 border-l border-gray-100 lg:border-l lg:pl-6">
            <div className="p-3 bg-orange-50 text-[#f97316] rounded-full">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Easy 10-day Returns</h4>
              <p className="text-[10px] text-gray-500 font-medium">Hassle-free size replacement</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-2 border-l border-gray-100 lg:border-l lg:pl-6">
            <div className="p-3 bg-orange-50 text-[#f97316] rounded-full">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Secure Checkout</h4>
              <p className="text-[10px] text-gray-500 font-medium">100% encrypted online payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-2 border-l border-gray-100 lg:border-l lg:pl-6">
            <div className="p-3 bg-orange-50 text-[#f97316] rounded-full">
              <BadgePercent size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Genuine Products</h4>
              <p className="text-[10px] text-gray-500 font-medium">Direct brand authentic catalog</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY CLUSTERS GRID */}
      <section id="featured-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-1 pb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-gray-900 uppercase">Browse Categories</h2>
          <p className="text-xs text-gray-500 font-medium">Find the perfect silhouette for your lifestyle</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesList.slice(0, 4).map((cat, idx) => {
            const images: Record<string, string> = {
              "Printed T-Shirts": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400",
              "Caps": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400",
              "Socks": "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=400",
              "Hand Napkins": "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=400",
              "Towels": "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=400"
            };
            const catImage = images[cat.name] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400";
            return (
              <div
                key={cat.id || idx}
                onClick={() => handleBannerAction(cat.name)}
                className="relative h-[220px] rounded-lg overflow-hidden group cursor-pointer shadow-xs border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent z-10 transition-all duration-300 group-hover:bg-slate-900/50" />
                <img
                  src={catImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">{cat.name}</h3>
                  <span className="text-[10px] text-[#f97316] font-semibold flex items-center gap-1 group-hover:underline">
                    Shop Now <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DEALS OF THE DAY COUNTER */}
      <section id="deals-of-the-day" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                <Flame size={12} className="animate-pulse" /> FLASH DEAL
              </span>
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Deals of the Day</h2>
              
              {/* Countdown */}
              <div className="flex items-center gap-1 text-[#f97316] text-xs font-bold ml-2">
                <span>Ends in:</span>
                <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{formatNum(countdown.hours)}h</span>
                <span>:</span>
                <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{formatNum(countdown.minutes)}m</span>
                <span>:</span>
                <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 text-red-500 animate-pulse">{formatNum(countdown.seconds)}s</span>
              </div>
            </div>

            <button
              onClick={() => handleBannerAction('')}
              className="text-xs font-bold text-[#f97316] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Offers <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dealsProducts.length > 0 ? (
              dealsProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some((w) => w.id === product.id)}
                  onCardClick={() => onProductClick(product)}
                />
              ))
            ) : (
              products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some((w) => w.id === product.id)}
                  onCardClick={() => onProductClick(product)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. TRENDING / BEST SELLERS */}
      <section id="trending-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-gray-200 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-[#f97316] tracking-wider uppercase flex items-center gap-1">
              <TrendingUp size={12} /> HIGHEST DEMAND CATALOG
            </span>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mt-1">Trending Styles</h2>
          </div>
          <button
            onClick={() => handleBannerAction('')}
            className="text-xs font-bold text-gray-600 hover:text-[#f97316] flex items-center gap-1 cursor-pointer"
          >
            Explore Catalog <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.some((w) => w.id === product.id)}
              onCardClick={() => onProductClick(product)}
            />
          ))}
        </div>
      </section>

      {/* 6. VIP ACCESS NEWSLETTER */}
      <section id="vip-newsletter" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-slate-900 text-white border border-slate-800 py-12 px-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 text-white/[0.02] font-black text-9xl tracking-wider select-none pointer-events-none uppercase">
            FAWN
          </div>
          <span className="text-[10px] font-bold tracking-wider text-[#f97316] uppercase">JOIN THE CLUB</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide uppercase mt-1">SUBSCRIBE FOR EARLY OFFERS</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
            Receive exclusive early-access discounts, launch notifications, and premium restock alerts before anyone else.
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("Welcome to Blackfawn newsletter! Early access offers have been sent to your email."); }} className="flex flex-col sm:flex-row justify-center gap-2 mt-6 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your active email address"
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#f97316] outline-none w-full text-center rounded-lg"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#f97316] text-white text-xs font-bold uppercase hover:bg-[#e0620d] transition-all cursor-pointer whitespace-nowrap rounded-lg shadow-md"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
