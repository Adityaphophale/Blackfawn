import React, { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, RefreshCw, AlertCircle, ShoppingBag, Send, Tag, ChevronRight, HelpCircle, ArrowRight, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { Product, Review, ProductVariant } from '../../shared/types';
import GiftHamperCustomizer, { CustomizationState, DEFAULT_CUSTOMIZATION } from '../components/GiftHamperCustomizer';
import { CENTRALIZED_HAMPER_ITEMS, BLACKFAWN_GIFT_HAMPER_CONFIG } from '../../shared/giftHamperConfig';

interface ProductDetailViewProps {
  productId: string;
  products: Product[];
  onAddToCart: (product: Product, size: string, color: string, customization?: Record<string, string>) => void;
  onBuyNow: (product: Product, size: string, color: string, customization?: Record<string, string>) => void;
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
        <p className="text-sm font-bold uppercase tracking-widest text-[#111111]">Product Not Found</p>
        <button onClick={() => setTab('shop')} className="mt-4 px-6 py-2.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase rounded-lg hover:text-[#C9A227]">
          Return to Catalog
        </button>
      </div>
    );
  }

  const isHamper = product.category === 'Hampers & Gifting';
  const hamperItemsList = product.hamperItems && product.hamperItems.length > 0 ? product.hamperItems : CENTRALIZED_HAMPER_ITEMS;

  // Derive unique sizes and colors from variants
  const sizes = product.variants ? Array.from(new Set(product.variants.map(v => v.size))) : ['S', 'M', 'L'];
  const colors = product.variants ? Array.from(new Set(product.variants.map(v => v.color))).map(cName => ({
    name: cName,
    hex: cName.toLowerCase().includes('black') ? '#1A1A1A' : cName.toLowerCase().includes('white') ? '#F3F4F6' : cName.toLowerCase().includes('gold') ? '#C9A227' : '#8B8580'
  })) : [];

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'Standard Box');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || 'Matte Black & Gold');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryDays, setDeliveryDays] = useState<string>('');

  // Interactive Size & Fit Advisor State for apparel
  const [advisorHeight, setAdvisorHeight] = useState('5ft 9in');
  const [advisorWeight, setAdvisorWeight] = useState('72 kg');
  const [advisorResult, setAdvisorResult] = useState('');

  // Customization state for Hamper
  const [hamperCustomization, setHamperCustomization] = useState<CustomizationState>(DEFAULT_CUSTOMIZATION);

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
  const price = activeVariant?.salePrice ?? product.discountPrice ?? activeVariant?.price ?? product.price ?? 3999;
  const originalCombinedValue = isHamper ? 8999 : (activeVariant?.price ?? product.price ?? 8999);
  const savingsAmount = Math.max(originalCombinedValue - price, 0);
  const savingsPercent = Math.round((savingsAmount / originalCombinedValue) * 100);
  const stock = activeVariant?.stock ?? product.variants?.[0]?.stock ?? 50;
  const sku = activeVariant?.sku ?? product.baseSku ?? 'HAMP-CUSTOM-01';

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setDeliveryDays('Please specify a valid 6-digit Indian PIN Code.');
      return;
    }
    const check = pincode[0];
    if (['1', '2', '3', '4'].includes(check)) {
      setDeliveryDays(`Guaranteed Free Priority Dispatch in ${product.deliveryDaysEst} days via Bluedart Air.`);
    } else {
      setDeliveryDays(`Standard Free Delivery. Arrival estimated in ${product.deliveryDaysEst + 2} days via Delhivery.`);
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

  const handleHamperAddToCart = (customData: CustomizationState) => {
    const custMap: Record<string, string> = {
      'T-Shirt Size': customData.tshirtSize,
      'T-Shirt Text': customData.tshirtText || 'Default',
      'T-Shirt Color': customData.tshirtColor,
      'Mug Text': customData.mugText || 'Default',
      'Water Bottle Name': customData.bottleName || 'Default',
      'Wish Card Message': customData.wishCardMessage || 'Best Wishes',
      'Name Tag Text': customData.nameTagText || 'Default',
      'Keychain Text': customData.keychainText || 'Default',
      'Fridge Magnet Text': customData.magnetText || 'Default',
      'Pillow Text': customData.pillowText || 'Default',
      'Towel Text': customData.towelText || 'Default',
      'Hand Napkin Text': customData.napkinText || 'Default',
      'Cap Text': customData.capText || 'Default',
    };
    onAddToCart(product, customData.tshirtSize || selectedSize, selectedColor, custMap);
  };

  const handleHamperBuyNow = (customData: CustomizationState) => {
    const custMap: Record<string, string> = {
      'T-Shirt Size': customData.tshirtSize,
      'T-Shirt Text': customData.tshirtText || 'Default',
      'T-Shirt Color': customData.tshirtColor,
      'Mug Text': customData.mugText || 'Default',
      'Water Bottle Name': customData.bottleName || 'Default',
      'Wish Card Message': customData.wishCardMessage || 'Best Wishes',
      'Name Tag Text': customData.nameTagText || 'Default',
      'Keychain Text': customData.keychainText || 'Default',
      'Fridge Magnet Text': customData.magnetText || 'Default',
      'Pillow Text': customData.pillowText || 'Default',
      'Towel Text': customData.towelText || 'Default',
      'Hand Napkin Text': customData.napkinText || 'Default',
      'Cap Text': customData.capText || 'Default',
    };
    onBuyNow(product, customData.tshirtSize || selectedSize, selectedColor, custMap);
  };

  const images = product.images && product.images.length > 0 ? product.images : BLACKFAWN_GIFT_HAMPER_CONFIG.galleryImages;

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[120px] bg-[#F8F7F2] text-[#111111]">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#666666] uppercase tracking-wider mb-8">
        <button onClick={() => setTab('home')} className="hover:text-[#0B0B0B]">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => { setCategoryFilter(product.category); setTab('shop'); }} className="hover:text-[#0B0B0B]">{product.category}</button>
        <ChevronRight size={10} />
        <span className="text-[#0B0B0B] font-bold truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden bg-white border border-[#E8E5DD] rounded-xl shadow-xs">
            {savingsPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227]/40 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded shadow-md flex items-center gap-1">
                <Sparkles size={11} /> {savingsPercent}% SAVINGS
              </span>
            )}
            <img
              src={images[activeImgIdx]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Gallery Indicator Thumbnails */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`w-20 aspect-[4/3] rounded-lg border transition-all relative shrink-0 overflow-hidden cursor-pointer ${
                  activeImgIdx === idx ? 'border-[#C9A227] ring-2 ring-[#C9A227]/40 scale-102 shadow-xs' : 'border-[#E8E5DD] opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Pricing */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8">
          <div className="space-y-6 bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E5DD] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase bg-[#0B0B0B] px-3 py-1 rounded">
                {product.category}
              </span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-[10px] font-bold text-[#666666] tracking-widest uppercase">
                {product.collection || 'PREMIUM GIFT HAMPERS'}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B0B0B] leading-tight uppercase">
                {product.name}
              </h1>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-[#E8E5DD] text-gray-400 hover:text-[#0B0B0B]'
                }`}
                title="Add to Wishlist"
              >
                <Heart size={18} className={isWishlisted ? 'fill-red-600' : ''} />
              </button>
            </div>

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
              <span className="text-xs text-[#0B0B0B] font-bold">
                {product.rating} ★ <span className="text-[#666666] font-medium">({product.reviewCount} customer reviews)</span>
              </span>
            </div>

            {/* Availability & SKU */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold bg-[#F8F7F2] text-[#0B0B0B] border border-[#E8E5DD] px-2.5 py-0.5 rounded font-mono">SKU: {sku}</span>
              {stock > 0 ? (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle size={11} /> Available for Immediate Dispatch ({stock} units)
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded">Sold Out</span>
              )}
            </div>

            {/* Editorial Hamper Price Block */}
            <div className="bg-[#F8F7F2] border border-[#E8E5DD] p-4 rounded-lg space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif font-extrabold text-[#0B0B0B]">₹{price}</span>
                {originalCombinedValue > price && (
                  <span className="text-sm text-gray-400 line-through">₹{originalCombinedValue}</span>
                )}
                {savingsAmount > 0 && (
                  <span className="text-xs font-bold text-[#0B0B0B] bg-[#C9A227] px-2.5 py-0.5 rounded uppercase tracking-wider">
                    SAVE ₹{savingsAmount} ({savingsPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-[#666666] font-medium">
                Combined Original Value: <span className="font-bold text-[#0B0B0B]">₹{originalCombinedValue}</span>. Includes luxury velvet box, 14 customized items, free gift card & express delivery.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs text-[#666666] leading-relaxed font-medium">
              {product.shortDescription}
            </p>

            {/* Description HTML */}
            <div 
              className="text-xs text-[#666666] leading-relaxed font-medium space-y-2 border-t border-[#E8E5DD] pt-4"
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />

            {/* Check Pincode Delivery */}
            <div className="space-y-2 border-t border-[#E8E5DD] pt-4">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Estimate Delivery Date</span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-Digit PIN Code"
                  className="bg-[#F8F7F2] border border-[#E8E5DD] px-3.5 py-2 text-xs focus:border-[#C9A227] outline-none rounded flex-1 text-[#0B0B0B] font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-bold rounded uppercase cursor-pointer transition-all"
                >
                  Verify PIN
                </button>
              </form>
              {deliveryDays && (
                <p className="text-[11px] font-bold text-[#C9A227] flex items-center gap-1.5"><Truck size={13} /> {deliveryDays}</p>
              )}
            </div>

            {/* Non-Hamper Standard Add to Cart Controls */}
            {!isHamper && (
              <div className="flex gap-4 pt-4">
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
            )}
          </div>
        </div>
      </div>

      {/* HAMPER CONTENT SECTION: "What's Inside Your BLACKFAWN Hamper" */}
      {isHamper && (
        <section className="mt-16 bg-[#FFFFFF] p-6 sm:p-10 border border-[#E8E5DD] rounded-xl shadow-xs space-y-8">
          <div className="border-b border-[#E8E5DD] pb-4">
            <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#C9A227]" /> CURATED ATELIER BOX CONTENTS
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B0B0B] uppercase tracking-wide mt-1">
              What's Inside Your BLACKFAWN Hamper
            </h2>
            <p className="text-xs text-[#666666] mt-1 font-medium">
              Every hamper features 14 handcrafted & personalized items assembled inside our signature matte black velvet gift chest.
            </p>
          </div>

          {/* 14 visual cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hamperItemsList.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="bg-[#F8F7F2] border border-[#E8E5DD] rounded-lg overflow-hidden group hover:border-[#C9A227] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {item.customizable && (
                    <span className="absolute top-2 right-2 bg-[#0B0B0B] text-[#C9A227] text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded border border-[#C9A227]/40">
                      Personalized
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs font-serif font-bold text-[#0B0B0B] uppercase">{item.name}</h3>
                    <p className="text-[11px] text-[#666666] mt-1 font-normal leading-relaxed">{item.shortDescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEP-BY-STEP CUSTOMIZATION WIZARD SECTION */}
      {isHamper && (
        <section className="mt-16 space-y-4">
          <div className="border-b border-[#E8E5DD] pb-3">
            <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#C9A227]" /> PERSONALIZATION CONCIERGE
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B0B0B] uppercase tracking-wide mt-1">
              Customize Your BLACKFAWN Hamper
            </h2>
            <p className="text-xs text-[#666666] mt-1 font-medium">
              Complete the simple 11-step customization wizard below to tailor your T-shirt size, engraved names, wish card, and accessories.
            </p>
          </div>

          <GiftHamperCustomizer
            initialValues={hamperCustomization}
            onAddToCart={handleHamperAddToCart}
            onBuyNow={handleHamperBuyNow}
          />
        </section>
      )}

      {/* Reviews list */}
      <section className="mt-16 bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E8E5DD] shadow-xs">
        <h2 className="text-lg font-serif font-bold text-[#0B0B0B] uppercase tracking-wide border-b border-[#E8E5DD] pb-3 mb-6">Customer Reviews</h2>
        
        {/* Write a review */}
        <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl mb-10 pb-10 border-b border-[#E8E5DD]">
          <h3 className="text-xs font-bold text-[#0B0B0B] uppercase tracking-wider">Submit feedback</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-1">Your Name</label>
              <input
                type="text"
                required
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-3 py-1.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-1">Star Rating</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-3 py-1.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227]"
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
            <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-1">Comment</label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded p-2.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-[#0B0B0B] text-white hover:text-[#C9A227] text-xs font-bold rounded flex items-center gap-1.5 uppercase tracking-wider cursor-pointer border border-[#0B0B0B]"
          >
            Submit Review <Send size={11} />
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-xs text-[#666666] font-medium">No reviews posted yet. Be the first to write one!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="border-b border-[#E8E5DD] pb-5 last:border-0 last:pb-0 space-y-2">
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
                  <span className="text-xs font-bold text-[#0B0B0B]">{rev.userName}</span>
                  {rev.verified && <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 font-bold rounded">VERIFIED BUYER</span>}
                  <span className="text-[10px] text-gray-400 font-medium ml-auto">{rev.date}</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed font-medium">{rev.comment}</p>
                {rev.reply && (
                  <div className="bg-[#F8F7F2] border-l-2 border-[#C9A227] p-3 rounded text-xs ml-4">
                    <p className="font-bold text-[#0B0B0B] uppercase tracking-wide">BLACKFAWN CONCIERGE REPLY:</p>
                    <p className="text-[#666666] mt-1 font-medium">{rev.reply}</p>
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
