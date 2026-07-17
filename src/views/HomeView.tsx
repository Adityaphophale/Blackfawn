import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, Sparkles, TrendingUp, ShieldCheck, ChevronLeft, ChevronRight, MessageSquareCode, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
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
  toggleAIAssistant: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600",
    title: "ACT II: CHRONIC CHASM",
    subtitle: "A digital rebellion in drop-shoulder geometry, pigment dye washes, and heavyweight 240-400 GSM structures.",
    tag: "CAPSULE DROP OUT NOW",
    category: "Oversized"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1600",
    title: "TACTICAL ARMOR CODES",
    subtitle: "Premium cotton-elastane ripstop cargos designed with dual adjustments and water-resistant layers.",
    tag: "BESTSELLING CODES RESTOCKED",
    category: "Cargo Pants"
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
  toggleAIAssistant,
}: HomeViewProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 14, minutes: 32, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerAction = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trendingProducts = products.filter((p) => p.isBestSeller).slice(0, 4);
  const limitedCollection = products.filter((p) => p.isLimited).slice(0, 4);

  const formatNum = (num: number) => String(num).padStart(2, '0');

  return (
    <div id="home-view-container" className="space-y-24 pb-20 pt-[60px] overflow-x-hidden bg-[#F8F8F6] text-[#0B0B0B]">
      
      {/* 1. HERO SLIDER */}
      <section id="hero-slider-section" className="relative h-[calc(100vh-120px)] min-h-[500px] bg-[#0B0B0B] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-[#0B0B0B]/30 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent z-10" />
            
            <img
              src={HERO_SLIDES[activeSlide].image}
              alt={HERO_SLIDES[activeSlide].title}
              className="absolute inset-0 w-full h-full object-cover object-top filter brightness-90 contrast-[1.02]"
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
              <div className="max-w-2xl space-y-5">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.3em] text-[#C9A227] uppercase bg-[#0B0B0B]/50 px-3 py-1 border border-[#C9A227]/20"
                >
                  <Sparkles size={10} className="animate-pulse" /> {HERO_SLIDES[activeSlide].tag}
                </motion.span>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-6xl font-display font-black tracking-widest text-[#F8F8F6] uppercase leading-tight"
                >
                  {HERO_SLIDES[activeSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs sm:text-sm text-neutral-300 font-sans tracking-wide uppercase leading-relaxed max-w-lg"
                >
                  {HERO_SLIDES[activeSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 flex flex-wrap gap-3"
                >
                  <button
                    id={`hero-cta-shop-${activeSlide}`}
                    onClick={() => handleBannerAction(HERO_SLIDES[activeSlide].category)}
                    className="px-8 py-3 bg-[#F8F8F6] text-[#0B0B0B] text-[10px] font-display font-black tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-all flex items-center gap-2 rounded-none"
                  >
                    SECURE APPAREL <ArrowRight size={12} />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1 transition-all ${activeSlide === idx ? 'w-6 bg-[#C9A227]' : 'w-2 bg-neutral-600'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORY BENTO GRID */}
      <section id="featured-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-2 pb-10">
          <span className="text-[9px] font-mono tracking-[0.35em] text-[#C9A227] uppercase font-bold">Architecture Outline</span>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-widest text-[#0B0B0B] uppercase">METROPOLIS DEPARTMENTS</h2>
          <div className="h-[1px] w-12 bg-[#0B0B0B] mt-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Asymmetric Bento - Oversized Fit */}
          <div
            onClick={() => handleBannerAction('Oversized')}
            className="relative h-[400px] bg-[#0B0B0B] border border-[#0B0B0B]/10 overflow-hidden group rounded-none cursor-pointer shadow-xs"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent z-10 transition-all duration-300 group-hover:bg-black/40" />
            <img
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"
              alt="Oversized Collection"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-102 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 z-20 space-y-1">
              <span className="text-[8px] font-mono tracking-widest text-[#C9A227] uppercase bg-[#0B0B0B] px-2 py-0.5 border border-[#C9A227]/20">240-400 GSM</span>
              <h3 className="text-lg font-display font-black tracking-widest text-white uppercase">Oversized Silhouette</h3>
              <p className="text-[9px] text-neutral-300 font-mono uppercase flex items-center gap-1 group-hover:text-[#C9A227] transition-colors">
                View Collection <ArrowRight size={8} />
              </p>
            </div>
          </div>

          {/* Cargo Pants */}
          <div
            onClick={() => handleBannerAction('Cargo Pants')}
            className="relative h-[400px] bg-[#0B0B0B] border border-[#0B0B0B]/10 overflow-hidden group rounded-none cursor-pointer shadow-xs"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent z-10 transition-all duration-300 group-hover:bg-black/40" />
            <img
              src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=800"
              alt="Tactical Cargos"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-102 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 z-20 space-y-1">
              <span className="text-[8px] font-mono tracking-widest text-[#C9A227] uppercase bg-[#0B0B0B] px-2 py-0.5 border border-[#C9A227]/20">RIPSTOP TWILL</span>
              <h3 className="text-lg font-display font-black tracking-widest text-white uppercase">Tactical Cargos</h3>
              <p className="text-[9px] text-neutral-300 font-mono uppercase flex items-center gap-1 group-hover:text-[#C9A227] transition-colors">
                View Collection <ArrowRight size={8} />
              </p>
            </div>
          </div>

          {/* Sneakers */}
          <div
            onClick={() => handleBannerAction('Sneakers')}
            className="relative h-[400px] bg-[#0B0B0B] border border-[#0B0B0B]/10 overflow-hidden group rounded-none cursor-pointer shadow-xs"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent z-10 transition-all duration-300 group-hover:bg-black/40" />
            <img
              src="https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=800"
              alt="Signature Sneakers"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 z-20 space-y-1">
              <span className="text-[8px] font-mono tracking-widest text-[#C9A227] uppercase bg-[#0B0B0B] px-2 py-0.5 border border-[#C9A227]/20">STEALTH RUNNERS</span>
              <h3 className="text-lg font-display font-black tracking-widest text-white uppercase">Stealth Sneakers</h3>
              <p className="text-[9px] text-neutral-300 font-mono uppercase flex items-center gap-1 group-hover:text-[#C9A227] transition-colors">
                View Collection <ArrowRight size={8} />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING DROPS */}
      <section id="trending-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 border-b border-[#0B0B0B]/10 pb-4 mb-8">
          <div>
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#C9A227] uppercase flex items-center gap-1">
              <TrendingUp size={10} className="text-[#C9A227]" /> GLOBAL COLLECTION DEMAND
            </span>
            <h2 className="text-2xl font-display font-black tracking-widest text-[#0B0B0B] uppercase mt-0.5">TRENDING APPAREL</h2>
          </div>
          <button
            onClick={() => handleBannerAction('')}
            className="text-[10px] font-display tracking-[0.2em] text-[#0B0B0B] hover:text-[#C9A227] uppercase transition-all flex items-center gap-1.5 cursor-pointer font-bold shrink-0 self-start sm:self-auto"
          >
            Explore Catalog <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
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

      {/* 4. FLASH SALE COUNTER */}
      <section id="flash-sale-countdown" className="bg-[#0B0B0B] py-16 border-y border-[#0B0B0B]/10 relative overflow-hidden text-[#F8F8F6]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] sm:text-[20rem] font-display font-black text-white/[0.01] uppercase tracking-tighter select-none pointer-events-none whitespace-nowrap">
          SHADOWS
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-lg text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#C9A227] uppercase bg-white/5 px-3 py-1 border border-[#C9A227]/20">
              <Flame size={10} className="animate-pulse text-[#C9A227]" /> HIGH-VELOCITY APPAREL
            </span>
            <h2 className="text-3xl font-display font-black tracking-widest text-[#F8F8F6] uppercase leading-tight">
              LIMITED SECURE RUN CODES
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed uppercase tracking-wider">
              Secure enzyme-wash hoodies and raw-edge distressed knits before stock depletion. These items are strictly limited and will not undergo repeat construction.
            </p>
            
            {/* Timer visual */}
            <div className="flex justify-center lg:justify-start gap-2.5 pt-1.5">
              <div className="flex flex-col items-center bg-[#0B0B0B] border border-[#F8F8F6]/10 px-3.5 py-2.5 rounded-none min-w-[70px]">
                <span className="text-2xl font-mono font-black text-[#F8F8F6]">{formatNum(countdown.hours)}</span>
                <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">HRS</span>
              </div>
              <div className="flex flex-col items-center bg-[#0B0B0B] border border-[#F8F8F6]/10 px-3.5 py-2.5 rounded-none min-w-[70px]">
                <span className="text-2xl font-mono font-black text-[#F8F8F6]">{formatNum(countdown.minutes)}</span>
                <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">MINS</span>
              </div>
              <div className="flex flex-col items-center bg-[#0B0B0B] border border-[#F8F8F6]/10 px-3.5 py-2.5 rounded-none min-w-[70px]">
                <span className="text-2xl font-mono font-black text-[#C9A227] animate-pulse">{formatNum(countdown.seconds)}</span>
                <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">SECS</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm bg-[#0B0B0B] border border-white/10 p-5 rounded-none space-y-4 shadow-xl">
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=400"
                alt="Sneakers Preview"
                className="w-20 aspect-[3/4] object-cover rounded-none border border-white/5"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[7px] font-mono text-[#D93025] uppercase tracking-widest font-black bg-red-950/40 border border-red-500/20 px-2 py-0.5">Only 8 Pairs Left</span>
                  <h4 className="text-xs font-display font-black text-[#F8F8F6] uppercase tracking-widest mt-2 leading-snug">STEALTH-X TACTICAL CHUNKIES</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-display font-black text-white">₹4,899</span>
                    <span className="text-xs font-mono text-neutral-600 line-through">₹5,999</span>
                  </div>
                </div>
                <div className="text-[8px] font-mono uppercase text-neutral-500">
                  Volts color variant edition.
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleBannerAction('Sneakers')}
              className="w-full py-3 bg-[#F8F8F6] text-[#0B0B0B] text-[10px] font-display font-black tracking-[0.2em] uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-all cursor-pointer rounded-none font-bold"
            >
              SECURE CHUNKIES
            </button>
          </div>
        </div>
      </section>

      {/* 5. BRAND STORY NARRATIVE */}
      <section id="brand-mission-bar" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4">
        <span className="text-[9px] font-mono tracking-[0.35em] text-[#C9A227] uppercase font-bold">THE METROPOLIS MANIFESTO</span>
        <h3 className="text-xl sm:text-2xl font-display font-light tracking-[0.08em] text-[#0B0B0B] leading-relaxed mt-5 uppercase">
          “WE DO NOT CONSTRUCT APPAREL FOR STATIC SYMMETRY. OUR FABRICS ARE RIGID, OUR DRAPE IS INTENTIONAL, AND OUR DESIGN LANGUAGE IS BOLD.”
        </h3>
        <p className="text-[8px] text-neutral-400 font-mono tracking-[0.2em] uppercase mt-5">— METROPOLIS ARCHITECTS LABS, MH-IN</p>
      </section>

      {/* 6. LIMITED DROPS */}
      <section id="limited-collection-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 border-b border-[#0B0B0B]/10 pb-4 mb-8">
          <div>
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#C9A227] uppercase">HEAVYWEIGHT SEWING PATTERNS</span>
            <h2 className="text-2xl font-display font-black tracking-widest text-[#0B0B0B] uppercase mt-0.5">LIMITED EDITION</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {limitedCollection.map((product) => (
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

      {/* 7. CUSTOMER REPORTS & INSTAGRAM GALLERY */}
      <section id="reviews-instagram-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Testimonials Bento Grid */}
        <div className="lg:col-span-1 space-y-5">
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#C9A227] uppercase font-bold">STRUCTURE REPORTS</span>
          <h2 className="text-2xl font-display font-black tracking-widest text-[#0B0B0B] uppercase">CUSTOMER FEEDBACK</h2>
          <div className="h-[1px] w-12 bg-[#0B0B0B] mt-1"></div>
          
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none space-y-2.5 shadow-xs">
              <div className="flex gap-0.5 text-[#C9A227] text-[10px]">
                ★★★★★
              </div>
              <p className="text-[11px] text-[#0B0B0B] leading-relaxed uppercase tracking-wider">
                "Obsessed with the 240 GSM heavy drape. The collar keeps its shape perfectly after dozens of wash and spin cycles."
              </p>
              <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                — Aditya V., Pune (VERIFIED APPAREL REPORT)
              </p>
            </div>
            
            <div className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none space-y-2.5 shadow-xs">
              <div className="flex gap-0.5 text-[#C9A227] text-[10px]">
                ★★★★★
              </div>
              <p className="text-[11px] text-[#0B0B0B] leading-relaxed uppercase tracking-wider">
                "The cargos are highly water-resistant and modular. Ankle pullers let me switch from straight cut to heavy tapered instantly."
              </p>
              <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                — Sneha G., Chandigarh (VERIFIED APPAREL REPORT)
              </p>
            </div>
          </div>
        </div>

        {/* Instagram Grid */}
        <div className="lg:col-span-2 space-y-5">
          <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-400 uppercase">RADAR ACCESS</span>
          <h2 className="text-2xl font-display font-black tracking-widest text-[#0B0B0B] uppercase">#BLACKFAWN_STREETS</h2>
          <div className="h-[1px] w-12 bg-[#0B0B0B] mt-1"></div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
            {[
              "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=300",
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300",
              "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=300",
              "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=300",
              "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300",
              "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=300"
            ].map((url, idx) => (
              <div key={idx} className="aspect-square bg-neutral-900 border border-[#0B0B0B]/10 overflow-hidden relative group cursor-pointer rounded-none">
                <div className="absolute inset-0 bg-[#0B0B0B]/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10 text-[8px] font-mono tracking-widest text-white uppercase">
                  View Specs
                </div>
                <img src={url} alt="Streetwear fit" className="w-full h-full object-cover group-hover:scale-103 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VIP ACCESS NEWSLETTER */}
      <section id="vip-newsletter" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#0B0B0B] text-[#F8F8F6] border border-[#0B0B0B]/10 py-12 px-6 rounded-none shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 text-white/[0.01] font-display font-black text-9xl tracking-widest select-none pointer-events-none uppercase">
          RAW
        </div>
        <span className="text-[9px] font-mono tracking-[0.35em] text-[#C9A227] uppercase">ACCESS TO THE CORE ENGINE</span>
        <h2 className="text-2xl font-display font-black tracking-widest text-[#F8F8F6] uppercase mt-2">SUBSCRIBE FOR EARLY DROPS</h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 leading-relaxed uppercase tracking-wider">
          Receive priority discount codes and restricted lookbook releases before public container updates.
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); alert("Welcome to the METROPOLIS VIP register. Early access codes have been routed to your mailbox."); }} className="flex flex-col sm:flex-row justify-center gap-2 mt-6 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="ENTER YOUR ACTIVE EMAIL ADDRESS"
            className="bg-[#1A1A1A] border border-white/10 text-white px-4 py-2.5 text-xs font-mono focus:border-[#C9A227] outline-none uppercase tracking-widest w-full text-center rounded-none"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C9A227] text-[#0B0B0B] text-xs font-display font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap rounded-none font-bold"
          >
            JOIN CONTAINER
          </button>
        </form>
      </section>
    </div>
  );
}
