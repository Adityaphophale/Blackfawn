import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

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
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedColorHex, setSelectedColorHex] = useState(product.colors[0]?.hex || '');
  const [sizeSelectorOpen, setSizeSelectorOpen] = useState(false);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleSizeClick = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, size, selectedColor);
    setSizeSelectorOpen(false);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-[#F8F8F6] border border-[#0B0B0B]/10 overflow-hidden transition-all duration-300 hover:border-[#C9A227] rounded-none shadow-xs hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSizeSelectorOpen(false);
      }}
    >
      {/* Product Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 cursor-pointer" onClick={onCardClick}>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-[#0B0B0B] text-[#F8F8F6] font-display font-black text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-none">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#C9A227] text-[#0B0B0B] font-display font-black text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-none">
              BESTSELLER
            </span>
          )}
          {product.isLimited && (
            <span className="bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227] font-display font-bold text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-none">
              LIMITED
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-700 text-white font-display font-black text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-none">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2 right-2 z-20 p-2 bg-[#F8F8F6]/90 border border-[#0B0B0B]/10 text-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-[#F8F8F6] transition-all cursor-pointer rounded-none"
          aria-label="Add to wishlist"
        >
          <Heart size={12} className={isWishlisted ? 'fill-[#0B0B0B] text-[#0B0B0B] hover:fill-[#F8F8F6]' : 'text-neutral-500'} />
        </button>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 bg-[#F8F8F6]/95 border-t border-[#0B0B0B]/10 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <AnimatePresence mode="wait">
            {!sizeSelectorOpen ? (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-1.5"
              >
                <button
                  id={`quickadd-trigger-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSizeSelectorOpen(true);
                  }}
                  className="flex-1 py-2 bg-[#0B0B0B] text-[#F8F8F6] text-[8px] font-display font-bold tracking-[0.2em] uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors flex items-center justify-center gap-1 rounded-none font-bold"
                >
                  <ShoppingBag size={10} /> QUICK ADD
                </button>
                <button
                  id={`quickview-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="p-2 bg-neutral-100 border border-[#0B0B0B]/10 text-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-[#F8F8F6] transition-colors rounded-none"
                  title="Quick View"
                >
                  <Eye size={10} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-1.5"
              >
                <div className="flex justify-between items-center text-[7px] font-mono tracking-widest text-neutral-500 uppercase">
                  <span>SELECT SIZE</span>
                  <button onClick={(e) => { e.stopPropagation(); setSizeSelectorOpen(false); }} className="hover:text-black font-bold">CLOSE</button>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleSizeClick(s, e)}
                      className="py-1 bg-neutral-100 hover:bg-[#C9A227] hover:text-[#0B0B0B] border border-[#0B0B0B]/10 text-[8px] font-mono text-black transition-colors uppercase rounded-none"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary and Hover Images */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out ${
            hovered && product.images[1] ? 'scale-103 opacity-0' : 'scale-100 opacity-100'
          }`}
          referrerPolicy="no-referrer"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} Alternate`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out ${
              hovered ? 'scale-100 opacity-100' : 'scale-97 opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1 bg-[#F8F8F6]">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#C9A227] uppercase">
            {product.category} • {product.fit}
          </span>
          {/* Color Dots */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedColor(c.name); setSelectedColorHex(c.hex); }}
                className={`w-2 h-2 rounded-none border transition-all ${
                  selectedColor === c.name ? 'border-[#C9A227] scale-125' : 'border-black/20 opacity-70'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
        
        <h3 
          onClick={onCardClick}
          className="mt-1 text-[13px] font-display font-bold text-[#0B0B0B] tracking-wide line-clamp-1 cursor-pointer hover:text-[#C9A227] transition-colors uppercase"
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center text-[#C9A227]">
            <Star size={8} className="fill-[#C9A227] text-[#C9A227]" />
          </div>
          <span className="text-[8px] font-mono text-neutral-500">
            {product.rating} <span className="text-neutral-400">({product.reviewCount})</span>
          </span>
          <span className="text-[8px] font-mono text-neutral-500 uppercase ml-auto">
            {selectedColor}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2.5 flex items-baseline justify-between border-t border-[#0B0B0B]/5">
          <div className="flex items-baseline gap-1.5">
            {product.discountPrice ? (
              <>
                <span className="text-xs font-display font-bold text-[#0B0B0B]">₹{product.discountPrice}</span>
                <span className="text-[9px] font-mono text-neutral-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-xs font-display font-bold text-[#0B0B0B]">₹{product.price}</span>
            )}
          </div>
          {product.stock <= 15 ? (
            <span className="text-[7px] font-mono text-[#D93025] uppercase tracking-widest font-black">Only {product.stock} Left</span>
          ) : (
            <span className="text-[7px] font-mono text-emerald-700 uppercase tracking-widest">In Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
