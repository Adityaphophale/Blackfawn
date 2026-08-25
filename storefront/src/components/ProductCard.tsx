import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../../shared/types/types.ts';

interface ProductCardProps {
  key?: any;
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onCardClick: () => void;
}

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onCardClick,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  
  const defaultVariant = product.variants?.[0];
  const price = defaultVariant?.price ?? product.variants?.[0]?.price ?? 999;
  const discountPrice = defaultVariant?.salePrice ?? product.variants?.[0]?.salePrice;
  const colors = product.variants ? Array.from(new Set(product.variants.map(v => v.color))).map(cName => ({
    name: cName,
    hex: cName.toLowerCase().includes('black') ? '#0B0B0B' : cName.toLowerCase().includes('white') ? '#F8F7F2' : cName.toLowerCase().includes('olive') ? '#4A5D4E' : '#8B8580'
  })) : [];

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const [sizeSelectorOpen, setSizeSelectorOpen] = useState(false);

  const discountPercent = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const handleSizeClick = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, size, selectedColor);
    setSizeSelectorOpen(false);
  };

  const sizes = product.variants ? Array.from(new Set(product.variants.map(v => v.size))) : ['S', 'M', 'L'];
  const images = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"];

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col bg-[#FFFFFF] border border-[#E8E5DD] hover:border-[#C9A227] transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSizeSelectorOpen(false);
      }}
    >
      {/* Product Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8F7F2] cursor-pointer" onClick={onCardClick}>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227] font-semibold text-[9px] tracking-widest uppercase px-2 py-0.5 shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#0B0B0B] text-white font-medium text-[9px] tracking-widest uppercase px-2 py-0.5 border border-[#1A1A1A]">
              Atelier Pick
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C9A227] text-[#0B0B0B] font-bold text-[9px] tracking-widest uppercase px-2 py-0.5">
              New Drop
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-20 p-2 bg-[#FFFFFF]/90 border border-[#E8E5DD] text-[#111111] hover:text-[#C9A227] shadow-sm hover:scale-105 transition-all cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart size={14} className={isWishlisted ? 'fill-[#C9A227] text-[#C9A227]' : 'text-gray-500'} />
        </button>

        {/* Hover Quick View / Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 bg-[#FFFFFF]/95 border-t border-[#E8E5DD] translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <AnimatePresence mode="wait">
            {!sizeSelectorOpen ? (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-2"
              >
                <button
                  id={`quickadd-trigger-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.category === 'Hampers & Gifting') {
                      onCardClick();
                    } else {
                      setSizeSelectorOpen(true);
                    }
                  }}
                  className="flex-1 py-2.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-[10px] font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={12} className="text-[#C9A227]" /> {product.category === 'Hampers & Gifting' ? 'Customize Hamper' : 'Select Size'}
                </button>
                <button
                  id={`quickview-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.category === 'Hampers & Gifting') {
                      onCardClick();
                    } else {
                      onQuickView(product);
                    }
                  }}
                  className="p-2.5 bg-[#F8F7F2] hover:bg-[#FFFFFF] border border-[#E8E5DD] text-[#0B0B0B] transition-colors cursor-pointer"
                  title="View Hamper Details"
                >
                  <Eye size={13} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center text-[9px] font-bold text-[#666666] uppercase tracking-widest">
                  <span>Select Size</span>
                  <button onClick={(e) => { e.stopPropagation(); setSizeSelectorOpen(false); }} className="text-gray-400 hover:text-[#0B0B0B]">Cancel</button>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {sizes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleSizeClick(s, e)}
                      className="py-1 bg-[#F8F7F2] hover:bg-[#0B0B0B] hover:text-[#C9A227] border border-[#E8E5DD] text-[10px] font-medium text-[#0B0B0B] transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Images */}
        <img
          src={images[0]}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            hovered && images[1] ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
          referrerPolicy="no-referrer"
        />
        {images[1] && (
          <img
            src={images[1]}
            alt={`${product.name} Alternate`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              hovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 bg-[#FFFFFF]">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-medium tracking-widest text-[#666666] uppercase">
            {product.category}
          </span>
          {/* Color Indicators */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {colors.map((c, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedColor(c.name); }}
                className={`w-2.5 h-2.5 rounded-full border transition-all ${
                  selectedColor === c.name ? 'border-[#C9A227] scale-125 ring-1 ring-[#C9A227]/50' : 'border-[#E8E5DD] opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
        
        <h3 
          onClick={onCardClick}
          className="mt-1.5 text-sm font-serif font-bold text-[#0B0B0B] line-clamp-1 cursor-pointer hover:text-[#C9A227] transition-colors capitalize tracking-wide"
        >
          {product.name}
        </h3>

        {/* Star Rating Section */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center bg-[#F3F1EB] text-[#0B0B0B] border border-[#E8E5DD] px-1.5 py-0.5 text-[9px] font-semibold">
            <span>{product.rating}</span>
            <Star size={9} className="fill-[#C9A227] text-[#C9A227] ml-0.5" />
          </div>
          <span className="text-[10px] text-[#666666] font-medium">
            ({product.reviewCount} Reviews)
          </span>
        </div>

        {/* Pricing Info */}
        <div className="mt-4 pt-3 flex items-baseline justify-between border-t border-[#E8E5DD]">
          <div className="flex items-baseline gap-2">
            {discountPrice ? (
              <>
                <span className="text-base font-semibold text-[#0B0B0B]">₹{discountPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{price}</span>
              </>
            ) : (
              <span className="text-base font-semibold text-[#0B0B0B]">₹{price}</span>
            )}
          </div>
          
          <span className="text-[9px] font-semibold tracking-widest text-[#C9A227] bg-[#F8F7F2] border border-[#E8E5DD] px-2 py-0.5 uppercase">
            Signature
          </span>
        </div>
      </div>
    </motion.div>
  );
}

