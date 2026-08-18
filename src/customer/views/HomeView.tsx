import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, BadgePercent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, FestivalCampaign } from '../../shared/types';
import ProductCard from '../components/ProductCard';
import FestivalCampaignBanner from '../components/FestivalCampaignBanner';

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
  festivalCampaigns?: FestivalCampaign[];
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600",
    title: "SIGNATURE HIGH FASHION DROPS",
    subtitle: "Architectural silhouettes, raw-edge heavy knits, and tailored minimalist luxury.",
    tag: "THE ATELIER COLLECTION",
    category: "Printed T-Shirts"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1600",
    title: "CANVAS COTTON ACCESSORIES",
    subtitle: "Precision brass hardware adjustments and dense weave canvas headwear.",
    tag: "NEW SEASON CAPS",
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
  festivalCampaigns = [],
}: HomeViewProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerAction = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dealsProducts = products.filter(p => p.variants?.some(v => v.salePrice)).slice(0, 4);
  const trendingProducts = products.filter((p) => p.isBestSeller || p.isTrending).slice(0, 4);

  return (
    <div id="home-view-container" className="space-y-16 pb-24 pt-8 overflow-x-hidden bg-[#F8F7F2] text-[#111111]">
      
      {/* 1. EDITORIAL HERO CAROUSEL */}
      <section id="hero-slider-section" className="relative h-[560px] bg-[#0B0B0B] overflow-hidden border-b border-[#E8E5DD]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/90 via-[#0B0B0B]/50 to-transparent z-10" />
            
            <img
              src={HERO_SLIDES[activeSlide].image}
              alt={HERO_SLIDES[activeSlide].title}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center items-start">
              <div className="max-w-2xl space-y-5">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#C9A227] uppercase bg-[#0B0B0B]/80 border border-[#C9A227]/40 px-3.5 py-1"
                >
                  <Sparkles size={13} className="text-[#C9A227]" /> {HERO_SLIDES[activeSlide].tag}
                </motion.span>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-tight"
                >
                  {HERO_SLIDES[activeSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-lg font-light"
                >
                  {HERO_SLIDES[activeSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => handleBannerAction(HERO_SLIDES[activeSlide].category)}
                    className="px-8 py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#C9A227] text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[#C9A227]/10"
                  >
                    DISCOVER DROP <ArrowRight size={14} className="text-[#C9A227]" />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 transition-all ${activeSlide === idx ? 'w-8 bg-[#C9A227]' : 'w-3 bg-gray-600'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. DYNAMIC FESTIVAL CAMPAIGN ENGINE BANNER */}
      <FestivalCampaignBanner
        campaigns={festivalCampaigns}
        onCtaClick={(ctaUrl) => {
          if (ctaUrl.startsWith('#/collections/')) {
            const rawColl = ctaUrl.replace('#/collections/', '').replace(/-/g, ' ');
            setCategoryFilter('');
            window.location.hash = ctaUrl;
          } else {
            window.location.hash = ctaUrl;
          }
        }}
      />

      {/* 3. TRUST / VALUES PILLARS */}
      <section id="trust-pillars-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#FFFFFF] p-8 border border-[#E8E5DD] shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F8F7F2] text-[#C9A227] border border-[#E8E5DD]">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-[#0B0B0B] uppercase tracking-wider">Priority Shipping</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">Complimentary air delivery over ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-[#E8E5DD] pl-4 lg:pl-6">
            <div className="p-3 bg-[#F8F7F2] text-[#C9A227] border border-[#E8E5DD]">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-[#0B0B0B] uppercase tracking-wider">10-Day Concierge</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">Hassle-free size exchanges</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-[#E8E5DD] pl-4 lg:pl-6">
            <div className="p-3 bg-[#F8F7F2] text-[#C9A227] border border-[#E8E5DD]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-[#0B0B0B] uppercase tracking-wider">Encrypted Checkout</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">Protected SSL transactions & COD</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-[#E8E5DD] pl-4 lg:pl-6">
            <div className="p-3 bg-[#F8F7F2] text-[#C9A227] border border-[#E8E5DD]">
              <BadgePercent size={20} />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-[#0B0B0B] uppercase tracking-wider">Authentic Heritage</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">Direct atelier craft codes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY CLUSTERS GRID */}
      <section id="featured-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-2 pb-8">
          <span className="text-[10px] font-bold tracking-widest text-[#C9A227] uppercase">THE ATELIER DEPARTMENTS</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-[#0B0B0B] uppercase">Curated Collections</h2>
          <div className="w-12 h-0.5 bg-[#C9A227]"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesList.map((cat, idx) => {
            const images: Record<string, string> = {
              "Hampers & Gifting": "/1.jpeg",
              "T-Shirts": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400",
              "Polo T-Shirts": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400",
              "Caps": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400",
              "Socks": "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=400",
              "Hand Napkins": "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=400",
              "Towels": "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=400",
              "Mugs": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400",
              "Bottles": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400"
            };
            const catImage = images[cat.name] || "/1.jpeg";
            return (
              <div
                key={cat.id || idx}
                onClick={() => handleBannerAction(cat.name)}
                className="relative h-[240px] border border-[#E8E5DD] overflow-hidden group cursor-pointer shadow-xs bg-[#FFFFFF]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent z-10 transition-all duration-300 group-hover:from-[#0B0B0B]/90" />
                <img
                  src={catImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-3 right-3 z-20 flex justify-between items-end border-b border-[#C9A227]/40 pb-2">
                  <div>
                    <h3 className="text-xs font-serif font-bold text-white tracking-wider uppercase leading-tight">{cat.name}</h3>
                    <span className="text-[9px] text-[#C9A227] font-semibold tracking-widest uppercase">Explore Drop</span>
                  </div>
                  <ArrowRight size={13} className="text-[#C9A227] group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.5 PREMIUM GIFT HAMPER HERO SECTION */}
      <section id="custom-gifts-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#0B0B0B] text-white border border-[#C9A227]/40 rounded-xl overflow-hidden shadow-2xl min-h-[360px] flex flex-col justify-center p-8 sm:p-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1600"
              alt="BLACKFAWN Custom Gift Hamper"
              className="w-full h-full object-cover object-center filter brightness-90"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C9A227] tracking-widest uppercase bg-[#0B0B0B]/90 border border-[#C9A227]/50 px-3 py-1 rounded">
              <Sparkles size={12} className="text-[#C9A227]" /> BESPOKE ATELIER GIFTING
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-wide uppercase leading-tight">
              CUSTOM GIFTS, MADE PERSONAL
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Create a thoughtful BLACKFAWN hamper with personalized pieces, handcrafted treats and memorable details.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const hamperProd = products.find((p) => p.id === 'hamp-custom-gift-hamper') || products.find((p) => p.category === 'Hampers & Gifting');
                  if (hamperProd) {
                    onProductClick(hamperProd);
                  } else {
                    setCategoryFilter('Hampers & Gifting');
                    setTab('shop');
                  }
                }}
                className="px-7 py-3.5 bg-[#C9A227] hover:bg-yellow-600 text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
              >
                BUILD YOUR HAMPER <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED ATELIER SELECTION */}
      <section id="deals-of-the-day" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] p-8 border border-[#E8E5DD] shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E8E5DD] pb-5 mb-8">
            <div>
              <span className="text-[10px] font-semibold text-[#C9A227] tracking-widest uppercase">LIMITED AVAILABILITY</span>
              <h2 className="text-2xl font-serif font-bold text-[#0B0B0B] uppercase tracking-wide">Featured Atelier Selection</h2>
            </div>

            <button
              onClick={() => handleBannerAction('')}
              className="text-xs font-semibold tracking-widest text-[#0B0B0B] hover:text-[#C9A227] uppercase flex items-center gap-1.5 cursor-pointer"
            >
              View Full Collection <ArrowRight size={13} className="text-[#C9A227]" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 5. TRENDING CATALOG */}
      <section id="trending-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[#E8E5DD] pb-5 mb-8">
          <div>
            <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase">HIGH FASHION DEMAND</span>
            <h2 className="text-2xl font-serif font-bold text-[#0B0B0B] uppercase tracking-wide mt-1">Metropolitan Essentials</h2>
          </div>
          <button
            onClick={() => handleBannerAction('')}
            className="text-xs font-semibold tracking-widest text-[#666666] hover:text-[#0B0B0B] uppercase flex items-center gap-1 cursor-pointer"
          >
            Explore Catalog <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="text-center bg-[#0B0B0B] text-white border border-[#C9A227]/30 py-14 px-8 shadow-2xl relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-[#C9A227] uppercase">PRIVATE ATELIER INVITATION</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide uppercase mt-2 text-white">SUBSCRIBE TO EXCLUSIVE DROPS</h2>
          <p className="text-xs text-gray-300 max-w-md mx-auto mt-2 leading-relaxed font-light">
            Receive private release access, seasonal lookbook previews, and priority restock notifications directly from our Pune design house.
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("You are now registered for BLACKFAWN private drop invitations."); }} className="flex flex-col sm:flex-row justify-center gap-3 mt-8 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="bg-[#1A1A1A] border border-[#2A2A2A] text-white px-5 py-3 text-xs focus:border-[#C9A227] outline-none w-full text-center tracking-wider"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B0B0B] text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap"
            >
              REGISTER
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

