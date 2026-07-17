import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
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
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#f97316]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSizeSelectorOpen(false);
      }}
    >
      {/* Product Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 cursor-pointer" onClick={onCardClick}>
        
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#f97316] text-white font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-blue-600 text-white font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
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
          className="absolute top-2.5 right-2.5 z-20 p-2 bg-white/95 rounded-full border border-gray-200 text-gray-500 hover:text-red-500 shadow-md hover:scale-110 transition-all cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart size={14} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>

        {/* Hover Quick View / Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 bg-white/95 border-t border-gray-100 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                    setSizeSelectorOpen(true);
                  }}
                  className="flex-1 py-2 bg-[#f97316] text-white text-[10px] font-bold tracking-wider uppercase hover:bg-[#e0620d] transition-colors flex items-center justify-center gap-1.5 rounded-md cursor-pointer"
                >
                  <ShoppingBag size={11} /> Select Size
                </button>
                <button
                  id={`quickview-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 transition-colors rounded-md cursor-pointer"
                  title="Quick View Details"
                >
                  <Eye size={12} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-1.5"
              >
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Select Size Blueprint</span>
                  <button onClick={(e) => { e.stopPropagation(); setSizeSelectorOpen(false); }} className="text-gray-400 hover:text-gray-700">Cancel</button>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleSizeClick(s, e)}
                      className="py-1 bg-gray-50 hover:bg-[#f97316] hover:text-white border border-gray-200 text-[10px] font-semibold text-gray-800 transition-colors rounded-md cursor-pointer"
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
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out ${
            hovered && product.images[1] ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
          referrerPolicy="no-referrer"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} Alternate`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out ${
              hovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-1 bg-white">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            {product.category}
          </span>
          {/* Color Indicators */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedColor(c.name); setSelectedColorHex(c.hex); }}
                className={`w-2.5 h-2.5 rounded-full border transition-all ${
                  selectedColor === c.name ? 'border-[#f97316] scale-125 ring-1 ring-[#f97316]/50' : 'border-gray-300 opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
        
        <h3 
          onClick={onCardClick}
          className="mt-1.5 text-sm font-bold text-gray-900 line-clamp-1 cursor-pointer hover:text-[#f97316] transition-colors capitalize"
        >
          {product.name}
        </h3>

        {/* Star Rating Section */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex items-center bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
            <span>{product.rating}</span>
            <Star size={10} className="fill-emerald-700 text-emerald-700 ml-0.5" />
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            ({product.reviewCount} Ratings)
          </span>
        </div>

        {/* Pricing Info */}
        <div className="mt-3 pt-2.5 flex items-baseline justify-between border-t border-gray-100">
          <div className="flex items-baseline gap-1.5">
            {product.discountPrice ? (
              <>
                <span className="text-base font-extrabold text-gray-900">₹{product.discountPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-base font-extrabold text-gray-900">₹{product.price}</span>
            )}
          </div>
          
          {product.stock <= 15 ? (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Assured Quality
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
