import React, { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, RefreshCw, AlertCircle, ShoppingBag, Send, Tag, ChevronRight, HelpCircle, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailViewProps {
  productId: string;
  products: Product[];
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  setTab: (tab: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function ProductDetailView({
  productId,
  products,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  setTab,
  setSelectedProductId,
}: ProductDetailViewProps) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center pt-[140px]">
        <p className="text-sm font-display font-bold uppercase tracking-widest text-white">Apparel Drop Not Found</p>
        <button onClick={() => setTab('shop')} className="mt-4 px-6 py-2.5 bg-white text-black text-[10px] font-display font-bold tracking-widest uppercase">
          Return to Catalog
        </button>
      </div>
    );
  }

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryDays, setDeliveryDays] = useState<string>('');

  // Interactive Size & Fit Advisor State
  const [advisorHeight, setAdvisorHeight] = useState('5ft 9in');
  const [advisorWeight, setAdvisorWeight] = useState('72 kg');
  const [advisorResult, setAdvisorResult] = useState('');

  const calculateAdvisorSize = () => {
    // Basic heuristics for suggestion
    const weightVal = parseInt(advisorWeight);
    if (isNaN(weightVal)) {
      setAdvisorResult('Please enter a valid weight');
      return;
    }
    if (weightVal < 60) {
      setAdvisorResult('We suggest Size S for a classic oversized drop.');
    } else if (weightVal < 75) {
      setAdvisorResult('We suggest Size M for a solid heavy drape.');
    } else if (weightVal < 90) {
      setAdvisorResult('We suggest Size L for an aggressive street shoulder line.');
    } else {
      setAdvisorResult('We suggest Size XL or XXL for full oversized armor.');
    }
  };

  useEffect(() => {
    calculateAdvisorSize();
  }, [advisorHeight, advisorWeight]);

  // Fetch product reviews on mount
  useEffect(() => {
    fetch(`/api/reviews/${product.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  }, [product.id]);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setDeliveryDays('Please specify a valid 6-digit Indian PIN.');
      return;
    }
    const check = pincode[0];
    if (['1', '2', '3', '4'].includes(check)) {
      setDeliveryDays(`Guaranteed Free Express Delivery by ${new Date(Date.now() + product.deliveryDaysEst * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })} via Bluedart Air.`);
    } else {
      setDeliveryDays(`Standard Free Shipping. Arrival estimated by ${new Date(Date.now() + (product.deliveryDaysEst + 2) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })} via Delhivery.`);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newReviewAuthor.trim()) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: newReviewAuthor,
          userEmail: 'reviewer@blackfawn.in',
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await response.json();
      setReviews((prev) => [data.review, ...prev]);
      setNewComment('');
      setNewReviewAuthor('');
    } catch (err) {
      console.error(err);
    }
  };

  const suggestedBundleProduct = products.find((p) => p.id !== product.id && (product.category === 'Accessories' ? p.category === 'Oversized' : p.category === 'Accessories' || p.category === 'T-Shirts'));

  const handleBundleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    if (suggestedBundleProduct) {
      onAddToCart(suggestedBundleProduct, suggestedBundleProduct.sizes[0], suggestedBundleProduct.colors[0].name);
    }
    alert("Metropolis Bundle added! Both coordinating silhouettes are loaded into your bag with a 10% bundle voucher savings applied.");
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[140px] font-sans bg-[#F8F8F6] text-[#0B0B0B]">
      
      {/* Product JSON-LD Schema for Google Rich snippets SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.images,
          "description": product.description,
          "sku": product.id,
          "brand": {
            "@type": "Brand",
            "name": "BLACKFAWN"
          },
          "offers": {
            "@type": "Offer",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "priceCurrency": "INR",
            "price": product.discountPrice || product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        })}
      </script>

      {/* Dynamic breadcrumb */}
      <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase mb-10 border-b border-[#0B0B0B]/10 pb-4">
        <button onClick={() => { setTab('home'); setSelectedProductId(null); }} className="hover:text-black cursor-pointer transition-colors">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => { setTab('shop'); setSelectedProductId(null); }} className="hover:text-black cursor-pointer transition-colors">Archive</button>
        <ChevronRight size={10} />
        <span className="text-[#0B0B0B] font-bold">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Image Zoom Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-[3/4] bg-neutral-100 border border-[#0B0B0B]/10 rounded-none overflow-hidden group shadow-xs">
            <img
              src={product.images[activeImgIdx]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover object-top hover:scale-[1.03] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-700 text-white font-display font-black text-[9px] tracking-widest uppercase px-3 py-1">
                -{discountPercent}% OFF DROP
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`aspect-[3/4] bg-neutral-100 border rounded-none overflow-hidden relative transition-all cursor-pointer ${
                  activeImgIdx === idx ? 'border-[#C9A227] scale-[1.02]' : 'border-[#0B0B0B]/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Specs, Fits, and Checkout Actions */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-400 uppercase">
                {product.category} DEPT
              </span>
              <span className="text-[#0B0B0B]/40 text-xs">•</span>
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#C9A227] font-bold uppercase">
                {product.fit} GEOMETRY
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-widest text-[#0B0B0B] uppercase leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#C9A227] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < Math.floor(product.rating) ? 'fill-[#C9A227] text-[#C9A227]' : 'text-neutral-300'}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                {product.rating} ★ <span className="text-neutral-400">({product.reviewCount} customer reports)</span>
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pt-2">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-display font-black text-[#0B0B0B]">₹{product.discountPrice}</span>
                  <span className="text-base font-mono text-neutral-400 line-through">₹{product.price}</span>
                  <span className="text-[10px] font-mono font-black text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-none">
                    SAVE ₹{product.price - product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-display font-black text-[#0B0B0B]">₹{product.price}</span>
              )}
            </div>
            <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              Price inclusive of all taxes, corporate GSTIN invoices supported in checkout.
            </p>

            {/* Descriptive story block */}
            <p className="text-xs text-neutral-600 leading-relaxed uppercase tracking-wider">
              {product.description}
            </p>

            {/* Promo coupon guides */}
            <div className="bg-white border border-[#0B0B0B]/10 p-4 rounded-none space-y-2 shadow-xs">
              <span className="text-[8px] font-mono tracking-widest text-[#C9A227] uppercase flex items-center gap-1 font-bold">
                <Tag size={12} /> SHADOW ACTIVE PROMO CODES
              </span>
              <ul className="text-[10px] font-mono text-neutral-500 space-y-1.5 uppercase tracking-wider">
                <li>• Apply <span className="text-[#0B0B0B] font-bold">LAUNCHVIP</span> inside bag for 15% drop discount.</li>
                <li>• Apply <span className="text-[#0B0B0B] font-bold">STREETVIBES500</span> above ₹3,999 to save ₹500.</li>
              </ul>
            </div>

            {/* Color Swatch Selectors */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">Active Color: <span className="text-[#0B0B0B] font-bold">{selectedColor}</span></label>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-none border flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor === c.name ? 'border-[#C9A227] scale-110 shadow-sm' : 'border-[#0B0B0B]/10 opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    <span className="w-5 h-5 rounded-none" style={{ backgroundColor: c.hex }}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Swatch Selectors */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                <label>Active Size: <span className="text-[#0B0B0B] font-bold">{selectedSize}</span></label>
                <a href="#size-blueprint" className="underline hover:text-black font-bold">SIZE CHART BLUEPRINT</a>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4.5 py-2 border text-[11px] font-mono tracking-widest uppercase transition-all rounded-none cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#0B0B0B] text-[#F8F8F6] border-[#0B0B0B] font-bold'
                        : 'bg-white border-[#0B0B0B]/10 text-neutral-500 hover:text-black hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Fit Advisor widget */}
            <div className="bg-white border border-[#0B0B0B]/10 p-4 rounded-none space-y-3.5 shadow-xs">
              <span className="text-[8px] font-mono tracking-widest text-[#C9A227] uppercase flex items-center gap-1 font-bold">
                <Sparkles size={12} /> BLACKFAWN AUTOMATED FIT ADVISOR
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-neutral-400 uppercase block">User Height</span>
                  <select 
                    value={advisorHeight}
                    onChange={(e) => setAdvisorHeight(e.target.value)}
                    className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] text-[10px] font-mono p-2 focus:border-[#C9A227] outline-none uppercase rounded-none"
                  >
                    <option value="5ft 6in">5ft 6in (168 cm)</option>
                    <option value="5ft 8in">5ft 8in (173 cm)</option>
                    <option value="5ft 9in">5ft 9in (175 cm)</option>
                    <option value="6ft 0in">6ft 0in (183 cm)</option>
                    <option value="6ft 2in">6ft 2in (188 cm)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-neutral-400 uppercase block">User Weight</span>
                  <input 
                    type="text" 
                    value={advisorWeight}
                    onChange={(e) => setAdvisorWeight(e.target.value)}
                    className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] text-[10px] font-mono p-2 focus:border-[#C9A227] outline-none uppercase text-center rounded-none"
                  />
                </div>
              </div>
              <div className="p-3 bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[9px] font-mono uppercase tracking-wider text-neutral-600 rounded-none">
                {advisorResult}
              </div>
            </div>

            {/* Indian Pincode Delivery Estimator - Zara UX */}
            <div className="bg-white border border-[#0B0B0B]/10 p-4 rounded-none space-y-3 shadow-xs">
              <span className="text-[8px] font-mono tracking-widest text-[#0B0B0B] uppercase flex items-center gap-1 font-bold">
                <Truck size={12} /> DELHI-MUMBAI DIRECT SHUTTLE ESTIMATOR
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Indian Pin Code (e.g. 411001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="bg-[#111] border border-white/10 text-white px-3 py-2 text-xs font-mono focus:border-white/20 outline-none w-full uppercase tracking-widest rounded-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 border border-white/10 text-white text-[10px] font-display font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap rounded-xs"
                >
                  VERIFY
                </button>
              </form>
              {deliveryDays && (
                <p className="text-[10px] text-neutral-400 mt-2 font-mono flex items-center gap-1.5 animate-fade-in uppercase tracking-wider">
                  <Truck size={12} className="text-emerald-400" /> {deliveryDays}
                </p>
              )}
            </div>

            {/* Fabric blueprints specs */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">CRAFT & SEWING BLUEPRINTS</h4>
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-neutral-300 uppercase">
                <div className="p-3 bg-neutral-950 border border-white/5 rounded-xs space-y-1">
                  <span className="text-[8px] text-neutral-500 tracking-widest">FABRIC MASS WEIGHT</span>
                  <p className="text-white font-bold">{product.material}</p>
                </div>
                <div className="p-3 bg-neutral-950 border border-white/5 rounded-xs space-y-1">
                  <span className="text-[8px] text-neutral-500 tracking-widest">PATTERN METHOD</span>
                  <p className="text-white font-bold">{product.pattern}</p>
                </div>
                <div className="p-3 bg-neutral-950 border border-white/5 rounded-xs space-y-1">
                  <span className="text-[8px] text-neutral-500 tracking-widest">COD ELIGIBILITY</span>
                  <p className="text-white font-bold">{product.codAvailable ? "ELIGIBLE" : "PREPAY ONLY"}</p>
                </div>
                <div className="p-3 bg-neutral-950 border border-white/5 rounded-xs space-y-1">
                  <span className="text-[8px] text-neutral-500 tracking-widest">SHRINKAGE TOLERANCE</span>
                  <p className="text-white font-bold">PRE-SHRUNK THREE-CYCLE</p>
                </div>
              </div>
            </div>

            {/* Size Blueprint Chart Table */}
            <div id="size-blueprint" className="border-t border-white/5 pt-4">
              <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mb-3">SIZE BLUEPRINT CHART (INCHES)</h4>
              <div className="overflow-x-auto border border-white/5 rounded-xs">
                <table className="w-full text-left text-[11px] font-mono text-neutral-400">
                  <thead className="bg-neutral-950 text-white uppercase text-[9px] tracking-wider">
                    <tr>
                      <th className="p-2.5">SIZE</th>
                      <th className="p-2.5">CHEST WIDTH</th>
                      <th className="p-2.5">LENGTH</th>
                      <th className="p-2.5">SHOULDER WIDTH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-black/40">
                    {product.sizeChart.map((row) => (
                      <tr key={row.size} className={selectedSize === row.size ? 'bg-white/5 text-white font-bold' : ''}>
                        <td className="p-2.5">{row.size}</td>
                        <td className="p-2.5">{row.chest}"</td>
                        <td className="p-2.5">{row.length}"</td>
                        <td className="p-2.5">{row.shoulder > 0 ? `${row.shoulder}"` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BUNDLE PACK BLASTER BLOCK */}
      {suggestedBundleProduct && (
        <section id="bundle-deals" className="mt-20 bg-[#080808] border border-white/10 p-6 rounded-xs shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-[10rem] font-display font-black text-white/[0.01] select-none pointer-events-none uppercase">
            BUNDLE
          </div>
          <div className="border-b border-white/5 pb-4 mb-4 flex items-center justify-between relative z-10">
            <h3 className="text-xs font-display font-black tracking-widest text-white uppercase">FREQUENTLY BOUGHT TOGETHER</h3>
            <span className="text-[8px] font-mono bg-emerald-500 text-black font-black px-2 py-0.5 rounded-sm">10% BUNDLE VOUCHER ACTIVE</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
            <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-wider">
              <div className="flex items-center gap-2.5">
                <img src={product.images[0]} alt="" className="w-14 aspect-[3/4] object-cover rounded-xs border border-white/5" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-white font-bold line-clamp-1">{product.name}</h4>
                  <p className="text-neutral-500">₹{product.discountPrice || product.price}</p>
                </div>
              </div>
              <span className="text-base text-neutral-600 font-bold shrink-0">+</span>
              <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-85" onClick={() => setSelectedProductId(suggestedBundleProduct.id)}>
                <img src={suggestedBundleProduct.images[0]} alt="" className="w-14 aspect-[3/4] object-cover rounded-xs border border-white/5" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-white font-bold line-clamp-1">{suggestedBundleProduct.name}</h4>
                  <p className="text-neutral-500">₹{suggestedBundleProduct.discountPrice || suggestedBundleProduct.price}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBundleAddToCart}
              className="py-3 px-6 bg-white text-black text-xs font-display font-black tracking-widest uppercase hover:bg-neutral-200 transition-all cursor-pointer whitespace-nowrap rounded-xs"
            >
              SECURE COORDINATING BUNDLE (₹{(product.discountPrice || product.price) + (suggestedBundleProduct.discountPrice || suggestedBundleProduct.price)})
            </button>
          </div>
        </section>
      )}

      {/* IMMERSIVE REVIEWS REPORTS SYSTEM */}
      <section id="reviews-section" className="mt-24 border-t border-white/5 pt-12 max-w-4xl">
        <h2 className="text-xl font-display font-black tracking-widest text-white uppercase">CUSTOMER REPORTS</h2>
        <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-1">Verified Streetwear Wearer Reports</p>

        {/* New Review form */}
        <div className="mt-8 p-6 bg-[#080808] border border-white/5 rounded-xs space-y-4 shadow-xl">
          <h4 className="text-xs font-display font-black tracking-widest text-white uppercase">FILE AN APPAREL REPORT</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="YOUR NAME (E.G. HARSHIT RAO)"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="bg-[#111] border border-white/10 text-white px-4 py-3 text-xs font-mono focus:border-white/20 outline-none w-full uppercase tracking-widest rounded-xs"
              />
              
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-neutral-400 uppercase shrink-0">STYLING SCORE:</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="bg-[#111] border border-white/10 text-white text-xs font-mono p-2.5 focus:border-white/20 outline-none w-full uppercase tracking-widest rounded-xs"
                >
                  <option value={5}>5 ★ - Ultimate Silhouette</option>
                  <option value={4}>4 ★ - Strong Drop</option>
                  <option value={3}>3 ★ - Neutral Weight</option>
                  <option value={2}>2 ★ - Disrupted Fit</option>
                  <option value={1}>1 ★ - Off Outline</option>
                </select>
              </div>
            </div>

            <textarea
              required
              rows={3}
              placeholder="YOUR DETAILED OBSERVATION ON COLLAR RIGIDITY, GSM FABRIC MASS, COLOR ENZYME WASHES..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-[#111] border border-white/10 text-white px-4 py-3 text-xs font-mono focus:border-white/20 outline-none w-full uppercase tracking-widest rounded-xs"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-white text-black text-xs font-display font-black tracking-widest uppercase hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 rounded-xs"
            >
              POST REPORT <Send size={11} />
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="mt-12 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">No customer reports loaded. Be the first to report!</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-5 border border-white/5 bg-[#070707] rounded-xs space-y-3.5 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-display font-black text-white uppercase tracking-wider">{r.userName}</span>
                    <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">{r.date} • VERIFIED APPAREL ACQUISITION</p>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-bold">{"★".repeat(r.rating)}</span>
                </div>
                
                <p className="text-xs text-neutral-300 leading-relaxed uppercase tracking-wider">{r.comment}</p>

                {r.reply && (
                  <div className="mt-4 p-4 bg-black border-l border-white text-[11px] text-neutral-400 font-mono uppercase tracking-wider">
                    <p className="text-white font-black text-[9px] tracking-widest mb-1">BLACKFAWN ENGINEER COMMENT:</p>
                    {r.reply}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
