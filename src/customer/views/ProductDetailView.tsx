import React, { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, RefreshCw, AlertCircle, ShoppingBag, Send, Tag, ChevronRight, HelpCircle, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Product, Review, ProductVariant } from '../../shared/types';

interface ProductDetailViewProps {
  productId: string;
  products: Product[];
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  setTab: (tab: string) => void;
  setSelectedProductId: (id: string | null) => void;
  setCategoryFilter: (cat: string) => void;
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
  setCategoryFilter,
}: ProductDetailViewProps) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center pt-[140px]">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-700">Apparel Drop Not Found</p>
        <button onClick={() => setTab('shop')} className="mt-4 px-6 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase rounded-lg hover:bg-black">
          Return to Catalog
        </button>
      </div>
    );
  }

  // Derive unique sizes and colors from variants
  const sizes = product.variants ? Array.from(new Set(product.variants.map(v => v.size))) : ['S', 'M', 'L'];
  const colors = product.variants ? Array.from(new Set(product.variants.map(v => v.color))).map(cName => ({
    name: cName,
    hex: cName.toLowerCase().includes('black') ? '#1A1A1A' : cName.toLowerCase().includes('white') ? '#F3F4F6' : cName.toLowerCase().includes('olive') ? '#4A5D4E' : '#8B8580'
  })) : [];

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
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
    const weightVal = parseInt(advisorWeight);
    if (isNaN(weightVal)) {
      setAdvisorResult('Please enter a valid weight');
      return;
    }
    if (weightVal < 60) {
      setAdvisorResult('We suggest Size S for a classic relaxed drop.');
    } else if (weightVal < 75) {
      setAdvisorResult('We suggest Size M for a solid heavy drape.');
    } else if (weightVal < 90) {
      setAdvisorResult('We suggest Size L for an aggressive street shoulder line.');
    } else {
      setAdvisorResult('We suggest Size XL or XXL for full comfortable fit.');
    }
  };

  useEffect(() => {
    calculateAdvisorSize();
  }, [advisorHeight, advisorWeight]);

  // Fetch reviews
  useEffect(() => {
    fetch(`/api/reviews/${product.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  }, [product.id]);

  // Find active variant pricing and stock details
  const activeVariant = product.variants?.find((v) => v.size === selectedSize && v.color === selectedColor) as ProductVariant | undefined;
  const price = activeVariant?.price ?? product.price ?? 999;
  const discountPrice = activeVariant?.salePrice ?? product.discountPrice;
  const stock = activeVariant?.stock ?? product.variants?.[0]?.stock ?? 10;
  const sku = activeVariant?.sku ?? product.baseSku ?? 'MAIN-SKU';

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setDeliveryDays('Please specify a valid 6-digit Indian PIN.');
      return;
    }
    const check = pincode[0];
    if (['1', '2', '3', '4'].includes(check)) {
      setDeliveryDays(`Guaranteed Free Express Delivery in ${product.deliveryDaysEst} days via Bluedart Air.`);
    } else {
      setDeliveryDays(`Standard Free Shipping. Arrival estimated in ${product.deliveryDaysEst + 2} days via Delhivery.`);
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
          userEmail: 'customer@blackfawn.in',
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await response.json();
      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setNewComment('');
        setNewReviewAuthor('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const discountPercent = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const images = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"];

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[120px] bg-[#f1f5f9] text-[#1e293b]">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-8">
        <button onClick={() => setTab('home')} className="hover:text-black">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => { setCategoryFilter(product.category); setTab('shop'); }} className="hover:text-black">{product.category}</button>
        <ChevronRight size={10} />
        <span className="text-gray-800 font-bold truncate max-w-[120px] sm:max-w-none">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-gray-200 rounded-xl shadow-xs">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={images[activeImgIdx]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Gallery Indicator Thumbnails */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`w-18 aspect-[3/4] rounded-lg border transition-all relative shrink-0 overflow-hidden ${
                  activeImgIdx === idx ? 'border-[#f97316] scale-102 shadow-xs' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Checkout Actions */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8">
          <div className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#f97316] tracking-wider uppercase bg-orange-50 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                {product.fit} FIT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight capitalize">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-700 font-bold">
                {product.rating} ★ <span className="text-gray-400 font-medium">({product.reviewCount} reviews)</span>
              </span>
            </div>

            {/* SKU and Stock tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold bg-gray-150 text-gray-700 px-2.5 py-0.5 rounded">SKU: {sku}</span>
              {stock <= 5 ? (
                <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2.5 py-0.5 rounded animate-pulse">Low Stock: Only {stock} left!</span>
              ) : (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded">In Stock: {stock} units</span>
              )}
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pt-2">
              {discountPrice ? (
                <>
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">₹{discountPrice}</span>
                  <span className="text-sm text-gray-400 line-through">₹{price}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded">
                    SAVE ₹{price - discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">₹{price}</span>
              )}
            </div>

            {/* HTML Description entered by Admin (WYSIWYG) */}
            <div 
              className="text-xs text-gray-600 leading-relaxed font-medium space-y-2 border-t border-gray-100 pt-4"
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />

            {/* Promo Codes */}
            <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-lg space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-[#f97316] uppercase flex items-center gap-1">
                <Tag size={12} /> ACTIVE COUPONS
              </span>
              <ul className="text-xs text-gray-600 space-y-1.5 font-medium">
                <li>• Use <span className="text-gray-900 font-bold">LAUNCHVIP</span> for flat 15% discount.</li>
                <li>• Use <span className="text-gray-900 font-bold">STREET500</span> above ₹3,999 to save ₹500.</li>
              </ul>
            </div>

            {/* Color Swatches */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Color: <span className="text-gray-900 font-extrabold">{selectedColor}</span></label>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor === c.name ? 'border-[#f97316] scale-110 shadow-xs ring-2 ring-[#f97316]/30' : 'border-gray-300 opacity-80 hover:opacity-100'
                      }`}
                      title={c.name}
                    >
                      <span className="w-5 h-5 rounded-full" style={{ backgroundColor: c.hex }}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Swatches */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <label>Select Size: <span className="text-gray-900 font-extrabold">{selectedSize}</span></label>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#f97316] text-white border-[#f97316] shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#f97316] hover:text-[#f97316]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Advisor Tool */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-[#f97316]" /> Interactive Size Advisor
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Your Height</label>
                  <input
                    type="text"
                    value={advisorHeight}
                    onChange={(e) => setAdvisorHeight(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Your Weight</label>
                  <input
                    type="text"
                    value={advisorWeight}
                    onChange={(e) => setAdvisorWeight(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1 text-gray-700"
                  />
                </div>
              </div>
              {advisorResult && (
                <p className="text-[10.5px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded border border-emerald-100 flex items-center gap-1">
                  <CheckCircle size={12} /> {advisorResult}
                </p>
              )}
            </div>

            {/* Check Pincode */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery Checker</span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-Digit PIN Code"
                  className="bg-white border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#f97316] outline-none rounded-lg flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Verify PIN
                </button>
              </form>
              {deliveryDays && (
                <p className="text-[11px] font-bold text-[#f97316] flex items-center gap-1"><Truck size={12} /> {deliveryDays}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="flex-1 py-4 bg-[#FFFFFF] border border-[#0B0B0B] text-[#0B0B0B] hover:text-[#C9A227] hover:border-[#C9A227] text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
              disabled={stock === 0}
            >
              <ShoppingBag size={14} className="text-[#C9A227]" /> Add to Bag
            </button>
            <button
              onClick={() => onBuyNow(product, selectedSize, selectedColor)}
              className="flex-1 py-4 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              disabled={stock === 0}
            >
              Express Buy <ArrowRight size={14} className="text-[#C9A227]" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <section className="mt-16 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-6">Customer Reviews</h2>
        
        {/* Write a review */}
        <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl mb-10 pb-10 border-b border-gray-150">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Submit apparel rating report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your Name</label>
              <input
                type="text"
                required
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Star Rating</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Comment</label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
          >
            Submit Review <Send size={11} />
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 font-medium">No reviews posted yet. Be the first to write one!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-250'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                  {rev.verified && <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 font-bold rounded">VERIFIED FIT REPORT</span>}
                  <span className="text-[10px] text-gray-400 font-medium ml-auto">{rev.date}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{rev.comment}</p>
                {rev.reply && (
                  <div className="bg-slate-50 border-l-2 border-[#f97316] p-3 rounded text-xs ml-4">
                    <p className="font-bold text-gray-800 uppercase tracking-wide">BLACKFAWN STYLIST REPLY:</p>
                    <p className="text-gray-600 mt-1 font-medium">{rev.reply}</p>
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
